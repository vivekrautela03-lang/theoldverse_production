"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Home, Menu, X, LayoutDashboard, Info, Users, Phone } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Projects", href: "/projects" },
    { name: "Our Team", href: "/team" },
    { name: "Contact", href: "/contact" }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-black/95 border-b border-white/5 py-3 shadow-2xl" 
          : "bg-gradient-to-b from-black/80 to-transparent py-4.5"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Links Group */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link href="/" className="flex items-center select-none group gap-2.5">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-oldverse-accent group-hover:scale-105 transition-transform duration-200"
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
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {/* Blue Filled Home Button */}
              <Link
                href="/"
                className="p-1 hover:opacity-80 transition-opacity"
                title="Home"
              >
                <Home className="h-5 w-5 text-[#0070f3] fill-current" />
              </Link>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans font-bold text-sm tracking-wide transition-colors ${
                    isActive(link.href)
                      ? "text-white border-b-2 border-white pb-0.5"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-5">
            {/* Search Trigger */}
            <Link
              href="/search"
              className="p-1.5 text-white/95 hover:text-white transition-transform hover:scale-105"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Hamburger Settings Menu */}
            <button
              onClick={() => setDesktopDrawerOpen(!desktopDrawerOpen)}
              className="p-1.5 text-white/90 hover:text-white focus:outline-none transition-transform hover:scale-105 cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Desktop/Global Sliding Right Menu Drawer */}
      {desktopDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-black/95 backdrop-blur-md z-[100] p-6 flex flex-col justify-between shadow-2xl border-l border-white/10 animate-slide-in font-sans">
          <div className="space-y-6 flex-grow overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="font-sans font-bold uppercase tracking-wider text-white text-xs">Menu & Features</span>
              <button
                onClick={() => setDesktopDrawerOpen(false)}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1 text-sm text-white/80 border-b border-white/5 pb-4">
              <Link
                href="/"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Home className="h-4 w-4 text-[#0070f3]" />
                <span>Home Page</span>
              </Link>

              <Link
                href="/projects"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-oldverse-accent" />
                <span>Projects</span>
              </Link>

              <Link
                href="/team"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Our Team</span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 text-center text-[10px] text-white/40">
            THE OLDVERSE &copy; {new Date().getFullYear()}
          </div>
        </div>
      )}
    </nav>
  );
}
