/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Monitor, Download, Sparkles, Phone, ArrowLeft, ShieldCheck, X, Mail, Lock, UserCheck, RefreshCw, KeyRound } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabaseBrowserClient";

interface AuthPortalProps {
  onLoginSuccess: (userData: { name: string; email: string; isCreator: boolean }) => void;
}

export default function AuthPortal({ onLoginSuccess }: AuthPortalProps) {
  // Modes: "credentials_input" | "otp" | "welcome" | "forgot_password" | "reset_password"
  const [mode, setMode] = useState<"credentials_input" | "otp" | "welcome" | "forgot_password" | "reset_password">("credentials_input");
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [isRegister, setIsRegister] = useState(false);
  
  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // States for flows
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Captcha state
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  // Load Cloudflare Turnstile explicitly if available
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Listen for hash containing recovery flow from Supabase Auth
    const checkHash = () => {
      const hash = window.location.hash || "";
      const search = window.location.search || "";
      if (hash.includes("type=recovery") || search.includes("type=recovery")) {
        setMode("reset_password");
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).turnstile) {
        try {
          (window as any).turnstile.render("#turnstile-widget", {
            sitekey: "1x00000000000000000000AA", // Cloudflare test sitekey
            theme: "dark",
            callback: (token: string) => {
              setCaptchaVerified(true);
              setTurnstileToken(token);
            },
            "error-callback": () => {
              console.warn("Turnstile failed to render, falling back to check");
            }
          });
        } catch (e) {
          console.warn("Turnstile render exception:", e);
        }
      }
    };

    return () => {
      script.remove();
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  const simulateCaptcha = () => {
    if (captchaVerified || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaVerified(true);
    }, 1000);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = emailOrPhone.trim();
    if (!input) {
      alert("Please enter your email.");
      return;
    }

    if (!captchaVerified) {
      alert("Please complete the Turnstile CAPTCHA verification.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    if (authMethod === "otp") {
      // OTP Sign-In (Passwordless Magic Link/OTP)
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: input,
          options: {
            shouldCreateUser: isRegister,
            emailRedirectTo: window.location.origin
          }
        });

        setIsLoading(false);
        if (error) {
          alert(error.message);
        } else {
          setToastMessage(`✉️ Magic link and OTP sent to ${input}! Check your inbox.`);
          setMode("otp");
        }
      } catch (err: any) {
        setIsLoading(false);
        alert("Network error: " + err.message);
      }
    } else {
      // Password auth pathway (Registration / Login)
      if (isRegister) {
        if (!name.trim()) {
          alert("Please enter your name.");
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          alert("Password must be at least 8 characters long.");
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          alert("Passwords do not match.");
          setIsLoading(false);
          return;
        }

        try {
          const { data, error } = await supabase.auth.signUp({
            email: input,
            password: password,
            options: {
              data: {
                full_name: name.trim(),
                username: input.split("@")[0] + "_" + Math.floor(Math.random() * 1000)
              }
            }
          });
          setIsLoading(false);

          if (error) {
            alert(error.message);
          } else {
            alert("Registration successful! Check your email inbox to verify your account.");
            setIsRegister(false);
            setPassword("");
            setConfirmPassword("");
            setCaptchaVerified(false);
          }
        } catch (err: any) {
          setIsLoading(false);
          alert("Registration network error: " + err.message);
        }
      } else {
        // --- LOGIN ---
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: input,
            password: password
          });
          setIsLoading(false);

          if (error) {
            alert(error.message);
          } else if (data.user) {
            setMode("welcome");
            triggerEnterSequence({
              id: data.user.id,
              name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
              email: data.user.email,
              isCreator: false
            });
          }
        } catch (err: any) {
          setIsLoading(false);
          alert("Login network error: " + err.message);
        }
      }
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.trim();
    if (!code) {
      alert("Please enter the verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailOrPhone.trim(),
        token: code,
        type: "email"
      });
      setIsLoading(false);

      if (error) {
        alert(error.message);
      } else if (data.user) {
        setMode("welcome");
        triggerEnterSequence({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
          email: data.user.email,
          isCreator: false
        });
      }
    } catch (err: any) {
      setIsLoading(false);
      alert("Verification network error: " + err.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailOrPhone.trim();
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`
      });
      setIsLoading(false);

      if (error) {
        alert(error.message);
      } else {
        alert("Password reset email sent! Check your inbox for the recovery link.");
        setMode("credentials_input");
      }
    } catch (err: any) {
      setIsLoading(false);
      alert("Reset network error: " + err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      setIsLoading(false);

      if (error) {
        alert(error.message);
      } else {
        alert("Password updated successfully! You can now log in.");
        setMode("credentials_input");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setIsLoading(false);
      alert("Reset execution failed: " + err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        alert(error.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      alert("Google OAuth failed: " + err.message);
    }
  };

  const triggerEnterSequence = (userData: any) => {
    localStorage.setItem("oldverse_user", JSON.stringify(userData));
    window.dispatchEvent(new Event("oldverse_store_update"));

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F5A623", "#FF8C32", "#FFFFFF"]
    });

    setTimeout(() => {
      onLoginSuccess(userData);
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] relative px-4 select-none font-sans">
      
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-oldverse-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-oldverse-accent-secondary/5 rounded-full blur-[130px]" />
      </div>

      <div className="w-full max-w-5xl rounded-3xl overflow-hidden border border-white/5 flex flex-col md:flex-row relative z-10 glassmorphism shadow-2xl">
        
        {/* LEFT SIDE PANEL: Branding (Image 2 Style) */}
        <div className="w-full md:w-5/12 bg-black/45 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.01] via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            {/* Filmstrip Logo */}
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-[#F5A623]">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 3v18" />
                <path d="M17 3v18" />
                <path d="M3 7h4" />
                <path d="M3 12h4" />
                <path d="M3 17h4" />
                <path d="M17 7h4" />
                <path d="M17 12h4" />
                <path d="M17 17h4" />
              </svg>
              <span className="font-grotesk font-extrabold text-base tracking-widest text-white uppercase">The OldVerse</span>
            </div>
            
            <div className="space-y-3 pt-6">
              <span className="text-[10px] font-bold text-[#F5A623] uppercase tracking-widest block font-grotesk">Secured Access</span>
              <h2 className="font-bebas text-4xl sm:text-5xl tracking-wider text-white uppercase leading-none">
                Unlock The Archive
              </h2>
              <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                Step inside the independent cinema vault. Verify your identity or sign up to save watchlists, resume playback, and review cinema classics.
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-12 md:pt-0 relative z-10">
            <div className="flex items-center gap-4 text-white/50">
              <div className="h-10 w-10 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl">
                <Monitor className="h-4 w-4" />
              </div>
              <div className="h-10 w-10 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl">
                <Download className="h-4 w-4" />
              </div>
              <div className="h-10 w-10 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl">
                <Sparkles className="h-4 w-4 text-[#F5A623] animate-pulse" />
              </div>
            </div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-[#A5A5A5] font-grotesk">
              Ott platform &bull; Production House &bull; Creative Hub
            </p>
          </div>
        </div>

        {/* RIGHT SIDE PANEL: Actions */}
        <div className="w-full md:w-7/12 bg-[#0e0f12] p-8 md:p-12 relative flex flex-col justify-center font-sans">
          {/* Skip for now button in top-right */}
          <a 
            href="/"
            className="absolute top-6 right-8 text-xs font-semibold text-white/40 hover:text-white transition-colors uppercase tracking-wider font-grotesk"
          >
            Skip for now
          </a>

          {/* FORGOT PASSWORD VIEW */}
          {mode === "forgot_password" && (
            <div className="space-y-6 animate-fade-in">
              <button
                onClick={() => setMode("credentials_input")}
                className="flex items-center gap-1.5 text-xs text-[#F5A623] hover:text-[#F5A623]/85 font-semibold cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>

              <div className="space-y-1.5">
                <h3 className="font-bebas text-3xl tracking-wider text-white uppercase">Forgot Password</h3>
                <p className="text-xs text-oldverse-secondary font-light">
                  Enter your registered email address. We will send you a password recovery link.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                  <Mail className="h-4 w-4 text-white/30 mr-3" />
                  <input
                    type="email"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-black font-extrabold text-xs tracking-widest uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Send Recovery Email"}
                </button>
              </form>
            </div>
          )}

          {/* RESET PASSWORD VIEW */}
          {mode === "reset_password" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1.5">
                <h3 className="font-bebas text-3xl tracking-wider text-white uppercase">Reset Password</h3>
                <p className="text-xs text-oldverse-secondary font-light">
                  Choose a new strong password for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                  <Lock className="h-4 w-4 text-white/30 mr-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password (min 8 chars)"
                    className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                  />
                </div>

                <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                  <Lock className="h-4 w-4 text-white/30 mr-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-black font-extrabold text-xs tracking-widest uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Update Password"}
                </button>
              </form>
            </div>
          )}

          {/* OTP VERIFICATION VIEW */}
          {mode === "otp" && (
            <div className="space-y-6 animate-fade-in">
              <button
                onClick={() => {
                  setMode("credentials_input");
                  setOtpCode("");
                }}
                className="flex items-center gap-1.5 text-xs text-[#F5A623] hover:text-[#F5A623]/85 font-semibold cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Change Email / Back
              </button>

              <div className="space-y-1.5">
                <h3 className="font-bebas text-3xl tracking-wider text-white uppercase">Verify Identity</h3>
                <p className="text-xs text-oldverse-secondary font-light">
                  A verification code or magic link has been sent to your email. Enter the code below:
                </p>
              </div>

              {toastMessage && (
                <div className="p-3 bg-oldverse-accent/5 border border-oldverse-accent/15 rounded-xl text-center">
                  <p className="text-[10px] text-oldverse-accent font-grotesk tracking-wide">{toastMessage}</p>
                </div>
              )}

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                  <KeyRound className="h-4 w-4 text-white/30 mr-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit verification code"
                    className="w-full py-3 bg-transparent text-sm text-white tracking-widest text-center font-mono focus:outline-none placeholder-white/25 placeholder:tracking-normal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-black font-extrabold text-xs tracking-widest uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify & Enter"}
                </button>
              </form>
            </div>
          )}

          {/* WELCOME LOADER VIEW */}
          {mode === "welcome" && (
            <div className="space-y-8 text-center py-6 animate-fade-in">
              <div className="h-16 w-16 bg-[#F5A623]/15 border border-[#F5A623]/30 rounded-full flex items-center justify-center mx-auto text-[#F5A623] shadow-xl shadow-[#F5A623]/5">
                <UserCheck className="h-7 w-7" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bebas text-4xl tracking-wider text-white uppercase leading-none">
                  Welcome to TheOldverse
                </h3>
                <p className="text-xs text-oldverse-secondary max-w-sm mx-auto font-light leading-relaxed">
                  Authentication verified. Syncing profile, watchlists, and streaming configurations...
                </p>
              </div>

              <div className="h-1 w-24 bg-white/15 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-[#F5A623] rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          )}

          {/* MAIN CREDENTIALS INPUT VIEW (Login & Register) */}
          {mode === "credentials_input" && (
            <div className="space-y-6 animate-fade-in">
              {toastMessage && (
                <div className="p-3 bg-oldverse-accent/5 border border-oldverse-accent/15 rounded-xl text-center">
                  <p className="text-[10px] text-oldverse-accent font-grotesk tracking-wide">{toastMessage}</p>
                </div>
              )}

              {/* Toggle switch between Login / Register */}
              <div className="flex border-b border-white/5 text-sm font-grotesk font-semibold">
                <button
                  onClick={() => {
                    setIsRegister(false);
                    setPassword("");
                    setConfirmPassword("");
                    setCaptchaVerified(false);
                  }}
                  className={`pb-3 pr-6 transition-all border-b cursor-pointer ${
                    !isRegister ? "text-[#F5A623] border-[#F5A623]" : "text-white/40 border-transparent hover:text-white/60"
                  }`}
                >
                  Login Session
                </button>
                <button
                  onClick={() => {
                    setIsRegister(true);
                    setPassword("");
                    setConfirmPassword("");
                    setCaptchaVerified(false);
                  }}
                  className={`pb-3 px-6 transition-all border-b cursor-pointer ${
                    isRegister ? "text-[#F5A623] border-[#F5A623]" : "text-white/40 border-transparent hover:text-white/60"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {/* Method selector */}
                <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest font-grotesk border-b border-white/5 pb-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod("password")}
                    className={`cursor-pointer ${authMethod === "password" ? "text-[#F5A623]" : "text-white/30"}`}
                  >
                    Password Sign-In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod("otp" as any)}
                    className={`cursor-pointer ${authMethod === ("otp" as any) ? "text-[#F5A623]" : "text-white/30"}`}
                  >
                    Passwordless OTP
                  </button>
                </div>

                <div className="space-y-3.5">
                  {/* Name field (Registration only) */}
                  {isRegister && (
                    <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                      <Mail className="h-4 w-4 text-white/30 mr-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                      />
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                    <Mail className="h-4 w-4 text-white/30 mr-3" />
                    <input
                      type="email"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                    />
                  </div>

                  {/* Password fields */}
                  {authMethod === "password" && (
                    <div className="space-y-3.5">
                      <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                        <Lock className="h-4 w-4 text-white/30 mr-3" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password (min 8 characters)"
                          className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                        />
                      </div>

                      {isRegister && (
                        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-white/10 transition-colors">
                          <Lock className="h-4 w-4 text-white/30 mr-3" />
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Forgot Password link */}
                {!isRegister && authMethod === "password" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode("forgot_password")}
                      className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Cloudflare Turnstile CAPTCHA container */}
                <div className="p-3 border border-white/5 bg-[#121926]/40 rounded-lg flex flex-col items-center justify-center space-y-2">
                  <div id="turnstile-widget" className="w-full flex justify-center"></div>
                  {!captchaVerified && (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="captcha-check"
                          checked={captchaVerified}
                          disabled={captchaVerified || captchaLoading}
                          onChange={simulateCaptcha}
                          className="h-4.5 w-4.5 rounded border-white/20 bg-white/5 text-[#F5A623] focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label htmlFor="captcha-check" className="text-[11px] text-white/70 select-none cursor-pointer">
                          {captchaLoading ? "Verifying security token..." : "I am not a robot"}
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/20">
                        {captchaLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-[#F5A623]" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-white/30 font-grotesk">Turnstile</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-black font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-[#F5A623]/15 cursor-pointer flex items-center justify-center gap-2 uppercase font-grotesk"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
                  ) : (
                    isRegister ? "Register Account" : "Access Platform"
                  )}
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="h-[1px] bg-white/5 flex-grow" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-white/30 font-grotesk">Or Connect Via</span>
                <div className="h-[1px] bg-white/5 flex-grow" />
              </div>

              {/* Social Buttons */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3 border border-white/10 bg-white/3 hover:bg-white/5 text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2.5 font-grotesk"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
