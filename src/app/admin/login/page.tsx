"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, RefreshCw, ArrowLeft, CheckCircle2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [mode, setMode] = useState<"login" | "forgot">("login");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: email, password, authMethod: "password" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg("Authentication verified. Loading control center...");
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
      } else {
        setErrorMsg(data.error || "Invalid administrator credentials. Access denied.");
      }
    } catch {
      setErrorMsg("Network or server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Password recovery link dispatched to administrator email.");
      } else {
        setErrorMsg(data.error || "Failed to dispatch recovery link.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0B0E13] border border-[rgba(141,190,255,0.15)] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative z-10 font-grotesk">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto shadow-xl">
          <img src="/favicon.png" alt="TheOldverse Logo" className="h-8 w-8 object-contain" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8DBEFF] font-mono block">
            SECURED ADMIN SYSTEM
          </span>
          <h1 className="font-bebas text-4xl tracking-wider text-white uppercase leading-none mt-1">
            THEOLDVERSE CONTROL
          </h1>
          <p className="text-xs text-[#B8C2CC] font-light mt-1.5 leading-relaxed">
            Log in with an authorized administrator account to manage productions, CMS content, and website resources.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-center animate-fade-in">
          <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3.5 bg-[#8DBEFF]/10 border border-[#8DBEFF]/20 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#8DBEFF]" />
          <p className="text-xs text-[#8DBEFF] font-semibold">{successMsg}</p>
        </div>
      )}

      {/* FORGOT MODE */}
      {mode === "forgot" ? (
        <form onSubmit={handleForgotSubmit} className="space-y-5 animate-fade-in">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="flex items-center gap-1.5 text-xs text-[#8DBEFF] hover:text-[#CFE8FF] font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider block">
              Administrator Email
            </label>
            <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-4 py-1.5 focus-within:border-[#8DBEFF]">
              <Mail className="h-4 w-4 text-white/40 mr-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theoldverse.com"
                className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.02] cursor-pointer flex items-center justify-center"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Send Recovery Email"}
          </button>
        </form>
      ) : (
        /* LOGIN MODE */
        <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-4 py-1.5 focus-within:border-[#8DBEFF]">
                <Mail className="h-4 w-4 text-white/40 mr-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="theoldverse@gmail.com"
                  className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/80 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-white/40 hover:text-[#8DBEFF] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-4 py-1.5 focus-within:border-[#8DBEFF]">
                <Lock className="h-4 w-4 text-white/40 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full py-3 bg-transparent text-sm text-white focus:outline-none placeholder-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#8DBEFF] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-white/60 select-none cursor-pointer">
                Remember session on this device
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Authenticate & Enter</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono">
          Protected &bull; Row Level Security &bull; Supabase Auth
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#050608] text-white flex items-center justify-center p-4 relative font-grotesk overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#8DBEFF]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-[#CFE8FF]/5 rounded-full blur-[130px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-[#B8C2CC] space-y-3">
            <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
            <p>Loading security control center...</p>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
