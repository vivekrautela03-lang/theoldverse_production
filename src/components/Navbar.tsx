/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Home, Menu, X, Info, Phone, Mail, Clapperboard, LogOut, User, Landmark, Plus, Settings } from "lucide-react";

export default function Navbar() {
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Auth state
  const [user, setUser] = useState<any>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          // Sync with localStorage
          localStorage.setItem("oldverse_user", JSON.stringify(data.user));
          return;
        }
      }
    } catch (err) {
      // ignore
    }
    
    // Check localStorage fallback in case cookies are still refreshing
    const local = localStorage.getItem("oldverse_user");
    if (local) {
      try {
        setUser(JSON.parse(local));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    
    // Listen for storage mutations to update login state immediately
    window.addEventListener("oldverse_store_update", fetchUser);
    return () => {
      window.removeEventListener("oldverse_store_update", fetchUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      // ignore
    }
    
    localStorage.removeItem("oldverse_user");
    setUser(null);
    window.dispatchEvent(new Event("oldverse_store_update"));
    setDesktopDrawerOpen(false);
    
    router.push("/auth");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: Clapperboard },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 transition-all duration-300 bg-black/10 backdrop-blur-md border-b border-white/5 font-sans">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand & Tools */}
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Filmstrip Group */}
          <Link href="/" className="flex items-center select-none group gap-3.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white group-hover:scale-105 transition-transform duration-200"
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
            
            <div className="h-5 w-[1px] bg-white/20" />
            
            <span className="font-grotesk font-bold text-sm sm:text-base tracking-widest text-white uppercase group-hover:text-oldverse-accent transition-colors duration-200">
              THE OLDVERSE
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Trigger */}
            <Link
              href="/search"
              className="p-1.5 text-white/90 hover:text-white transition-transform hover:scale-105"
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

      {/* Bottom Row: Centered Tab Links with Icons (Orange Active Indicator) */}
      <div className="border-t border-white/5 py-2 bg-black/5">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16 text-[10px] sm:text-xs">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 py-1 px-1 relative transition-colors font-grotesk font-semibold uppercase tracking-wider group ${
                    active ? "text-oldverse-accent" : "text-white/70 hover:text-white"
                  }`}
                >
                  <LinkIcon className={`h-3.5 w-3.5 transition-transform group-hover:scale-105 ${active ? "text-oldverse-accent animate-pulse" : "text-white/70 group-hover:text-white"}`} />
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute -bottom-[9px] left-0 w-full h-[2px] bg-oldverse-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sliding Drawer */}
      {desktopDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-black/95 backdrop-blur-md z-[100] p-6 flex flex-col justify-between shadow-2xl border-l border-white/10 animate-slide-in font-sans">
          <div className="space-y-6 flex-grow overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="font-sans font-bold uppercase tracking-wider text-white text-xs">
                {user ? `Hi, ${user.name}` : "Menu & Features"}
              </span>
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
                <Home className="h-4 w-4 text-white/70" />
                <span>Home Page</span>
              </Link>

              <Link
                href="/projects"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Clapperboard className="h-4 w-4 text-white/70" />
                <span>Projects</span>
              </Link>

              {/* Private routes gating shown in navigation if logged in */}
              {user && (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setDesktopDrawerOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4 text-[#F5A623]" />
                    <span>My Profile & Resume</span>
                  </Link>

                  {user.isCreator && (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setDesktopDrawerOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Settings className="h-4 w-4 text-[#F5A623]" />
                        <span>Creator Dashboard</span>
                      </Link>
                      <Link
                        href="/upload"
                        onClick={() => setDesktopDrawerOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Plus className="h-4 w-4 text-[#F5A623]" />
                        <span>Upload Video</span>
                      </Link>
                    </>
                  )}

                </>
              )}

              <Link
                href="/about"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Info className="h-4 w-4 text-white/70" />
                <span>About Us</span>
              </Link>
              
              <Link
                href="/contact"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-white/70" />
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Session Action */}
            <div className="pt-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold text-red-400 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout Session
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setDesktopDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-xs font-bold text-black transition-all cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Login / Register
                </Link>
              )}
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
