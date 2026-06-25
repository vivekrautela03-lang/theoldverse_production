"use client";

import React from "react";
import Link from "next/link";
import { Film, Eye, Sparkles, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none">
            Every Story Deserves A Stage
          </h1>
          <p className="text-oldverse-accent font-grotesk text-xs sm:text-sm uppercase tracking-widest font-semibold">
            About The OldVerse Ecosystem
          </p>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Narrative Section */}
        <div className="glassmorphism p-6 sm:p-10 rounded-2xl border border-white/5 space-y-6">
          <p className="text-oldverse-text text-sm sm:text-base font-light leading-relaxed">
            The OldVerse is the world’s first premium creator streaming ecosystem designed specifically for independent filmmakers, visual artists, writers, and visual performers. We believe that independent cinema has long been overshadowed by centralized algorithms and corporate gatekeepers who prioritize raw watch time over creative depth.
          </p>
          <p className="text-oldverse-text text-sm sm:text-base font-light leading-relaxed">
            Here, we provide creators with more than just a video hosting service. We give them a unified digital workspace to write scripts, connect with cast members, showcase photography moodboards, publish behind-the-scenes diaries, and stream their finished creations directly to an appreciative global audience—without algorithmic dilution or intermediate barriers.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="glassmorphism-card p-6 rounded-xl border border-white/5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-oldverse-accent/10 flex items-center justify-center text-oldverse-accent">
              <Film className="h-5 w-5" />
            </div>
            <h3 className="font-grotesk text-base font-bold text-oldverse-text uppercase tracking-wide">
              Art Genuineness
            </h3>
            <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
              We preserve visual bitrates, foley balancing, and direct directorial overlays so your art is viewed exactly as intended.
            </p>
          </div>

          <div className="glassmorphism-card p-6 rounded-xl border border-white/5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-oldverse-accent/10 flex items-center justify-center text-oldverse-accent">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="font-grotesk text-base font-bold text-oldverse-text uppercase tracking-wide">
              Direct Interaction
            </h3>
            <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
              Connect directly with filmmakers, apply for casting calls, review screenplays, and collaborate on pitching future projects.
            </p>
          </div>

          <div className="glassmorphism-card p-6 rounded-xl border border-white/5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-oldverse-accent/10 flex items-center justify-center text-oldverse-accent">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-grotesk text-base font-bold text-oldverse-text uppercase tracking-wide">
              Zero Dilution
            </h3>
            <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
              No invasive advertising banners, no forced login barriers, and no algorithmic restrictions on visual pacing.
            </p>
          </div>

        </div>

        {/* CTA Footer */}
        <div className="text-center pt-8">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs tracking-wider uppercase shadow-lg shadow-oldverse-accent/20 transition-all duration-300 hover:scale-105"
          >
            Explore the Archives
          </Link>
        </div>

      </div>
    </div>
  );
}
