"use client";

import React, { useState, useEffect } from "react";
import { Cookie, Settings, Shield, BarChart3, Check } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  
  // Consent categories
  const [consent, setConsent] = useState({
    essential: true, // always true
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    // Check if consent is already stored
    const storedConsent = localStorage.getItem("oldverse_cookie_consent");
    if (!storedConsent) {
      // Delay visibility slightly for cinematic effect
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = { essential: true, analytics: true, marketing: true };
    localStorage.setItem("oldverse_cookie_consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const preferences = { essential: true, analytics: false, marketing: false };
    localStorage.setItem("oldverse_cookie_consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem("oldverse_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);
    setShowCustomize(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md w-auto z-50 animate-slide-up font-grotesk">
      <div className="glassmorphism p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden space-y-4">
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-oldverse-accent/20 via-oldverse-accent to-oldverse-accent/20" />
        
        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 bg-oldverse-accent/15 border border-oldverse-accent/25 rounded-xl flex items-center justify-center text-oldverse-accent flex-shrink-0">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bebas text-xl text-oldverse-text tracking-wide uppercase">Cookie Preferences</h4>
            <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
              We use cookies to secure our authentication gates and analyze site performance. Adjust your preferences below.
            </p>
          </div>
        </div>

        {/* Customization Details Panel */}
        {showCustomize ? (
          <div className="space-y-3 bg-black/40 border border-white/5 p-4 rounded-xl text-xs">
            {/* Essential (Static) */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="space-y-0.5">
                <span className="font-bold text-oldverse-text flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-oldverse-accent" /> Essential Cookies
                </span>
                <p className="text-[10px] text-oldverse-secondary font-light">Required for authentication and security gates.</p>
              </div>
              <div className="h-5 w-5 bg-oldverse-accent/10 border border-oldverse-accent/30 rounded flex items-center justify-center text-oldverse-accent">
                <Check className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="space-y-0.5">
                <span className="font-bold text-oldverse-text flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-oldverse-accent" /> Analytics Tracking
                </span>
                <p className="text-[10px] text-oldverse-secondary font-light">Anonymously monitors page traffic and catalog metrics.</p>
              </div>
              <button
                type="button"
                onClick={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
                className={`h-5 w-5 border rounded flex items-center justify-center transition-all cursor-pointer ${
                  consent.analytics 
                    ? "bg-oldverse-accent/10 border-oldverse-accent text-oldverse-accent" 
                    : "border-white/20 bg-white/5 text-transparent"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-oldverse-text flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5 text-oldverse-accent" /> Marketing & Embeds
                </span>
                <p className="text-[10px] text-oldverse-secondary font-light">Enables video stream playback trackers.</p>
              </div>
              <button
                type="button"
                onClick={() => setConsent(c => ({ ...c, marketing: !c.marketing }))}
                className={`h-5 w-5 border rounded flex items-center justify-center transition-all cursor-pointer ${
                  consent.marketing 
                    ? "bg-oldverse-accent/10 border-oldverse-accent text-oldverse-accent" 
                    : "border-white/20 bg-white/5 text-transparent"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="flex-1 py-2 border border-white/10 hover:border-white/20 bg-white/3 text-[10px] font-bold text-white uppercase rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2 bg-oldverse-accent hover:bg-oldverse-accent-secondary text-[10px] font-bold text-black uppercase rounded-lg"
              >
                Save Choices
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 py-2.5 bg-oldverse-accent hover:bg-oldverse-accent-secondary text-xs font-bold text-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 py-2.5 border border-white/10 hover:border-white/20 bg-white/3 text-xs font-bold text-white uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
              >
                Reject All
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setShowCustomize(true)}
              className="py-2 text-[10px] uppercase font-bold text-oldverse-secondary hover:text-oldverse-accent tracking-wider transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 border border-white/5 rounded-lg bg-black/20 hover:bg-black/40 mt-1"
            >
              <Settings className="h-3.5 w-3.5" />
              Customize Consent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
