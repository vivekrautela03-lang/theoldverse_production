"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film, Mail, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [expandedSection, setExpandedSection] = useState(false);

  // Social SVGs matching MX Player list
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      )
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.625-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      svg: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-16 pb-8 relative z-10 overflow-hidden font-grotesk text-oldverse-secondary">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-oldverse-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Row 1: Expandable Directory (MX Player Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
          <div>
            <h4 className="text-sm font-bold text-oldverse-text mb-4">Original Showcase</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="/watch/media-1" className="hover:text-oldverse-accent">Silent Connections</Link></li>
              <li><Link href="/watch/media-3" className="hover:text-oldverse-accent">Neon Monsoon</Link></li>
              {expandedSection && (
                <>
                  <li><Link href="/watch/media-4" className="hover:text-oldverse-accent">Chasing Shadows</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-oldverse-text mb-4">Movies by Language</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="/browse?cat=Originals" className="hover:text-oldverse-accent">English Originals</Link></li>
              <li><Link href="/browse?cat=Drama" className="hover:text-oldverse-accent">Regional Narrative Hits</Link></li>
              <li><Link href="/browse?cat=Documentary" className="hover:text-oldverse-accent">Global Soundscapes</Link></li>
              {expandedSection && (
                <>
                  <li><Link href="/browse?cat=Experimental" className="hover:text-oldverse-accent">VDesi Experimental</Link></li>
                  <li><Link href="/browse?cat=Travel" className="hover:text-oldverse-accent">Travel Journals</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-oldverse-text mb-4">Movies by Genre</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><Link href="/browse?cat=Drama" className="hover:text-oldverse-accent">Crime & Drama Shows</Link></li>
              <li><Link href="/browse?cat=Action" className="hover:text-oldverse-accent">Cyber Sci-Fi Action</Link></li>
              <li><Link href="/browse?cat=Experimental" className="hover:text-oldverse-accent">Experimental & Avant Garde</Link></li>
              {expandedSection && (
                <>
                  <li><Link href="/browse?cat=Photography" className="hover:text-oldverse-accent">Visual Photography Still</Link></li>
                  <li><Link href="/browse?cat=Animation" className="hover:text-oldverse-accent">Modern CGI Animations</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Expand All Trigger */}
        <div className="flex justify-center pb-4 border-b border-white/5">
          <button
            onClick={() => setExpandedSection(!expandedSection)}
            className="flex items-center gap-1.5 text-xs font-bold text-oldverse-accent hover:text-oldverse-accent-secondary uppercase tracking-wider cursor-pointer"
          >
            {expandedSection ? (
              <>
                Collapse All <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Expand All <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Row 2: SEO descriptive block (MX Player style) */}
        <div className="text-xs font-light leading-relaxed space-y-4 border-b border-white/5 pb-8">
          <div>
            <h5 className="font-bold text-oldverse-text mb-1">
              Watch Silent Connections & Top Original Series Online on The OldVerse for Free!
            </h5>
            <p>
              The OldVerse is your one-stop digital gallery for high-fidelity indie cinema, behind-the-scenes diaries, visual soundscapes, and photography grids. Follow creators, download templates, and view casting calls in real time.
            </p>
          </div>
          {expandedSection && (
            <div className="animate-fade-in space-y-3">
              <h5 className="font-bold text-oldverse-text mb-1">
                Explore the Latest Indie Cinema and Documentaries Across All Devices
              </h5>
              <p>
                Our video player provides high frame-rate rendering, subtitle support, foley balancing controls, and custom playback speeds. Connect your tablet, TV, or laptop seamlessly for a cinema-first casting layout.
              </p>
            </div>
          )}
        </div>

        {/* Row 3: Follow & Logo Section (MX Player style) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-oldverse-accent" />
            <span className="font-bebas text-xl tracking-wider text-oldverse-text">
              THE <span className="text-oldverse-accent">OLDVERSE</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-xs uppercase font-bold tracking-wider text-oldverse-text">
              Follow us for updates:
            </span>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-oldverse-accent hover:text-oldverse-accent transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Company and Legal listings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-light">
          <div className="space-y-3">
            <h4 className="font-bold text-oldverse-text uppercase tracking-wider text-[10px]">Company</h4>
            <ul className="space-y-1.5">
              <li><Link href="/about" className="hover:text-oldverse-accent">About Us</Link></li>
              <li><Link href="/team" className="hover:text-oldverse-accent">Our Team</Link></li>
              <li><Link href="/contact" className="hover:text-oldverse-accent">Contact Us</Link></li>
              <li><Link href="/community" className="hover:text-oldverse-accent">FAQ / Hub</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-oldverse-text uppercase tracking-wider text-[10px]">Legal</h4>
            <ul className="space-y-1.5">
              <li><a href="#" className="hover:text-oldverse-accent">Download Apps</a></li>
              <li><a href="#" className="hover:text-oldverse-accent">Privacy Notice</a></li>
              <li><a href="#" className="hover:text-oldverse-accent">Conditions of Use</a></li>
              <li><a href="#" className="hover:text-oldverse-accent">Content Complaints</a></li>
              <li><a href="#" className="hover:text-oldverse-accent">Compliance Report</a></li>
            </ul>
          </div>

          <div className="sm:col-span-2 space-y-3">
            <h4 className="font-bold text-oldverse-text uppercase tracking-wider text-[10px]">Newsletter</h4>
            <p className="text-xs font-light text-oldverse-secondary max-w-sm">
              Subscribe to the Backstage Pass for upcoming originals and local crew casting alerts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-4 pr-12 py-2.5 rounded-lg bg-oldverse-card border border-white/10 text-xs font-light text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors duration-300 placeholder-white/30"
              />
              <button
                type="submit"
                className="absolute right-1 p-2 rounded-md bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg transition-colors duration-300 cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 border-t border-white/5 text-center text-[10px] font-light">
          <p>&copy; {currentYear} THE OLDVERSE. All rights reserved. Built for visual creators. Every Story Deserves A Stage.</p>
        </div>
      </div>
    </footer>
  );
}
