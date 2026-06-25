"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Film, Clock, Download, CreditCard, Star, Play, Sparkles, Check, Trash2, Share2, FileDown, Briefcase, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { MediaItem, Review, JobApplication } from "@/lib/mockData";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"watchlist" | "history" | "portfolio" | "downloads" | "billing">("watchlist");
  const [user, setUser] = useState<{ name: string; email: string; isCreator: boolean } | null>(null);
  
  // Lists data
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [history, setHistory] = useState<{ id: string; mediaId: string; title: string; posterUrl: string; date: string }[]>([]);
  const [downloads, setDownloads] = useState<{ mediaId: string; title: string; size: string; progress: number }[]>([]);
  const [billingPlan, setBillingPlan] = useState("Viewer Free Tier");
  
  // Phase 3 States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isClient, setIsClient] = useState(false);

  const loadUserData = () => {
    // Auth profile
    const storedUser = localStorage.getItem("oldverse_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ name: "Visual Pioneer", email: "pioneer@oldverse.com", isCreator: true });
    }

    // Lists
    const allMedia = getStoreData.media();
    const watchlistIds = getStoreData.watchlistIds();
    const filteredWatchlist = allMedia.filter(m => watchlistIds.includes(m.id));
    setWatchlist(filteredWatchlist);

    setHistory(getStoreData.history());
    setDownloads(getStoreData.downloads());
    
    // Load user's logged reviews and job applications
    const allReviews = getStoreData.allReviews();
    setReviews(allReviews.filter(r => r.author === "Visual Pioneer" || r.author === "Current User" || r.author === "Daniel Craig"));
    setApplications(getStoreData.jobApplications());

    // Billing plan Cache check
    const plan = localStorage.getItem("oldverse_billing_plan") || "Viewer Free Tier";
    setBillingPlan(plan);
  };

  useEffect(() => {
    setIsClient(true);
    loadUserData();

    window.addEventListener("oldverse_store_update", loadUserData);
    return () => window.removeEventListener("oldverse_store_update", loadUserData);
  }, []);

  const handleUpgradePlan = () => {
    localStorage.setItem("oldverse_billing_plan", "Premium Stage Pass ($9.99/mo)");
    setBillingPlan("Premium Stage Pass ($9.99/mo)");
    
    confetti({
      particleCount: 120,
      spread: 75,
      colors: ["#F5A623", "#34D399", "#FFFFFF"]
    });
    
    alert("Welcome to the Premium Stage Pass! Ads disabled and raw offline downloads unlocked.");
  };

  const handleToggleWatchlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    mutateStore.toggleWatchlist(id);
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

  // Calculate statistics
  const totalWatchHours = (history.length * 1.5).toFixed(1);

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Card Header */}
        {user && (
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl border border-white/5 bg-oldverse-card/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-oldverse-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-white/10 flex-none bg-[#181818] flex items-center justify-center">
              <User className="h-10 w-10 text-oldverse-secondary" />
            </div>

            <div className="flex-grow text-center sm:text-left space-y-2">
              <h1 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase leading-none">
                {user.name}
              </h1>
              <p className="text-xs text-oldverse-secondary font-grotesk tracking-wide uppercase">
                {user.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <span className="text-[9px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-oldverse-secondary">
                  Role: {user.isCreator ? "Creator/Director" : "Standard Viewer"}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest bg-oldverse-accent/15 border border-oldverse-accent/25 px-2.5 py-0.5 rounded text-oldverse-accent">
                  Plan: {billingPlan}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex gap-6 border-b border-white/5 text-sm font-grotesk tracking-wide font-medium">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`pb-3 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "watchlist" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Film className="h-4 w-4" />
            My Watchlist ({watchlist.length})
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
        </div>

        {/* Tab Panels */}
        <div className="min-h-80">
          
          {/* WATCHLIST */}
          {activeTab === "watchlist" && (
            <div className="animate-fade-in">
              {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {watchlist.map((item) => (
                    <Link
                      key={item.id}
                      href={`/watch/${item.id}`}
                      className="group flex flex-col rounded-lg overflow-hidden border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/30 transition-all duration-300 relative"
                    >
                      <div className="aspect-[2/3] overflow-hidden relative">
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          onClick={(e) => handleToggleWatchlist(e, item.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 border border-white/10 text-oldverse-error hover:scale-110 transition-transform cursor-pointer"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
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
                    </Link>
                  ))}
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
                    <span className="text-[10px] text-oldverse-secondary">Last watched: {hist.date}</span>
                  </div>
                  <Link
                    href={`/watch/${hist.mediaId}`}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-grotesk font-bold text-oldverse-text hover:bg-oldverse-accent hover:border-oldverse-accent hover:text-oldverse-bg transition-colors"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    Resume
                  </Link>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-20 text-oldverse-secondary/40 font-light text-sm">
                  No watch logs found in history logs.
                </div>
              )}
            </div>
          )}

          {/* CREATIVE RESUME BUILDER */}
          {activeTab === "portfolio" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              {/* Resume Card (Left columns) */}
              <div className="lg:col-span-2 bg-oldverse-card/50 border border-white/5 rounded-xl p-6 space-y-6 relative">
                
                {/* Brand Banner */}
                <div className="flex justify-between items-start pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest font-grotesk text-oldverse-accent">
                      OldVerse Creative Credentials
                    </span>
                    <h2 className="font-bebas text-3xl text-oldverse-text tracking-wider uppercase">
                      Visual Resume
                    </h2>
                  </div>
                  
                  {/* Actions */}
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

                {/* Professional Summary */}
                <div className="space-y-2">
                  <h4 className="font-grotesk text-[10px] uppercase font-bold text-oldverse-text tracking-widest">
                    Professional Headline
                  </h4>
                  <p className="font-mono text-xs text-oldverse-accent">
                    Director / Independent Cinematographer / Visual Foley Architect
                  </p>
                  <p className="text-xs text-oldverse-secondary leading-relaxed font-light font-sans pt-1">
                    Independent visual artist specializing in high-contrast monochromatic staging, natural light photography grids, and ambient atmospheric soundscapes. Fully vetted on The OldVerse streaming ecosystem.
                  </p>
                </div>

                {/* Metric Widgets */}
                <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-4">
                  <div className="text-center space-y-0.5">
                    <span className="block text-[9px] uppercase font-grotesk text-oldverse-secondary">Time Logged</span>
                    <span className="font-bebas text-xl text-oldverse-text">{totalWatchHours} Hours</span>
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="block text-[9px] uppercase font-grotesk text-oldverse-secondary">Reviews Written</span>
                    <span className="font-bebas text-xl text-oldverse-text">{reviews.length} Titles</span>
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="block text-[9px] uppercase font-grotesk text-oldverse-secondary">Verified Projects</span>
                    <span className="font-bebas text-xl text-oldverse-accent">1 Show</span>
                  </div>
                </div>

                {/* Experience Timeline */}
                <div className="space-y-4">
                  <h4 className="font-grotesk text-[10px] uppercase font-bold text-oldverse-text tracking-widest">
                    Ecosystem Projects & Credits
                  </h4>
                  
                  <div className="relative border-l border-white/5 pl-4 ml-2 space-y-4">
                    <div className="space-y-1 relative">
                      <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-oldverse-accent border-2 border-oldverse-bg" />
                      <div className="flex justify-between items-baseline">
                        <h5 className="text-xs font-bold text-oldverse-text">Director & Co-Editor</h5>
                        <span className="text-[9px] font-mono text-oldverse-secondary">Current Production</span>
                      </div>
                      <p className="text-[10px] text-oldverse-accent">"I Think they call this love...." — Original Short Film</p>
                      <p className="text-[10px] text-oldverse-secondary font-light">Collaborated with Prince and Amarjeet to direct a monochromatic study on unspoken urban relationships.</p>
                    </div>

                    <div className="space-y-1 relative">
                      <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-white/20 border-2 border-oldverse-bg" />
                      <div className="flex justify-between items-baseline">
                        <h5 className="text-xs font-bold text-oldverse-text">Foley Sound Sync Consultant</h5>
                        <span className="text-[9px] font-mono text-oldverse-secondary">April 2026</span>
                      </div>
                      <p className="text-[10px] text-oldverse-secondary">"The Sound of Stone" — VFX/BTS Masterclass</p>
                      <p className="text-[10px] text-oldverse-secondary font-light">Assisted sound mixing in experimental sub-surface microphone recordings with Vikram Malhotra.</p>
                    </div>
                  </div>
                </div>

                {/* Logged Diary Entries / Letterboxd reviews */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-grotesk text-[10px] uppercase font-bold text-oldverse-text tracking-widest">
                    Recent Film Diary Logs
                  </h4>
                  <div className="space-y-2">
                    {reviews.slice(0, 2).map(r => (
                      <div key={r.id} className="p-3 bg-black/20 border border-white/5 rounded-lg text-xs flex justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-oldverse-text truncate">{r.mediaId.replace("media-", "Project ID: ")}</span>
                            <span className="text-[9px] text-oldverse-secondary/50 font-mono">({r.date})</span>
                          </div>
                          <p className="text-oldverse-secondary font-light line-clamp-1 italic">"{r.text}"</p>
                        </div>
                        <div className="flex-none flex items-center gap-1">
                          <Star className="h-3 w-3 fill-oldverse-accent text-oldverse-accent" />
                          <span className="font-bold text-oldverse-text text-[10px]">{r.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                    {reviews.length === 0 && (
                      <p className="text-[10px] text-oldverse-secondary/40 font-light italic">No review diary entries logged yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Applications (Right column) */}
              <div className="bg-oldverse-card/30 border border-white/5 rounded-xl p-5 space-y-4 self-start">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Briefcase className="h-4 w-4 text-oldverse-accent" />
                  <h3 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
                    Active Applications ({applications.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-lg border border-white/5 bg-black/20 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-oldverse-text font-grotesk line-clamp-1">
                            {app.jobTitle}
                          </h4>
                          <span className="text-[9px] text-oldverse-secondary/60">Applied: {app.createdAt}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-grotesk font-bold px-1.5 py-0.5 rounded ${
                          app.status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : app.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-xs text-oldverse-secondary/40 text-center py-8 font-light">
                      No active job applications found. Apply to listings in the Casting Marketplace!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* OFFLINE DOWNLOADS */}
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
                    <Link
                      href={`/watch/${dl.mediaId}`}
                      className="p-2 rounded-full bg-white/5 border border-white/10 text-oldverse-secondary hover:text-oldverse-accent hover:border-oldverse-accent"
                    >
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </Link>
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
              
              {/* Current details */}
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
                  <div className="flex justify-between">
                    <span className="text-oldverse-secondary">Payment Method</span>
                    <span className="font-semibold text-oldverse-text">•••• •••• •••• 4821</span>
                  </div>
                </div>
              </div>

              {/* Upgrade Portal card */}
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

                  <ul className="text-xs text-oldverse-text/90 font-light space-y-2 pt-2 border-t border-white/5">
                    <li className="flex items-center gap-2">
                      <span className="text-oldverse-success">✓</span> 70% direct royalty payout to creators
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-oldverse-success">✓</span> Offline file downloads to device
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-oldverse-success">✓</span> Early access to featured originals
                    </li>
                  </ul>
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

        </div>
      </div>
    </div>
  );
}
