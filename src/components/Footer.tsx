"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

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
            <a
              href="https://wa.me/919068850966"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-full uppercase tracking-wider hover:bg-white/90 transition text-center whitespace-nowrap"
            >
              Join The OldVerse
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8" />

        {/* Section 3: Redesigned Footer Links (Directory and Connect) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pt-4 pb-8">
          {/* Col 1 & 2: Brand details & studio mission */}
          <div className="sm:col-span-2 space-y-5">
            <div className="flex items-center select-none">
              <Image
                src="/logo.png"
                alt="THE OLDVERSE Logo"
                width={150}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed font-light text-oldverse-secondary max-w-2xl">
              The OldVerse is an independent film production studio driven by creativity, passion, and the belief that every story deserves to be told. We create films, commercials, digital content, and cinematic experiences that inspire, connect, and leave a lasting impression. Every project is approached with dedication, originality, and a commitment to storytelling that goes beyond the screen.
            </p>
          </div>

          {/* Col 3: Directory / Sitemap links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-oldverse-text uppercase tracking-widest">Sitemap</h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <Link href="/" className="hover:text-oldverse-accent transition-colors">Home Archive</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-oldverse-accent transition-colors">Films & Projects</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-oldverse-accent transition-colors">About the Studio</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-oldverse-accent transition-colors">Contact Details</Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-oldverse-accent transition-colors">XML Sitemap</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect details */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-oldverse-text uppercase tracking-widest">Connect</h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <span className="text-oldverse-secondary">Instagram: </span>
                <a href="https://instagram.com/theoldverse_" target="_blank" rel="noreferrer" className="hover:text-oldverse-accent transition-colors">@theoldverse_</a>
              </li>
              <li>
                <span className="text-oldverse-secondary">YouTube: </span>
                <a href="https://youtube.com/@theoldverse_07" target="_blank" rel="noreferrer" className="hover:text-oldverse-accent transition-colors">@theoldverse_07</a>
              </li>
              <li>
                <span className="text-oldverse-secondary">Email: </span>
                <a href="mailto:theoldverse@gmail.com" className="hover:text-oldverse-accent transition-colors">theoldverse@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Legal Compliance Links */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-light">
          <p>&copy; {currentYear} The OldVerse. All Rights Reserved.</p>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-oldverse-secondary">
            <Link href="/privacy" className="hover:text-oldverse-accent transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-oldverse-accent transition-colors">Terms & Conditions</Link>
            <span>&bull;</span>
            <Link href="/cookies" className="hover:text-oldverse-accent transition-colors">Cookie Policy</Link>
            <span>&bull;</span>
            <Link href="/accessibility" className="hover:text-oldverse-accent transition-colors">Accessibility Statement</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-oldverse-accent transition-colors">Contact</Link>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-3.5 py-1.5 border border-white/10 hover:border-oldverse-accent/30 bg-white/3 hover:bg-white/5 text-[9px] font-bold uppercase tracking-wider text-oldverse-text rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            aria-label="Scroll back to top of viewport"
          >
            <span>Back to Top</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
