"use client";

import React from "react";
import Link from "next/link";
import { Cookie, Key, BarChart3, Settings, ShieldAlert, Mail, ArrowLeft, ToggleLeft } from "lucide-react";

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      title: "1. Essential Cookies",
      icon: Key,
      desc: "These cookies are absolutely necessary for the core security and operation of The OldVerse. They enable authentication mechanisms, protect API endpoints from Cross-Site Request Forgery (CSRF), prevent brute-force attacks, and track session rotation. Without these cookies, security gates cannot function.",
      details: "Examples: session_at (Access Token JWT), session_rt (Refresh Token), admin_session (Sudo Mode token)."
    },
    {
      title: "2. Analytics Cookies",
      icon: BarChart3,
      desc: "Analytics cookies collect anonymous data about how visitors interact with our website. This includes tracking page views, search queries, average watch duration, and source traffic. We use this data strictly to optimize site performance and catalog recommendations.",
      details: "Examples: Google Analytics tracker tokens (_ga, _gid), page flow session metrics."
    },
    {
      title: "3. Functional Cookies",
      icon: Settings,
      desc: "Functional cookies allow our website to remember choices you make (such as your volume preferences in the Video Player, your dark mode selections, or your layout filter queries). They provide a highly customized and frictionless user experience.",
      details: "Examples: video_player_volume, search_filters_preference."
    },
    {
      title: "4. Third-Party Cookies",
      icon: ShieldAlert,
      desc: " trusted third parties may place cookies on your device when you interact with embeds on our website. For instance, YouTube, Instagram, and Cloudflare Turnstile CAPTCHA utilize cookies to verify user identity, process video streams, and prevent bot traffic.",
      details: "Examples: cf_clearance (Turnstile human validation), YouTube embed user identifiers."
    }
  ];

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Back navigation */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-grotesk font-semibold uppercase tracking-wider text-oldverse-secondary hover:text-oldverse-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block bg-oldverse-accent/15 px-3 py-1 rounded-full w-fit mx-auto border border-oldverse-accent/25">
            Legal Center
          </span>
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none cinematic-glow">
            Cookie Policy
          </h1>
          <p className="text-oldverse-secondary text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Learn how we use cookies and similar trackers to safeguard and optimize your browsing experience.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-oldverse-secondary font-grotesk tracking-wider">
            <span>Last Updated:</span>
            <span className="font-bold text-oldverse-text">June 27, 2026</span>
          </div>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Cookie Categories Details */}
        <div className="space-y-6">
          <h2 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase text-center sm:text-left">
            Types of Cookies We Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cookieTypes.map((cookie, idx) => {
              const Icon = cookie.icon;
              return (
                <div
                  key={idx}
                  className="glassmorphism-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between hover:border-oldverse-accent/25 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-oldverse-accent/15 border border-oldverse-accent/25 rounded-lg flex items-center justify-center text-oldverse-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                        {cookie.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-oldverse-secondary font-light leading-relaxed">
                      {cookie.desc}
                    </p>
                  </div>

                  <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-[10px] font-mono text-oldverse-accent/90">
                    <span className="font-bold uppercase tracking-wide block mb-1 text-white/50">Technical details:</span>
                    {cookie.details}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Cookie Preferences & Browser Controls */}
        <div className="glassmorphism p-8 sm:p-10 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Cookie className="h-32 w-32 text-white" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-3">
              <ToggleLeft className="h-6 w-6 text-oldverse-accent" />
              5. Controlling Cookie Preferences
            </h3>
            <p className="text-xs sm:text-sm text-oldverse-secondary font-light leading-relaxed">
              You can adjust your cookie settings at any time using the customizable banner on our site. Alternatively, you can configure your browser to block, remove, or alert you about cookies. 
            </p>
            <p className="text-xs text-oldverse-accent/80 font-grotesk font-semibold">
              Please note: Disabling essential security cookies will lock you out of auth-gated portals, including user and admin consoles.
            </p>
          </div>

          <div className="flex flex-col justify-center space-y-4 bg-white/[0.02] border border-white/5 p-6 rounded-xl relative z-10">
            <h4 className="font-grotesk text-xs font-bold uppercase tracking-wider text-oldverse-text">Managing Browser Controls</h4>
            <ul className="text-[10px] text-oldverse-secondary space-y-2 font-light list-disc pl-4">
              <li>Chrome: Settings &rarr; Privacy & Security</li>
              <li>Firefox: Options &rarr; Privacy & Security</li>
              <li>Safari: Preferences &rarr; Privacy</li>
              <li>Edge: Settings &rarr; Site Permissions</li>
            </ul>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="max-w-xl mx-auto text-center space-y-4 border-t border-white/5 pt-8">
          <h3 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
            Questions about Cookie Policy?
          </h3>
          <p className="text-xs text-oldverse-secondary font-light">
            Connect with our system architecture team at:
          </p>
          <a
            href="mailto:theoldverse@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-oldverse-accent/30 bg-white/3 hover:bg-white/5 rounded-lg text-xs font-grotesk font-semibold text-oldverse-accent tracking-wide transition-all"
          >
            <Mail className="h-3.5 w-3.5" />
            theoldverse@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
