"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, Mail, Accessibility, Settings, Sparkles, MessageSquare, ArrowLeft } from "lucide-react";

export default function AccessibilityStatementPage() {
  const categories = [
    {
      title: "Commitment & Standard",
      icon: Accessibility,
      desc: "The OldVerse is dedicated to ensuring digital accessibility for all users, including individuals with disabilities. We continually audit and improve the user experience of our platforms, aiming to satisfy the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA guidelines."
    },
    {
      title: "Supported Technologies",
      icon: Settings,
      desc: "Our platform leverages standard, accessible HTML5 structure, semantic elements, CSS Grid layouts, and custom accessibility attributes. The site is optimized for compatibility with modern web browsers, assistive screen readers (like NVDA, JAWS, or VoiceOver), and keyboard navigation."
    },
    {
      title: "Visual & Contrast Design",
      icon: Sparkles,
      desc: "To ensure visual readability, we utilize clear typographic hierarchies, high contrast ratios (complying with standard color contrast requirements), custom visible focus indicators (gold borders for active controls), and support user browser text sizing overrides."
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
            Accessibility Statement
          </h1>
          <p className="text-oldverse-secondary text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Our commitment to creating an inclusive, barrier-free cinematic platform for all storytellers.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-oldverse-secondary font-grotesk tracking-wider">
            <span>Last Updated:</span>
            <span className="font-bold text-oldverse-text">June 27, 2026</span>
          </div>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="glassmorphism-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4 hover:border-oldverse-accent/25 transition-all flex flex-col justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-oldverse-accent/15 border border-oldverse-accent/25 rounded-lg flex items-center justify-center text-oldverse-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                    {cat.title}
                  </h3>
                </div>
                
                <p className="text-xs sm:text-sm text-oldverse-secondary font-light leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Feedback loop details */}
        <div className="glassmorphism p-8 sm:p-10 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Accessibility className="h-32 w-32 text-white" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-oldverse-accent" />
              Feedback & Accommodation Requests
            </h3>
            <p className="text-xs sm:text-sm text-oldverse-secondary font-light leading-relaxed">
              We welcome your feedback on the accessibility of The OldVerse. If you encounter any barriers or need screen reader accommodations in accessing our catalog, please contact us. We aim to respond to feedback and support requests within 2 business days.
            </p>
          </div>

          <div className="flex flex-col justify-center space-y-3 bg-white/[0.02] border border-white/5 p-6 rounded-xl relative z-10 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Accessibility Contact</span>
            <a
              href="mailto:theoldverse@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-oldverse-accent hover:bg-oldverse-accent-secondary text-black font-grotesk font-semibold text-xs rounded-lg transition-all"
            >
              <Mail className="h-4 w-4" />
              Submit Feedback
            </a>
          </div>
        </div>

        {/* Known Limitations */}
        <div className="space-y-4">
          <h2 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-oldverse-accent" />
            Supported Controls & Known Limitations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-oldverse-secondary font-light leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-grotesk font-bold text-oldverse-text uppercase tracking-wider">Video Player Keyboard Shortcuts</h4>
              <p>Our custom Video Player supports standard controls: Spacebar to Play/Pause, Left/Right Arrows to Skip Back/Forward, Up/Down Arrows to adjust Volume, and &apos;F&apos; to toggle Fullscreen Mode.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-grotesk font-bold text-oldverse-text uppercase tracking-wider">Third-Party Video Player & Social Embeds</h4>
              <p>While we make every effort to curate fully accessible components, some third-party media players or social feeds embedded (like Instagram timelines) may lack standard keyboard configurations, which is outside our direct control.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
