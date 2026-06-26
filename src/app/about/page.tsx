"use client";

import React from "react";
import Link from "next/link";
import { Film, Quote, Sparkles, Heart, Camera, Scissors, ArrowRight } from "lucide-react";

const DefaultAvatar = () => (
  <div className="h-full w-full bg-white/5 flex items-center justify-center text-white/40">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  </div>
);

export default function AboutPage() {
  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. Header Block */}
        <div className="text-center space-y-4">
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none cinematic-glow">
            About The OldVerse
          </h1>
          <p className="text-oldverse-accent font-grotesk text-xs sm:text-sm uppercase tracking-widest font-semibold">
            Every Story Deserves A Stage
          </p>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* 2. Our Story Section */}
        <div className="glassmorphism p-6 sm:p-10 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Film className="h-32 w-32 text-white" />
          </div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
            Our Story
          </h2>
          <p className="text-oldverse-text text-sm sm:text-base font-light leading-relaxed max-w-4xl">
            The OldVerse is an independent film production studio driven by creativity, passion, and the belief that every story deserves to be told. We create films, commercials, digital content, and cinematic experiences that inspire, connect, and leave a lasting impression. Every project is approached with dedication, originality, and a commitment to storytelling that goes beyond the screen.
          </p>
        </div>

        {/* 3. Our Philosophy Section */}
        <div className="space-y-6">
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase text-center">
            Our Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glassmorphism-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4 relative">
              <Quote className="h-6 w-6 text-oldverse-accent opacity-50 absolute top-4 left-4" />
              <p className="font-grotesk text-sm font-medium text-oldverse-text italic leading-relaxed pt-2">
                "Every frame tells a story."
              </p>
            </div>
            
            <div className="glassmorphism-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4 relative">
              <Quote className="h-6 w-6 text-oldverse-accent opacity-50 absolute top-4 left-4" />
              <p className="font-grotesk text-sm font-medium text-oldverse-text italic leading-relaxed pt-2">
                "Cinema begins where imagination meets reality."
              </p>
            </div>

            <div className="glassmorphism-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4 relative">
              <Quote className="h-6 w-6 text-oldverse-accent opacity-50 absolute top-4 left-4" />
              <p className="font-grotesk text-sm font-medium text-oldverse-text italic leading-relaxed pt-2">
                "Stories live forever when they're told with heart."
              </p>
            </div>
          </div>
        </div>

        {/* 4. Meet the Founders Section */}
        <div className="space-y-8">
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase text-center">
            Meet the Founders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder 1: Shivanshi */}
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0 bg-oldverse-card">
                <DefaultAvatar />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-grotesk text-xl font-bold text-oldverse-text">
                    Shivanshi Rauthan
                  </h3>
                  <p className="text-xs text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk">
                    Director • Producer • Creative Lead
                  </p>
                </div>
                <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                  As the co-founder of The OldVerse, Shivanshi Rauthan leads the creative vision behind every project. Her passion for filmmaking, storytelling, and visual direction ensures that each production reflects originality, emotion, and artistic excellence.
                </p>
              </div>
            </div>

            {/* Founder 2: Vivek */}
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0 bg-oldverse-card">
                <img
                  src="/vivek_rautela.jpg"
                  alt="Vivek Rautela"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-grotesk text-xl font-bold text-oldverse-text">
                    Vivek Rautela
                  </h3>
                  <p className="text-xs text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk">
                    Director • Producer • Script Writer
                  </p>
                </div>
                <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                  Vivek Rautela is the co-founder of The OldVerse and the creative mind behind its stories. As a director, producer, and script writer, he focuses on building powerful narratives that connect with audiences and transform ideas into unforgettable cinematic experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Meet Our Visionaries Section */}
        <div className="space-y-8">
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase text-center">
            Meet Our Visionaries
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Visionary 1: Shivanshi */}
            <div className="glassmorphism-card p-5 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-oldverse-card flex-shrink-0">
                <DefaultAvatar />
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-grotesk text-sm font-bold text-oldverse-text">
                    Shivanshi Rauthan
                  </h3>
                  <p className="text-[10px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk mb-2">
                    Director • Producer • Creative Team
                  </p>
                  <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                    Leading the creative direction of The OldVerse, Shivanshi transforms ideas into visually compelling and emotionally engaging cinematic experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Visionary 2: Vivek */}
            <div className="glassmorphism-card p-5 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-oldverse-card flex-shrink-0">
                <img
                  src="/vivek_rautela.jpg"
                  alt="Vivek Rautela"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-grotesk text-sm font-bold text-oldverse-text">
                    Vivek Rautela
                  </h3>
                  <p className="text-[10px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk mb-2">
                    Director • Producer • Script Writer
                  </p>
                  <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                    Vivek develops original stories, screenplays, and directs projects with a vision to create films that leave a lasting impact.
                  </p>
                </div>
              </div>
            </div>

            {/* Visionary 3: Ujjawal */}
            <div className="glassmorphism-card p-5 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-oldverse-card flex-shrink-0">
                <img
                  src="/ujjawal_gurung.jpg"
                  alt="Ujjawal Gurung"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-grotesk text-sm font-bold text-oldverse-text">
                    Ujjawal Gurung
                  </h3>
                  <p className="text-[10px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk mb-2">
                    Head of Camera Department
                  </p>
                  <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                    Ujjawal leads all camera operations, cinematography, and technical filmmaking. His expertise in framing, lighting, and visual composition brings every scene to life.
                  </p>
                </div>
              </div>
            </div>

            {/* Visionary 4: Shivansh */}
            <div className="glassmorphism-card p-5 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-oldverse-card flex-shrink-0">
                <img
                  src="/shivansh_mourya.jpg"
                  alt="Shivansh Mourya"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-grotesk text-sm font-bold text-oldverse-text">
                    Shivansh Mourya
                  </h3>
                  <p className="text-[10px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk mb-2">
                    Editor • Screenplay Writer
                  </p>
                  <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                    Shivansh shapes every story in post-production through editing, screenplay development, and cinematic pacing, ensuring every project reaches its highest potential.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 6. Join Our Journey Section */}
        <div className="glassmorphism p-8 sm:p-12 rounded-2xl border border-white/5 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-oldverse-accent/5 to-transparent z-0" />
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <Sparkles className="h-8 w-8 text-oldverse-accent mx-auto animate-pulse" />
            <h2 className="font-bebas text-3xl sm:text-5xl text-oldverse-text tracking-wider uppercase">
              Join Our Journey
            </h2>
            <p className="text-xs sm:text-sm text-oldverse-secondary font-light leading-relaxed">
              At The OldVerse, we believe that every dream deserves a screen and every story deserves an audience. Together, we're building a universe where creativity knows no limits.
            </p>
            <p className="font-grotesk text-sm sm:text-base font-bold text-oldverse-text tracking-wide uppercase pt-2">
              Let's create stories that live forever.
            </p>
            
            <div className="pt-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs tracking-wider uppercase shadow-lg shadow-oldverse-accent/20 transition-all duration-300 hover:scale-105"
              >
                <span>Explore the Archives</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
