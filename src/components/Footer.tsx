"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-16 pb-8 relative z-10 overflow-hidden font-grotesk text-oldverse-secondary">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-oldverse-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 2: Collaborate / Work With Us */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block">Collaborate</span>
            <h2 className="font-bebas text-4xl sm:text-5xl text-oldverse-text tracking-wider uppercase">Work With Us</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-sm font-light text-oldverse-secondary max-w-xl">
              We are always looking for actors, writers, editors and creative minds.
            </p>
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-full uppercase tracking-wider hover:bg-white/90 transition text-center whitespace-nowrap"
            >
              Join The OldVerse
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8" />

        {/* Section 3: Footer Links (3-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4 pb-8">
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-oldverse-accent"
              >
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
              <span className="font-bebas text-2xl tracking-wider text-white select-none">
                THE <span className="text-oldverse-accent">OLDVERSE</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed font-light text-oldverse-secondary max-w-sm">
              The OldVerse is a platform where creators can share their vision with the world. We provide the tools, the community, and the audience to help stories grow beyond boundaries.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-oldverse-text uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="/" className="hover:text-oldverse-accent">Home</Link></li>
              <li><Link href="/projects" className="hover:text-oldverse-accent">Projects</Link></li>
              <li><Link href="/team" className="hover:text-oldverse-accent">Our Team</Link></li>
              <li><Link href="/dashboard" className="hover:text-oldverse-accent">Studio</Link></li>
              <li><Link href="/contact" className="hover:text-oldverse-accent">Contact</Link></li>
              <li><Link href="/search" className="hover:text-oldverse-accent">Search</Link></li>
            </ul>
          </div>

          {/* Col 3: Connect */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-oldverse-text uppercase tracking-widest">Connect</h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <span className="text-oldverse-secondary">Instagram: </span>
                <a href="https://instagram.com/theoldverse_" target="_blank" rel="noreferrer" className="hover:text-oldverse-accent">@theoldverse_</a>
              </li>
              <li>
                <span className="text-oldverse-secondary">YouTube: </span>
                <a href="https://youtube.com/@theoldverse_07" target="_blank" rel="noreferrer" className="hover:text-oldverse-accent">@theoldverse_07</a>
              </li>
              <li>
                <span className="text-oldverse-secondary">Email: </span>
                <a href="mailto:hello@theoldverse.com" className="hover:text-oldverse-accent">hello@theoldverse.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 text-center sm:text-left text-[10px] font-light">
          <p>&copy; {currentYear} The OldVerse. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}
