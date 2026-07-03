"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Film, Clock, Download, CreditCard, Star, Play, Sparkles, Check, Trash2, Share2, FileDown, Briefcase, Settings, Bell, Lock, Mail, Globe, Moon, Sun, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "../../lib/supabaseBrowserClient";
import { getStoreData, mutateStore, syncWithSupabase } from "@/lib/supabaseStore";
import { MediaItem } from "@/lib/mockData";

export default function UserProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"watchlist" | "history" | "portfolio" | "downloads" | "billing" | "settings" | "notifications">("watchlist");
  
  // States loaded from local storage synced cache
  const [user, setUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [billingPlan, setBillingPlan] = useState("Viewer Free Tier");
  
  // Settings Form States
  const [fullNameInput, setFullNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarInput, setAvatarInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  // Notification Preferences States
  const [notifReleases, setNotifReleases] = useState(true);
  const [notifEpisodes, setNotifEpisodes] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifBilling, setNotifBilling] = useState(true);

  // General App states
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState("English");
  const [isClient, setIsClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadProfileData = () => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem("oldverse_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFullNameInput(parsed.name || "");
      setUsernameInput(parsed.username || "");
      setBioInput(parsed.bio || "");
      setAvatarInput(parsed.avatar || "");
      setEmailInput(parsed.email || "");

      // Load notif preferences
      const notifs = parsed.notificationPreferences || {};
      setNotifReleases(notifs.releases !== false);
      setNotifEpisodes(notifs.episodes !== false);
      setNotifSecurity(notifs.security !== false);
      setNotifBilling(notifs.billing !== false);
    } else {
      setUser(null);
    }

    // Load static list syncs
    const allMedia = getStoreData.media();
    const watchlistIds = getStoreData.watchlistIds();
    setWatchlist(allMedia.filter(m => watchlistIds.includes(m.id)));
    setHistory(getStoreData.history());
    setDownloads(getStoreData.downloads());
    setContinueWatching(getStoreData.continueWatching());
    setNotifications(getStoreData.notifications());

    const plan = localStorage.getItem("oldverse_billing_plan") || "Viewer Free Tier";
    setBillingPlan(plan);
  };

  useEffect(() => {
    setIsClient(true);
    loadProfileData();

    // Listen for storage / database updates
    window.addEventListener("oldverse_store_update", loadProfileData);
    return () => window.removeEventListener("oldverse_store_update", loadProfileData);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullNameInput.trim(),
          username: usernameInput.trim().toLowerCase(),
          bio: bioInput.trim(),
          avatar_url: avatarInput.trim()
        })
        .eq("id", user.id);

      if (error) {
        alert("Profile Update Failed: " + error.message);
      } else {
        await syncWithSupabase();
        alert("Your profile has been updated successfully!");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailInput.trim()
      });

      if (error) {
        alert("Failed to update email: " + error.message);
      } else {
        alert("Confirmation links sent! Please check both your current and new email address to verify.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      alert("Passwords do not match.");
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordInput
      });

      if (error) {
        alert("Failed to update password: " + error.message);
      } else {
        alert("Your account password has been updated successfully!");
        setPasswordInput("");
        setConfirmPasswordInput("");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateNotifPrefs = async () => {
    if (!user) return;
    setIsUpdating(true);

    const preferences = {
      releases: notifReleases,
      episodes: notifEpisodes,
      security: notifSecurity,
      billing: notifBilling
    };

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          notification_preferences: preferences
        })
        .eq("id", user.id);

      if (error) {
        alert("Failed to update preferences: " + error.message);
      } else {
        await syncWithSupabase();
        alert("Notification preferences saved successfully!");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgradePlan = () => {
    localStorage.setItem("oldverse_billing_plan", "Premium Stage Pass ($9.99/mo)");
    setBillingPlan("Premium Stage Pass ($9.99/mo)");
    
    // Attempt database status upgrade if logged in
    if (user) {
      supabase
        .from("profiles")
        .update({ subscription_plan: "premium" })
        .eq("id", user.id)
        .then(() => syncWithSupabase());
    }

    confetti({
      particleCount: 120,
      spread: 75,
      colors: ["#F5A623", "#34D399", "#FFFFFF"]
    });
    
    alert("Welcome to the Premium Stage Pass! Ads disabled and raw offline downloads unlocked.");
  };

  const handleLogoutAllDevices = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) {
        alert("Logout failed: " + error.message);
      } else {
        alert("Logged out of all active sessions across all devices.");
        router.push("/auth");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("CRITICAL WARNING: Are you absolutely sure you want to permanently delete your account? All watchlists, history, and credentials will be deleted forever.")) {
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/auth/delete-account", { method: "POST" });
      const data = await res.json();
      setIsUpdating(false);

      if (data.success) {
        alert("Your account has been deleted successfully. We hope to see you again!");
        localStorage.removeItem("oldverse_user");
        window.dispatchEvent(new Event("oldverse_store_update"));
        router.push("/");
      } else {
        alert(data.error || "Failed to delete account.");
      }
    } catch (err: any) {
      setIsUpdating(false);
      alert("Exception: " + err.message);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText("https://theoldverse.com/portfolio/visual-pioneer");
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ["#F5A623", "#34D399"]
    });
    alert("Your sharable portfolio link has been copied to your clipboard!");
  };

  const handleExportPDF = () => {
    alert("Exporting your OldVerse Creative Resume... PDF download will begin shortly.");
    confetti({
      particleCount: 30,
      spread: 30,
      colors: ["#34D399", "#FFFFFF"]
    });
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl border border-white/5 bg-oldverse-card/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-oldverse-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-white/10 flex-none bg-[#181818] flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-oldverse-secondary" />
            )}
          </div>

          <div className="flex-grow text-center sm:text-left space-y-2">
            <h1 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase leading-none">
              {user ? user.name : "Guest Session"}
            </h1>
            <p className="text-xs text-oldverse-secondary font-grotesk tracking-wide uppercase">
              {user ? user.email : "Limited access mode"}
            </p>
            {user && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <span className="text-[9px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-oldverse-secondary">
                  Role: {user.isCreator ? "Creator/Director" : "Standard Viewer"}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest bg-oldverse-accent/15 border border-oldverse-accent/25 px-2.5 py-0.5 rounded text-oldverse-accent">
                  Plan: {billingPlan}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-4 md:gap-6 border-b border-white/5 text-sm font-grotesk tracking-wide font-medium">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "watchlist" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Film className="h-4 w-4" />
            My List ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "history" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Clock className="h-4 w-4" />
            Watch History ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "portfolio" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Creative Resume
          </button>
          <button
            onClick={() => setActiveTab("downloads")}
            className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "downloads" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Download className="h-4 w-4" />
            Downloads ({downloads.length})
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "billing" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Billing & Subscriptions
          </button>
          {user && (
            <>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "notifications" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
                }`}
              >
                <Bell className="h-4 w-4" />
                Notifications ({notifications.filter(n => !n.isRead).length})
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "settings" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
                }`}
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </button>
            </>
          )}
        </div>

        {/* Tab Panels */}
        <div className="min-h-80">
          
          {/* WATCHLIST */}
          {activeTab === "watchlist" && (
            <div className="animate-fade-in">
              {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {watchlist.map((item) => {
                    const isInsta = item.videoUrl?.includes("instagram.com");
                    const cardContent = (
                      <>
                        <div className="aspect-[2/3] overflow-hidden relative">
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {user && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                mutateStore.toggleWatchlist(item.id);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 border border-white/10 text-oldverse-error hover:scale-110 transition-transform cursor-pointer z-10"
                              title="Remove from Watchlist"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="p-3 space-y-1">
                          <span className="text-[9px] uppercase font-grotesk font-semibold text-oldverse-accent block">
                            {item.category}
                          </span>
                          <h3 className="font-grotesk text-sm font-bold text-oldverse-text group-hover:text-oldverse-accent transition-colors truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-oldverse-secondary">{item.duration}</p>
                        </div>
                      </>
                    );

                    return isInsta ? (
                      <a
                        key={item.id}
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col rounded-lg overflow-hidden border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/30 transition-all duration-300 relative"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      <Link
                        key={item.id}
                        href={`/watch/${item.id}`}
                        className="group flex flex-col rounded-lg overflow-hidden border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/30 transition-all duration-300 relative"
                      >
                        {cardContent}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-oldverse-secondary/40 font-light text-sm">
                  Your Watchlist is empty. Browse movies and click "Add to Watchlist" to save them here.
                </div>
              )}
            </div>
          )}

          {/* WATCH HISTORY */}
          {activeTab === "history" && (
            <div className="max-w-2xl mx-auto space-y-3 animate-fade-in">
              {history.length > 0 && user && (
                <div className="flex justify-end pb-2">
                  <button
                    onClick={() => {
                      if (confirm("Clear your entire watch history?")) {
                        mutateStore.clearHistory();
                      }
                    }}
                    className="text-xs font-grotesk font-semibold uppercase tracking-wider text-oldverse-error hover:text-red-400 transition-colors"
                  >
                    Clear History Logs
                  </button>
                </div>
              )}

              {history.map((hist) => (
                <div
                  key={hist.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-oldverse-card/45 hover:border-white/10 transition-all"
                >
                  <img
                    src={hist.posterUrl}
                    alt={hist.title}
                    className="h-14 w-11 object-cover rounded border border-white/5"
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-grotesk text-sm font-bold text-oldverse-text truncate">{hist.title}</h4>
                    <span className="text-[10px] text-oldverse-secondary block mb-1">Last watched: {hist.date}</span>
                    {hist.percentage && (
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-oldverse-accent" style={{ width: `${hist.percentage}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-oldverse-accent">{hist.percentage}% watched</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/watch/${hist.mediaId}`}
                      className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-grotesk font-bold text-oldverse-text hover:bg-oldverse-accent hover:border-oldverse-accent hover:text-oldverse-bg transition-colors"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      Resume
                    </Link>
                    {user && (
                      <button
                        onClick={() => mutateStore.removeHistoryItem(hist.mediaId)}
                        className="p-2 text-oldverse-secondary hover:text-oldverse-error transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-20 text-oldverse-secondary/40 font-light text-sm">
                  No watch logs found in history logs.
                </div>
              )}
            </div>
          )}

          {/* CREATIVE RESUME */}
          {activeTab === "portfolio" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 bg-oldverse-card/50 border border-white/5 rounded-xl p-6 space-y-6 relative">
                <div className="flex justify-between items-start pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest font-grotesk text-oldverse-accent">
                      OldVerse Creative Credentials
                    </span>
                    <h2 className="font-bebas text-3xl text-oldverse-text tracking-wider uppercase">
                      Visual Resume
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShareLink}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-oldverse-secondary hover:text-white transition-colors cursor-pointer"
                      title="Share Portfolio Link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-oldverse-secondary hover:text-white transition-colors cursor-pointer"
                      title="Export PDF Resume"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-grotesk text-[10px] uppercase font-bold text-oldverse-text tracking-widest">
                    Professional Headline
                  </h4>
                  <p className="font-mono text-xs text-oldverse-accent">
                    Director / Independent Cinematographer / Visual Foley Architect
                  </p>
                  <p className="text-xs text-oldverse-secondary leading-relaxed font-light font-sans pt-1">
                    {user?.bio || "Independent visual artist specializing in high-contrast monochromatic staging, natural light photography grids, and ambient atmospheric soundscapes. Fully vetted on The OldVerse streaming ecosystem."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DOWNLOADS */}
          {activeTab === "downloads" && (
            <div className="max-w-2xl mx-auto space-y-3 animate-fade-in">
              {downloads.map((dl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-oldverse-card/45"
                >
                  <div className="space-y-1">
                    <h4 className="font-grotesk text-sm font-bold text-oldverse-text">{dl.title}</h4>
                    <p className="text-[10px] text-oldverse-secondary font-light">Downloaded file size: {dl.size}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-oldverse-success font-semibold flex items-center gap-1">
                      <Check className="h-4 w-4 stroke-[3]" />
                      Offline Ready
                    </span>
                  </div>
                </div>
              ))}
              {downloads.length === 0 && (
                <div className="text-center py-20 text-oldverse-secondary/40 font-light text-sm">
                  No downloaded files available on this device.
                </div>
              )}
            </div>
          )}

          {/* BILLING AND PLANS */}
          {activeTab === "billing" && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 animate-fade-in">
              <div className="bg-oldverse-card border border-white/5 rounded-xl p-6 space-y-5 self-start">
                <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                  Ecosystem Plan Details
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between pb-3 border-b border-white/5">
                    <span className="text-oldverse-secondary">Subscription Status</span>
                    <span className="font-bold text-oldverse-accent uppercase">{billingPlan}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/5">
                    <span className="text-oldverse-secondary">Billing Schedule</span>
                    <span className="font-semibold text-oldverse-text">Monthly</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/5">
                    <span className="text-oldverse-secondary">Next Renewal</span>
                    <span className="font-semibold text-oldverse-text">July 25, 2026</span>
                  </div>
                </div>
              </div>

              <div className="glassmorphism-card rounded-xl p-6 border border-white/10 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-oldverse-accent">
                    <Sparkles className="h-5 w-5 text-oldverse-accent" />
                    <span className="text-xs uppercase font-bold tracking-widest font-grotesk">Premium Stage Pass</span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="font-bebas text-5xl text-oldverse-text">$9.99</span>
                    <span className="text-xs text-oldverse-secondary">/ month</span>
                  </div>
                  <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                    Unlock the ultimate screening experience. Direct revenue shares to creators, ultra HD streaming bitrate, zero promotional banners, and access to all casting hub resources.
                  </p>
                </div>

                {billingPlan.includes("Premium") ? (
                  <div className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-oldverse-accent/15 border border-oldverse-accent/20 text-xs font-grotesk font-bold text-oldverse-accent uppercase">
                    <Check className="h-4 w-4 stroke-[3]" />
                    Stage Pass Active
                  </div>
                ) : (
                  <button
                    onClick={handleUpgradePlan}
                    className="w-full py-3 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold uppercase text-xs tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Upgrade to Stage Pass
                  </button>
                )}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && user && (
            <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                  Your Activity Inbox
                </h3>
                <button
                  onClick={handleUpdateNotifPrefs}
                  disabled={isUpdating}
                  className="text-xs text-oldverse-accent hover:text-amber-400 font-semibold cursor-pointer"
                >
                  Configure Channels
                </button>
              </div>

              {/* Notification Preferences Sub-panel */}
              <div className="p-4 bg-oldverse-card/50 border border-white/5 rounded-xl grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-oldverse-secondary">New Releases</span>
                  <input
                    type="checkbox"
                    checked={notifReleases}
                    onChange={(e) => setNotifReleases(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/5 border-white/10 text-oldverse-accent focus:ring-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-oldverse-secondary">New Episodes</span>
                  <input
                    type="checkbox"
                    checked={notifEpisodes}
                    onChange={(e) => setNotifEpisodes(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/5 border-white/10 text-oldverse-accent focus:ring-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-oldverse-secondary">Security Alerts</span>
                  <input
                    type="checkbox"
                    checked={notifSecurity}
                    onChange={(e) => setNotifSecurity(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/5 border-white/10 text-oldverse-accent focus:ring-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-oldverse-secondary">Billing Updates</span>
                  <input
                    type="checkbox"
                    checked={notifBilling}
                    onChange={(e) => setNotifBilling(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/5 border-white/10 text-oldverse-accent focus:ring-0"
                  />
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-xl border flex justify-between gap-4 transition-all ${
                      n.isRead 
                        ? "border-white/5 bg-oldverse-card/30 opacity-70"
                        : "border-oldverse-accent/20 bg-oldverse-accent/3"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-oldverse-accent" />}
                        <h4 className="text-xs font-bold text-oldverse-text font-grotesk">{n.title}</h4>
                      </div>
                      <p className="text-xs text-oldverse-secondary leading-relaxed font-light">{n.message}</p>
                      <span className="text-[9px] text-white/30 block pt-1">{n.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <button
                          onClick={() => mutateStore.markNotificationAsRead(n.id)}
                          className="text-[10px] text-oldverse-accent hover:underline uppercase font-bold"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => mutateStore.deleteNotification(n.id)}
                        className="text-oldverse-secondary hover:text-oldverse-error transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-xs text-oldverse-secondary/40 text-center py-12">No notifications found.</p>
                )}
              </div>
            </div>
          )}

          {/* ACCOUNT SETTINGS TAB */}
          {activeTab === "settings" && user && (
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 animate-fade-in">
              {/* Profile details */}
              <form onSubmit={handleUpdateProfile} className="space-y-5 bg-oldverse-card border border-white/5 rounded-xl p-6">
                <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text pb-2 border-b border-white/5">
                  Update Profile Details
                </h3>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-oldverse-secondary">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full p-3 bg-white/3 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-oldverse-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-oldverse-secondary">Unique Username</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full p-3 bg-white/3 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-oldverse-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-oldverse-secondary">Profile Bio</label>
                  <textarea
                    rows={3}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full p-3 bg-white/3 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-oldverse-accent resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-oldverse-secondary">Avatar URL</label>
                  <input
                    type="text"
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    className="w-full p-3 bg-white/3 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-oldverse-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 bg-[#F5A623] hover:bg-[#F5A623]/85 text-black font-grotesk font-bold uppercase text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save Profile Details"}
                </button>
              </form>

              <div className="space-y-6">
                {/* Email update form */}
                <form onSubmit={handleUpdateEmail} className="space-y-4 bg-oldverse-card border border-white/5 rounded-xl p-6">
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text pb-2 border-b border-white/5">
                    Change Email Address
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-oldverse-secondary">New Email</label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full p-3 bg-white/3 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-oldverse-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-3 border border-white/10 hover:border-oldverse-accent/30 bg-white/3 hover:bg-white/5 text-white font-grotesk font-bold uppercase text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Change Email
                  </button>
                </form>

                {/* Password update form */}
                <form onSubmit={handleUpdatePassword} className="space-y-4 bg-oldverse-card border border-white/5 rounded-xl p-6">
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text pb-2 border-b border-white/5">
                    Change Account Password
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-oldverse-secondary">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full p-3 bg-white/3 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-oldverse-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-oldverse-secondary">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full p-3 bg-white/3 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-oldverse-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-3 border border-white/10 hover:border-oldverse-accent/30 bg-white/3 hover:bg-white/5 text-white font-grotesk font-bold uppercase text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Change Password
                  </button>
                </form>

                {/* Account Actions */}
                <div className="bg-oldverse-card border border-white/5 rounded-xl p-6 space-y-4">
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text pb-2 border-b border-white/5">
                    Security & Session Control
                  </h3>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleLogoutAllDevices}
                      disabled={isUpdating}
                      className="flex-grow py-3 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-grotesk font-bold uppercase text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      Logout All Devices
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      disabled={isUpdating}
                      className="flex-grow py-3 bg-red-500 hover:bg-red-600 text-white font-grotesk font-bold uppercase text-xs tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
