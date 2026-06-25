"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Home, Menu, X, LayoutDashboard, Upload, LogOut, Bell, User } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isCreator: boolean } | null>(null);
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("oldverse_user");
    window.location.reload();
  };

  const loadUser = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("oldverse_user");
      setUser(stored ? JSON.parse(stored) : null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("oldverse_store_update", loadUser);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("oldverse_store_update", loadUser);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Shows", href: "/browse?cat=Originals" },
    { name: "Movies", href: "/browse?cat=Drama" },
    { name: "VDesi", href: "/browse?cat=Experimental" },
    { name: "New On Mx", href: "/browse" },
    { name: "Trailers", href: "/browse?cat=BTS" }
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
          
          {/* Logo & Category Links Group */}
          <div className="flex items-center gap-8 lg:gap-12">
            {/* The OldVerse Brand Logo */}
            <Link href="/" className="flex items-center select-none group gap-2">
              <img
                src="/logo.png"
                alt="The OldVerse Logo"
                className="h-7 w-auto object-contain group-hover:scale-103 transition-transform duration-200"
              />
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

            {/* Login / Profile Text Action */}
            {user ? (
              <Link
                href="/profile"
                className="hidden md:block font-sans font-bold text-sm text-white/90 hover:text-white transition-colors"
              >
                {user.name.split(" ")[0]}
              </Link>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="hidden md:block font-sans font-bold text-sm text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                Login
              </button>
            )}

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
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="font-sans font-bold uppercase tracking-wider text-white text-xs">Settings & Features</span>
              <button
                onClick={() => setDesktopDrawerOpen(false)}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* User Profile info if logged in */}
            {user && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold uppercase">
                  {user.name[0]}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                  <p className="text-[10px] text-white/60 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="flex flex-col gap-1 text-sm text-white/80">
              <Link
                href="/"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Home className="h-4 w-4 text-[#0070f3]" />
                <span>Home Page</span>
              </Link>
              
              <Link
                href="/dashboard"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Creator Dashboard</span>
              </Link>

              <Link
                href="/upload"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Content</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setDesktopDrawerOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 hover:text-white transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Root Admin Dashboard</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out Account
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-[#0070f3] text-white text-sm font-bold hover:bg-[#0070f3]/80 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
