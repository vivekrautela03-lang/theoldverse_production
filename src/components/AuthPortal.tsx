"use client";

import React, { useState } from "react";
import { Monitor, Download, Sparkles, Phone, ArrowLeft, ShieldCheck, X } from "lucide-react";
import confetti from "canvas-confetti";

interface AuthPortalProps {
  onLoginSuccess: (userData: { name: string; email: string; isCreator: boolean }) => void;
}

export default function AuthPortal({ onLoginSuccess }: AuthPortalProps) {
  // Modes: "phone_input" | "otp" | "welcome"
  const [mode, setMode] = useState<"phone_input" | "otp" | "welcome">("phone_input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setTempUser({
        name: `User +91${phoneNumber.slice(-4)}`,
        email: `user_${phoneNumber.slice(-4)}@oldverse.com`,
        isCreator: false
      });
      setMode("otp");
    }, 1000);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "1234") {
      alert("Invalid code. Please enter '1234' to verify access.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (tempUser) {
        setMode("welcome");
        triggerEnterSequence(tempUser);
      }
    }, 1000);
  };

  const handleSocialLogin = (platform: "Google" | "Facebook") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const socialUser = {
        name: `${platform} Explorer`,
        email: `explorer_${platform.toLowerCase()}@oldverse.com`,
        isCreator: false
      };
      setMode("welcome");
      triggerEnterSequence(socialUser);
    }, 800);
  };

  const handleSkip = () => {
    const guestUser = {
      name: "Guest Viewer",
      email: "guest@oldverse.com",
      isCreator: false
    };
    onLoginSuccess(guestUser);
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
      colors: ["#0070f3", "#38bdf8", "#FFFFFF"]
    });

    setTimeout(() => {
      onLoginSuccess(userData);
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] relative px-4 select-none font-sans">
      
      {/* Subtle Background glow */}
      <div className="absolute inset-0 bg-cover bg-center filter brightness-[0.15] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-[#07090e]/60 pointer-events-none" />

      {/* Main Split Auth Container */}
      <div className="w-full max-w-4xl z-10 bg-[#121926] rounded-2xl border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        
        {/* Welcome Mode Animation */}
        {mode === "welcome" && tempUser && (
          <div className="w-full flex flex-col items-center justify-center py-20 px-8 text-center space-y-5 animate-fade-in bg-[#0f141d]">
            <div className="inline-flex p-4 rounded-full bg-[#0070f3]/10 text-[#0070f3] border border-[#0070f3]/25 animate-bounce">
              <Sparkles className="h-10 w-10 text-[#0070f3] fill-current" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">Login Successful</h2>
              <p className="text-lg font-semibold text-[#0070f3]">{tempUser.name}</p>
            </div>
            <p className="text-xs text-white/50 font-light">Redirecting you to the home dashboard...</p>
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
                <p className="text-sm font-semibold leading-relaxed text-white/90">
                  Premium OTT service in India, where you can watch original series, TV & Web shows, movies, and trending shows for free.
                </p>

                {/* Features List */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#0070f3]/10 border border-[#0070f3]/20 flex items-center justify-center text-[#0070f3]">
                      <Monitor className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-white/80 font-medium">Watch on desktop, mobile or tablet.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#0070f3]/10 border border-[#0070f3]/20 flex items-center justify-center text-[#0070f3]">
                      <Download className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-white/80 font-medium">Download and watch anytime, anywhere.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#0070f3]/10 border border-[#0070f3]/20 flex items-center justify-center text-[#0070f3]">
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
              
              {/* Skip Link (Top Right Corner) */}
              <button
                onClick={handleSkip}
                className="absolute top-6 right-8 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Skip for now
              </button>

              {/* FORM WRAPPERS */}
              {mode === "phone_input" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="inline-block bg-[#0070f3] text-white font-extrabold px-3 py-1 text-sm rounded">
                      Login
                    </div>
                    <h2 className="text-base font-bold text-white">
                      Enjoy The OldVerse's exclusive features and benefits.
                    </h2>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div className="relative flex items-center border border-white/10 hover:border-white/20 bg-white/5 focus-within:border-[#0070f3] rounded-lg transition-colors overflow-hidden">
                      <div className="flex items-center gap-1.5 pl-4 pr-2 text-white/50 select-none">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-bold text-white/70">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter Mobile Number"
                        className="w-full pl-2 pr-4 py-3.5 bg-transparent text-sm text-white focus:outline-none placeholder-white/25"
                      />
                    </div>
                    <p className="text-[11px] text-white/40 font-light">
                      You'll get an SMS to verify your number.
                    </p>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-lg bg-[#0070f3] hover:bg-[#0070f3]/85 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#0070f3]/15 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      ) : (
                        "Next"
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-[1px] bg-white/5 flex-grow" />
                    <span className="text-[10px] text-white/35 font-semibold uppercase tracking-wider">
                      Or, use one of the following options.
                    </span>
                    <div className="h-[1px] bg-white/5 flex-grow" />
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Google */}
                    <button
                      onClick={() => handleSocialLogin("Google")}
                      className="flex items-center justify-center gap-2.5 py-3 border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 rounded-lg transition-colors text-xs font-semibold text-white/95 cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={() => handleSocialLogin("Facebook")}
                      className="flex items-center justify-center gap-2.5 py-3 border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 rounded-lg transition-colors text-xs font-semibold text-white/95 cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Continue with Facebook
                    </button>
                  </div>

                  {/* Footnotes */}
                  <div className="space-y-1.5 pt-4 text-[10px] text-white/40 font-light border-t border-white/5 text-center sm:text-left">
                    <p>
                      By continuing, you agree to The OldVerse's{" "}
                      <a href="#" className="text-[#0070f3] hover:underline">
                        Conditions of Use
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#0070f3] hover:underline">
                        Privacy Notice
                      </a>
                    </p>
                    <p>On login, all your Watch History data will be synced to the server.</p>
                  </div>

                </div>
              )}

              {/* OTP VERIFICATION VIEW */}
              {mode === "otp" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Back button */}
                  <button
                    onClick={() => setMode("phone_input")}
                    className="flex items-center gap-1.5 text-xs text-[#0070f3] hover:text-[#0070f3]/85 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Change phone number
                  </button>

                  <div className="space-y-2">
                    <ShieldCheck className="h-10 w-10 text-[#0070f3] mx-auto md:mx-0 animate-pulse" />
                    <h3 className="text-lg font-bold text-white">Enter OTP Code</h3>
                    <p className="text-xs text-white/60">
                      We sent a mock 4-digit code to <span className="text-white font-bold">+91 {phoneNumber}</span>.
                    </p>
                    <span className="inline-block text-[10px] text-[#0070f3] bg-[#0070f3]/10 border border-[#0070f3]/25 px-2 py-0.5 rounded font-semibold">
                      Tip: Enter "1234" to verify
                    </span>
                  </div>

                  <form onSubmit={handleOtpVerify} className="space-y-4">
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full text-center text-lg font-bold tracking-widest py-3 border border-white/10 hover:border-white/20 bg-white/5 focus:border-[#0070f3] rounded-lg focus:outline-none text-white placeholder-white/25"
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-lg bg-[#0070f3] hover:bg-[#0070f3]/85 text-white font-bold text-sm tracking-wide transition-all cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </form>

                  <div className="text-center md:text-left">
                    <button
                      type="button"
                      onClick={() => alert("Verification code re-sent. Use code '1234'")}
                      className="text-xs text-white/50 hover:text-[#0070f3] transition-colors cursor-pointer"
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
    </div>
  );
}
