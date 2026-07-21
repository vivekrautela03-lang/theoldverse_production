"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-oldverse-bg flex items-center justify-center pt-24 px-4 font-sans selection:bg-oldverse-accent selection:text-oldverse-bg">
      <div className="max-w-md w-full bg-oldverse-card/40 border border-white/5 p-8 sm:p-10 rounded-2xl backdrop-blur-md space-y-6 shadow-2xl text-center relative overflow-hidden">
        
        {/* Glow behind icon */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-4">
          <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-lg shadow-red-500/5">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-bebas text-4xl sm:text-5xl text-oldverse-text tracking-wider uppercase leading-none">
              Access Forbidden
            </h1>
            <p className="text-[10px] text-oldverse-accent font-grotesk font-bold uppercase tracking-widest">
              Error 403 &bull; Unauthorized Area
            </p>
          </div>

          <div className="h-px w-16 bg-white/10 mx-auto" />

          <p className="text-xs sm:text-sm text-oldverse-secondary font-light leading-relaxed max-w-xs mx-auto">
            You do not have the required administrative or creator privileges to access this restricted route.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 rounded-xl text-xs font-grotesk font-semibold text-oldverse-text tracking-wide transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return Home
          </Link>
          
          <Link
            href="/auth"
            className="flex-1 py-3 bg-oldverse-accent hover:bg-white text-oldverse-bg rounded-xl text-xs font-grotesk font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-oldverse-accent/15"
          >
            <Lock className="h-3.5 w-3.5" /> Change Account
          </Link>
        </div>

      </div>
    </div>
  );
}
