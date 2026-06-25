"use client";

import React, { useState } from "react";
import { Monitor, Download, Sparkles, Phone, ArrowLeft, ShieldCheck, X, Mail } from "lucide-react";
import confetti from "canvas-confetti";

interface AuthPortalProps {
  onLoginSuccess: (userData: { name: string; email: string; isCreator: boolean }) => void;
}

export default function AuthPortal({ onLoginSuccess }: AuthPortalProps) {
  // Modes: "credentials_input" | "otp" | "welcome"
  const [mode, setMode] = useState<"credentials_input" | "otp" | "welcome">("credentials_input");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);
  
  // Custom Toasts and Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGmail, setCustomGmail] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = emailOrPhone.trim();
    if (!input) {
      alert("Please enter your email or mobile number.");
      return;
    }

    // Detect if input is email or phone number
    const isEmail = input.includes("@") || /[a-zA-Z]/.test(input);

    if (isEmail) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        alert("Please enter a valid email address.");
        return;
      }
    } else {
      // Validate phone number (should be 10 digits)
      const digitsOnly = input.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: input })
      });
      
      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        // Store code locally ONLY for simulated mode; real mode verifies on the server
        if (data.mode === "simulated") {
          setGeneratedOtp(data.code);
        } else {
          setGeneratedOtp("");
        }

        // Set temp user details
        if (isEmail) {
          setTempUser({
            name: input.split("@")[0],
            email: input,
            isCreator: false
          });
        } else {
          const digitsOnly = input.replace(/\D/g, "");
          setTempUser({
            name: `User +91${digitsOnly.slice(-4)}`,
            email: `user_${digitsOnly.slice(-4)}@oldverse.com`,
            isCreator: false
          });
        }

        setToastMessage(data.message);
        setMode("otp");
      } else {
        alert(data.error || "Failed to send verification code. Please try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      alert("Network error: " + err.message);
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
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim(), otpCode: code })
      });
      
      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        if (tempUser) {
          setMode("welcome");
          triggerEnterSequence(tempUser);
        }
      } else {
        alert(data.error || "Invalid verification code. Please try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      alert("Network error: " + err.message);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim() })
      });
      
      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        if (data.mode === "simulated") {
          setGeneratedOtp(data.code);
        } else {
          setGeneratedOtp("");
        }
        setToastMessage(data.message);
        setOtpCode("");
      } else {
        alert(data.error || "Failed to resend code.");
      }
    } catch (err: any) {
      setIsLoading(false);
      alert("Network error: " + err.message);
    }
  };

  const handleSocialSelect = (account: { name: string; email: string }) => {
    setIsLoading(true);
    setGoogleModalOpen(false);
    setTimeout(() => {
      setIsLoading(false);
      const socialUser = {
        name: account.name,
        email: account.email,
        isCreator: false
      };
      setMode("welcome");
      triggerEnterSequence(socialUser);
    }, 800);
  };

  const handleCustomGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = customGmail.trim();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    handleSocialSelect({
      name: email.split("@")[0],
      email: email
    });
  };

  const triggerEnterSequence = (userData: any) => {
    // Save user auth in local storage
    localStorage.setItem("oldverse_user", JSON.stringify(userData));

    // Dispatch store update event
    window.dispatchEvent(new Event("oldverse_store_update"));

    // Confetti blast
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

  const isInputEmail = emailOrPhone.includes("@") || /[a-zA-Z]/.test(emailOrPhone);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] relative px-4 select-none font-sans">
      
      {/* Floating System Toast for OTP Simulation */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#121926] border border-[#F5A623]/30 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-down max-w-sm w-full mx-4">
          <div className="h-2 w-2 rounded-full bg-[#F5A623] animate-pulse" />
          <p className="text-xs font-grotesk leading-normal flex-grow">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Subtle Background glow */}
      <div className="absolute inset-0 bg-cover bg-center filter brightness-[0.15] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-[#07090e]/60 pointer-events-none" />

      {/* Main Split Auth Container */}
      <div className="w-full max-w-4xl z-10 bg-[#121926] rounded-2xl border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        
        {/* Welcome Mode Animation */}
        {mode === "welcome" && tempUser && (
          <div className="w-full flex flex-col items-center justify-center py-20 px-8 text-center space-y-5 animate-fade-in bg-[#0f141d]">
            <div className="inline-flex p-4 rounded-full bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/25 animate-bounce">
              <Sparkles className="h-10 w-10 text-[#F5A623] fill-current" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase font-bebas">Login Successful</h2>
              <p className="text-lg font-semibold text-[#F5A623] font-grotesk">{tempUser.name}</p>
            </div>
            <p className="text-xs text-white/50 font-light font-grotesk">Redirecting you to the home dashboard...</p>
          </div>
        )}

        {mode !== "welcome" && (
          <>
            {/* LEFT SIDE PANEL: Brand info */}
            <div className="w-full md:w-5/12 bg-[#151b26] p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
              {/* Brand Logo */}
              <div className="flex items-center select-none group mb-8 md:mb-0">
                <img
                  src="/logo.png"
                  alt="The OldVerse Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* Pitch Info */}
              <div className="space-y-6">
                <p className="text-sm font-semibold leading-relaxed text-white/90 font-grotesk">
                  Premium OTT service in India, where you can watch original series, TV & Web shows, movies, and trending shows for free.
                </p>

                {/* Features List */}
                <div className="space-y-4 pt-2 font-grotesk">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                      <Monitor className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-white/80 font-medium">Watch on desktop, mobile or tablet.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                      <Download className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-white/80 font-medium">Download and watch anytime, anywhere.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center text-[#F5A623]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-white/80 font-medium">Subscribe for Ad-Lite experience.</span>
                  </div>
                </div>
              </div>

              {/* Blank spacer for alignment */}
              <div className="hidden md:block h-8" />
            </div>

            {/* RIGHT SIDE PANEL: Actions */}
            <div className="w-full md:w-7/12 bg-[#0f141d] p-8 md:p-12 relative flex flex-col justify-center">
              
              {/* FORM WRAPPERS */}
              {mode === "credentials_input" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="inline-block bg-[#F5A623] text-black font-extrabold px-3 py-1 text-sm rounded font-grotesk">
                      Sign In
                    </div>
                    <h2 className="text-base font-bold text-white font-grotesk">
                      Enjoy The OldVerse's exclusive features and benefits.
                    </h2>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    <div className="relative flex items-center border border-white/10 hover:border-white/20 bg-white/5 focus-within:border-[#F5A623] rounded-lg transition-colors overflow-hidden">
                      <div className="flex items-center gap-1.5 pl-4 pr-2 text-white/50 select-none">
                        {isInputEmail ? <Mail className="h-4 w-4 text-[#F5A623]" /> : <Phone className="h-4 w-4 text-[#F5A623]" />}
                        {!isInputEmail && emailOrPhone.length > 0 && <span className="text-sm font-bold text-white/70">+91</span>}
                      </div>
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Enter Email or Mobile number"
                        className="w-full pl-2 pr-4 py-3.5 bg-transparent text-sm text-white focus:outline-none placeholder-white/25 font-grotesk"
                      />
                    </div>
                    <p className="text-[11px] text-white/40 font-light font-grotesk">
                      {isInputEmail ? "We will send an OTP code to your email." : "We will send an SMS to verify your mobile number."}
                    </p>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#F5A623]/10 cursor-pointer flex items-center justify-center gap-2 font-grotesk"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
                      ) : (
                        "Next"
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1 font-grotesk">
                    <div className="h-[1px] bg-white/5 flex-grow" />
                    <span className="text-[10px] text-white/35 font-semibold uppercase tracking-wider">
                      Or continue with
                    </span>
                    <div className="h-[1px] bg-white/5 flex-grow" />
                  </div>

                  {/* Social Buttons */}
                  <div className="flex justify-center font-grotesk">
                    {/* Google Sign In Trigger */}
                    <button
                      onClick={() => setGoogleModalOpen(true)}
                      className="flex items-center justify-center gap-2.5 w-full py-3 border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 rounded-lg transition-colors text-xs font-semibold text-white/95 cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      Continue with Google (Gmail / Email)
                    </button>
                  </div>

                  {/* Footnotes */}
                  <div className="space-y-1.5 pt-4 text-[10px] text-white/40 font-light border-t border-white/5 text-center sm:text-left font-grotesk">
                    <p>
                      By continuing, you agree to The OldVerse's{" "}
                      <a href="#" className="text-[#F5A623] hover:underline">
                        Conditions of Use
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#F5A623] hover:underline">
                        Privacy Notice
                      </a>
                    </p>
                    <p>On login, all your Watch History data will be synced to the server.</p>
                  </div>

                </div>
              )}

              {/* OTP VERIFICATION VIEW */}
              {mode === "otp" && (
                <div className="space-y-6 animate-fade-in font-grotesk">
                  
                  {/* Back button */}
                  <button
                    onClick={() => setMode("credentials_input")}
                    className="flex items-center gap-1.5 text-xs text-[#F5A623] hover:text-[#F5A623]/85 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <div className="space-y-2">
                    <ShieldCheck className="h-10 w-10 text-[#F5A623] mx-auto md:mx-0 animate-pulse" />
                    <h3 className="text-lg font-bold text-white">Enter OTP Code</h3>
                    <p className="text-xs text-white/60">
                      We sent a verification code to{" "}
                      <span className="text-white font-bold">
                        {isInputEmail ? emailOrPhone : `+91 ${emailOrPhone}`}
                      </span>.
                    </p>
                  </div>

                  <form onSubmit={handleOtpVerify} className="space-y-4">
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full text-center text-lg font-bold tracking-widest py-3 border border-white/10 hover:border-white/20 bg-white/5 focus:border-[#F5A623] rounded-lg focus:outline-none text-white placeholder-white/25"
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-black font-bold text-sm tracking-wide transition-all cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-t-2 border-b-2 border-black rounded-full animate-spin mx-auto"></div>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </form>

                  <div className="text-center md:text-left">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-xs text-white/50 hover:text-[#F5A623] transition-colors cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>

                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* MOCK GOOGLE LOGIN ACCOUNT PICKER MODAL */}
      {googleModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center px-4 font-sans">
          <div className="bg-[#121926] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={() => setGoogleModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Google Logo / Header */}
            <div className="text-center space-y-2">
              <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <h3 className="text-lg font-bold text-white font-grotesk">Choose a Google Account</h3>
              <p className="text-xs text-white/50 font-grotesk">to continue to The OldVerse</p>
            </div>

            {/* List of Mock Accounts */}
            <div className="space-y-3 font-grotesk">
              <button
                onClick={() => handleSocialSelect({ name: "John Doe", email: "johndoe@gmail.com" })}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-left transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-[#F5A623] text-black font-extrabold flex items-center justify-center text-sm">
                  J
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">John Doe</p>
                  <p className="text-[10px] text-white/50 truncate">johndoe@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() => handleSocialSelect({ name: "Sarah Chen", email: "sarah.chen@gmail.com" })}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-left transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-[#FF8C32] text-black font-extrabold flex items-center justify-center text-sm">
                  S
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Sarah Chen</p>
                  <p className="text-[10px] text-white/50 truncate">sarah.chen@gmail.com</p>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 font-grotesk">
              <div className="h-[1px] bg-white/5 flex-grow" />
              <span className="text-[9px] text-white/35 font-semibold uppercase tracking-wider">
                Or use another email
              </span>
              <div className="h-[1px] bg-white/5 flex-grow" />
            </div>

            {/* Use custom Gmail form */}
            <form onSubmit={handleCustomGmailSubmit} className="space-y-3 font-grotesk">
              <div className="relative flex items-center border border-white/10 hover:border-white/20 bg-white/5 focus-within:border-[#F5A623] rounded-lg transition-colors overflow-hidden">
                <div className="pl-3.5 pr-2 text-white/50 select-none">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={customGmail}
                  onChange={(e) => setCustomGmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-2 pr-4 py-3 bg-transparent text-xs text-white focus:outline-none placeholder-white/25"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-[#F5A623] hover:text-black text-white font-bold text-xs transition-all cursor-pointer"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
