/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Home, Menu, X, Info, Phone, Mail, Clapperboard, LogOut, User, Landmark, Plus, Settings, Languages, Clock, Baby, Tv, Smartphone, HelpCircle, Cast, BookOpen } from "lucide-react";

export default function Navbar() {
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Auth state
  const [user, setUser] = useState<any>(null);

  // Dropdown setting states
  const [kidsMode, setKidsMode] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [tvModalOpen, setTvModalOpen] = useState(false);
  const [tvPairingCode, setTvPairingCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setKidsMode(localStorage.getItem("oldverse_kids_mode") === "true");
      setSelectedLanguage(localStorage.getItem("oldverse_language") || "English");
    }
  }, []);

  const handleToggleKidsMode = () => {
    const nextVal = !kidsMode;
    setKidsMode(nextVal);
    localStorage.setItem("oldverse_kids_mode", String(nextVal));
    window.dispatchEvent(new Event("oldverse_store_update"));
  };

  const handleSelectLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem("oldverse_language", lang);
    setLanguageModalOpen(false);
    alert(`Language preferences updated to: ${lang}`);
  };

  const handleOpenTvModal = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTvPairingCode(code);
    setTvModalOpen(true);
    setDesktopDrawerOpen(false);
  };

  const fetchUser = async () => {
    const hasSessionCookie = typeof document !== "undefined" && document.cookie.split(";").some(item => item.trim().startsWith("session_at="));
    if (!hasSessionCookie) {
      setUser(null);
      localStorage.removeItem("oldverse_user");
      return;
    }

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

  // Click outside to close settings dropdown
  useEffect(() => {
    if (!desktopDrawerOpen) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      const navElement = document.querySelector("nav");
      if (navElement && !navElement.contains(e.target as Node)) {
        setDesktopDrawerOpen(false);
      }
    };
    
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [desktopDrawerOpen]);

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
    { name: "The Stage", href: "/stage", icon: Tv },
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
        {pathname === "/auth" ? (
          /* Simplified Auth Navbar (Image 1) */
          <div className="flex items-center justify-between h-14">
            {/* Search Icon (Left) */}
            <Link
              href="/search"
              className="p-1.5 text-white/90 hover:text-white transition-transform hover:scale-105"
              aria-label="Search"
            >
              <Search className="h-5.5 w-5.5" />
            </Link>

            {/* Login Title (Center) */}
            <span className="font-grotesk font-extrabold text-base sm:text-lg text-white tracking-wider">
              Login
            </span>

            {/* Hamburger Settings Menu (Right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDesktopDrawerOpen(!desktopDrawerOpen);
              }}
              className="p-1.5 text-white/90 hover:text-white focus:outline-none transition-transform hover:scale-105 cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
          </div>
        ) : (
          /* Default Full Navbar */
          <div className="flex items-center justify-between h-14">
            
            {/* Logo & Filmstrip Group */}
            <Link href="/" className="flex items-center select-none group gap-3.5">
              <img
                src="/favicon.png?v=3"
                alt="THE OLDVERSE Logo"
                className="h-6 w-6 object-contain group-hover:scale-105 transition-transform duration-200"
              />
              
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

              {/* Login Button */}
              {!user && (
                <Link
                  href="/auth"
                  className="font-grotesk font-extrabold text-sm sm:text-base text-white hover:text-oldverse-accent transition-colors duration-250 px-1 uppercase tracking-wider"
                >
                  Login
                </Link>
              )}

              {/* Hamburger Settings Menu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopDrawerOpen(!desktopDrawerOpen);
                }}
                className="p-1.5 text-white/90 hover:text-white focus:outline-none transition-transform hover:scale-105 cursor-pointer"
                aria-label="Menu"
              >
                <Menu className="h-5.5 w-5.5" />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Bottom Row: Centered Tab Links with Icons (Orange Active Indicator) - Only show if not on Auth page */}
      {pathname !== "/auth" && (
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
      )}

      {/* Settings Dropdown Popover */}
      {desktopDrawerOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-16 right-4 w-[320px] bg-[#161515] border border-white/10 rounded-2xl shadow-2xl z-50 p-5 space-y-4 animate-fade-in font-sans"
        >
            {/* Header info */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                {user ? `Account: ${user.name}` : "Settings & Preferences"}
              </span>
              <button
                onClick={() => setDesktopDrawerOpen(false)}
                className="p-1 rounded text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List items */}
            <div className="space-y-4">
              {/* My List */}
              <Link
                href={user ? "/profile#watchlist" : "/auth"}
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-3.5 py-1 text-white/80 hover:text-white transition-colors group"
              >
                <Plus className="h-5 w-5 text-white/50 group-hover:text-oldverse-accent transition-colors" />
                <span className="text-sm font-medium tracking-wide">My List</span>
              </Link>

              {/* Language Preferences */}
              <button
                onClick={() => {
                  setLanguageModalOpen(true);
                  setDesktopDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3.5 py-1 text-left text-white/80 hover:text-white transition-colors group cursor-pointer"
              >
                <Languages className="h-5 w-5 text-white/50 group-hover:text-oldverse-accent transition-colors" />
                <div className="flex-grow flex justify-between items-center pr-1">
                  <span className="text-sm font-medium tracking-wide">Language Preferences</span>
                  <span className="text-[10px] text-oldverse-accent font-semibold uppercase">{selectedLanguage}</span>
                </div>
              </button>

              {/* Watch History */}
              <Link
                href={user ? "/profile#history" : "/auth"}
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-3.5 py-1 text-white/80 hover:text-white transition-colors group"
              >
                <Clock className="h-5 w-5 text-white/50 group-hover:text-oldverse-accent transition-colors" />
                <span className="text-sm font-medium tracking-wide">Watch History</span>
              </Link>

              {/* Kids Mode Toggle */}
              <div className="flex items-start gap-3.5 py-1">
                <Baby className="h-5 w-5 text-white/50 mt-0.5" />
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/80 tracking-wide">Kids Mode</span>
                    {/* Toggle Switch */}
                    <button
                      onClick={handleToggleKidsMode}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                        kidsMode ? "bg-[#3B82F6]" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                          kidsMode ? "translate-x-4.5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] leading-relaxed text-white/40 font-light">
                    Enable content for users under 13 by turning it on.
                  </p>
                </div>
              </div>

              {/* Activate TV */}
              <button
                onClick={handleOpenTvModal}
                className="w-full flex items-center gap-3.5 py-1 text-left text-white/80 hover:text-white transition-colors group cursor-pointer"
              >
                <Cast className="h-5 w-5 text-white/50 group-hover:text-oldverse-accent transition-colors" />
                <span className="text-sm font-medium tracking-wide">Activate TV</span>
              </button>

              {/* Download App */}
              <button
                onClick={() => {
                  alert("The OldVerse Mobile App is coming soon to Android & iOS App Stores!");
                  setDesktopDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3.5 py-1 text-left text-white/80 hover:text-white transition-colors group cursor-pointer"
              >
                <Smartphone className="h-5 w-5 text-white/50 group-hover:text-oldverse-accent transition-colors" />
                <span className="text-sm font-medium tracking-wide">Download App</span>
              </button>

              {/* Help Center */}
              <Link
                href="/contact"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-3.5 py-1 text-white/80 hover:text-white transition-colors group"
              >
                <HelpCircle className="h-5 w-5 text-white/50 group-hover:text-oldverse-accent transition-colors" />
                <span className="text-sm font-medium tracking-wide">Help Center</span>
              </Link>
            </div>

            {/* Session Action Footer */}
            <div className="pt-3 border-t border-white/5">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold text-red-400 transition-all cursor-pointer font-grotesk uppercase"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout Session
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setDesktopDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#F5A623] hover:bg-[#F5A623]/85 text-xs font-bold text-black transition-all cursor-pointer font-grotesk uppercase"
                >
                  <User className="h-3.5 w-3.5" />
                  Login / Register
                </Link>
              )}
            </div>

            {/* Admin Console shortcut link if logged in as Admin */}
            {user?.isAdmin && (
              <Link
                href="/admin-console"
                onClick={() => setDesktopDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#F5A623]/30 hover:text-[#F5A623] text-xs font-bold text-white transition-all cursor-pointer font-grotesk uppercase"
              >
                <Landmark className="h-3.5 w-3.5" />
                Admin Console
              </Link>
            )}
          </div>
      )}

      {/* Language Preferences Dialog Modal */}
      {languageModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center px-4 font-sans">
          <div className="bg-[#121926] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 relative animate-fade-in">
            <button
              onClick={() => setLanguageModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <Languages className="h-8 w-8 mx-auto text-oldverse-accent" />
              <h3 className="text-lg font-bold text-white font-grotesk">Language Preferences</h3>
              <p className="text-xs text-white/50">Choose your preferred audio & interface language.</p>
            </div>

            <div className="space-y-2 font-grotesk">
              {["English", "Hindi", "Spanish", "French"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full p-3 rounded-lg border text-left text-xs font-semibold transition-colors cursor-pointer flex justify-between items-center ${
                    selectedLanguage === lang
                      ? "border-oldverse-accent bg-oldverse-accent/5 text-oldverse-accent"
                      : "border-white/5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
                  }`}
                >
                  <span>{lang}</span>
                  {selectedLanguage === lang && <span className="h-1.5 w-1.5 rounded-full bg-oldverse-accent" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TV Activation Modal */}
      {tvModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center px-4 font-sans">
          <div className="bg-[#121926] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 relative animate-fade-in text-center">
            <button
              onClick={() => setTvModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <Tv className="h-10 w-10 mx-auto text-oldverse-accent animate-pulse" />
              <h3 className="text-lg font-bold text-white font-grotesk">Activate Your TV</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Open The OldVerse app on your smart TV and enter this activation code to sync your profile.
              </p>
            </div>

            {/* Code display box */}
            <div className="bg-white/5 rounded-xl border border-white/10 py-5">
              <span className="text-3xl font-extrabold tracking-widest text-white font-mono uppercase">
                {tvPairingCode}
              </span>
            </div>

            <div className="space-y-3 pt-2 text-[10px] text-white/35 font-light leading-relaxed">
              <p>Waiting for TV pairing request...</p>
              <div className="h-1 w-20 bg-white/10 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-oldverse-accent rounded-full animate-marquee w-1/2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
