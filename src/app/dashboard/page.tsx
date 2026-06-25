"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Upload, MessageSquare, Settings, Check, DollarSign, Users, Eye, Clock, Film, Sparkles, Plus, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { MediaItem, Creator } from "@/lib/mockData";

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "upload" | "community" | "settings">("analytics");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Form states for Media Upload
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<MediaItem["type"]>("movie");
  const [uploadCategory, setUploadCategory] = useState("Action");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadDuration, setUploadDuration] = useState("1h 20m");
  const [uploadPosterUrl, setUploadPosterUrl] = useState("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600");
  const [uploadVideoUrl, setUploadVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4");

  // Form states for Community Post
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<"behind-the-scenes" | "discussion" | "announcement">("behind-the-scenes");
  const [postImageUrl, setPostImageUrl] = useState("");

  const loadDashboardData = () => {
    setMediaItems(getStoreData.media());
    setCreators(getStoreData.creators());
  };

  useEffect(() => {
    setIsClient(true);
    loadDashboardData();

    window.addEventListener("oldverse_store_update", loadDashboardData);
    return () => window.removeEventListener("oldverse_store_update", loadDashboardData);
  }, []);

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadDescription.trim()) return;

    mutateStore.addMedia({
      title: uploadTitle,
      type: uploadType,
      category: uploadCategory,
      description: uploadDescription,
      duration: uploadDuration,
      posterUrl: uploadPosterUrl,
      bannerUrl: uploadPosterUrl, // use same for mock
      videoUrl: uploadVideoUrl,
      isTrending: false,
      isOriginal: uploadType === "original"
    });

    // Celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F5A623", "#FF8C32", "#ffffff"]
    });

    // Reset Form
    setUploadTitle("");
    setUploadDescription("");
    alert("Project published successfully to The OldVerse!");
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    mutateStore.addCommunityPost(postContent, postCategory, postImageUrl || undefined);

    confetti({
      particleCount: 50,
      spread: 45,
      colors: ["#34D399", "#F5A623"]
    });

    setPostContent("");
    setPostImageUrl("");
    alert("Community post published successfully!");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate quick metrics for current creator (mocked as Elena Rostova)
  const currentCreator = creators[0] || { name: "Elena Rostova", followers: 124500 };
  const creatorShows = mediaItems.filter(m => m.creatorName === currentCreator.name || m.creatorId === "creator-current-user");

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-8">
          <div>
            <h1 className="font-bebas text-3xl sm:text-5xl text-oldverse-text tracking-wider uppercase leading-none">
              Creator Hub
            </h1>
            <p className="text-oldverse-secondary text-xs font-grotesk tracking-wide uppercase">
              Managing portfolio for <span className="text-oldverse-accent font-bold">{currentCreator.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-1 bg-oldverse-accent/10 border border-oldverse-accent/20 px-3 py-1 rounded-full text-xs text-oldverse-accent font-semibold">
            <Check className="h-3.5 w-3.5" />
            <span>Verified Stage Director</span>
          </div>
        </div>

        {/* Sidebar & Dashboard Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Menu */}
          <aside className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all ${
                activeTab === "analytics"
                  ? "bg-oldverse-accent text-oldverse-bg shadow-lg shadow-oldverse-accent/15"
                  : "text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all ${
                activeTab === "upload"
                  ? "bg-oldverse-accent text-oldverse-bg shadow-lg shadow-oldverse-accent/15"
                  : "text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload Project
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all ${
                activeTab === "community"
                  ? "bg-oldverse-accent text-oldverse-bg shadow-lg shadow-oldverse-accent/15"
                  : "text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Backstage Feed
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all ${
                activeTab === "settings"
                  ? "bg-oldverse-accent text-oldverse-bg shadow-lg shadow-oldverse-accent/15"
                  : "text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* 4 Cards Widgets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-oldverse-secondary">
                      <span className="text-[10px] uppercase font-grotesk font-bold tracking-wider">Followers</span>
                      <Users className="h-4 w-4" />
                    </div>
                    <p className="font-bebas text-3xl text-oldverse-text">{currentCreator.followers.toLocaleString()}</p>
                    <span className="text-[10px] text-oldverse-success font-semibold">+1.2% this week</span>
                  </div>

                  <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-oldverse-secondary">
                      <span className="text-[10px] uppercase font-grotesk font-bold tracking-wider">Views</span>
                      <Eye className="h-4 w-4" />
                    </div>
                    <p className="font-bebas text-3xl text-oldverse-text">438.4K</p>
                    <span className="text-[10px] text-oldverse-success font-semibold">+8.5% this week</span>
                  </div>

                  <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-oldverse-secondary">
                      <span className="text-[10px] uppercase font-grotesk font-bold tracking-wider">Hours Watched</span>
                      <Clock className="h-4 w-4" />
                    </div>
                    <p className="font-bebas text-3xl text-oldverse-text">14.2K</p>
                    <span className="text-[10px] text-oldverse-success font-semibold">+4.2% this week</span>
                  </div>

                  <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-oldverse-secondary">
                      <span className="text-[10px] uppercase font-grotesk font-bold tracking-wider">Net Income</span>
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <p className="font-bebas text-3xl text-oldverse-accent">$4,821.50</p>
                    <span className="text-[10px] text-oldverse-success font-semibold">+$240 today</span>
                  </div>
                </div>

                {/* SVG Visualizer Chart */}
                <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                      Audience Reach Growth (Views)
                    </h3>
                    <span className="text-[10px] uppercase font-semibold text-oldverse-accent bg-oldverse-accent/10 px-2 py-0.5 border border-oldverse-accent/25 rounded">
                      Live Updates
                    </span>
                  </div>
                  
                  {/* Custom SVG Area chart */}
                  <div className="h-64 w-full relative">
                    <svg viewBox="0 0 500 200" className="w-full h-full text-oldverse-accent overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#F5A623" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0" y1="190" x2="500" y2="190" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      
                      {/* Chart Area Fill */}
                      <path
                        d="M 0 160 C 80 140, 120 180, 200 120 C 280 60, 320 100, 400 50 C 450 20, 480 30, 500 10 L 500 190 L 0 190 Z"
                        fill="url(#chartGradient)"
                      />
                      
                      {/* Chart Line */}
                      <path
                        d="M 0 160 C 80 140, 120 180, 200 120 C 280 60, 320 100, 400 50 C 450 20, 480 30, 500 10"
                        fill="none"
                        stroke="#F5A623"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                  
                  {/* Timeline labels */}
                  <div className="flex justify-between text-[10px] text-oldverse-secondary font-grotesk font-semibold">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span>JUN</span>
                  </div>
                </div>

                {/* My Active Shows list */}
                <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                    My Published Projects ({creatorShows.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {creatorShows.map((show) => (
                      <div key={show.id} className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-white/3">
                        <img
                          src={show.posterUrl}
                          alt={show.title}
                          className="h-12 w-10 object-cover rounded"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="font-grotesk text-sm font-bold text-oldverse-text truncate">{show.title}</h4>
                          <span className="text-[10px] uppercase text-oldverse-accent font-semibold">{show.category}</span>
                        </div>
                        <div className="text-right text-xs">
                          <span className="block text-oldverse-text font-bold">{show.rating} Rating</span>
                          <span className="text-oldverse-secondary">{show.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* UPLOAD TAB */}
            {activeTab === "upload" && (
              <form onSubmit={handleMediaSubmit} className="bg-oldverse-card border border-white/5 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <Sparkles className="h-4.5 w-4.5 text-oldverse-accent" />
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                    Publish New Original
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Project Title</label>
                    <input
                      type="text"
                      required
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Echoes of the Wasteland"
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Category/Genre</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                    >
                      {["Action", "Romance", "Drama", "Comedy", "Horror", "Documentary", "Animation", "Photography", "Travel", "Experimental"].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Release Format</label>
                    <select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value as MediaItem["type"])}
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                    >
                      <option value="movie">Short Film / Movie</option>
                      <option value="series">Episodic Series</option>
                      <option value="bts">Behind the Scenes</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Duration / Count</label>
                    <input
                      type="text"
                      required
                      value={uploadDuration}
                      onChange={(e) => setUploadDuration(e.target.value)}
                      placeholder="e.g. 1h 15m or 4 Episodes"
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Mock video quality</label>
                    <select
                      value={uploadVideoUrl}
                      onChange={(e) => setUploadVideoUrl(e.target.value)}
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                    >
                      <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4">Cinema Demo (Tears of Steel)</option>
                      <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4">Indie Narrative (Sintel)</option>
                      <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">Animated Story (Big Buck Bunny)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Description & Synopsis</label>
                  <textarea
                    required
                    rows={4}
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Provide a detailed cinematic description for your project..."
                    className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Cover Poster Image (Unsplash URL)</label>
                  <input
                    type="text"
                    required
                    value={uploadPosterUrl}
                    onChange={(e) => setUploadPosterUrl(e.target.value)}
                    placeholder="Enter an image URL for the showcase card..."
                    className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold uppercase text-xs tracking-wider transition-all duration-300"
                >
                  <Upload className="h-4 w-4" />
                  Publish Project
                </button>
              </form>
            )}

            {/* COMMUNITY FEED TAB */}
            {activeTab === "community" && (
              <form onSubmit={handlePostSubmit} className="bg-oldverse-card border border-white/5 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <MessageSquare className="h-4.5 w-4.5 text-oldverse-accent" />
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                    Post to Creator Backstage
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Category</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value as any)}
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                    >
                      <option value="behind-the-scenes">Behind the Scenes</option>
                      <option value="discussion">Discussion / Question</option>
                      <option value="announcement">Announcement / Screening</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Attachment Image (Optional Unsplash URL)</label>
                    <input
                      type="text"
                      value={postImageUrl}
                      onChange={(e) => setPostImageUrl(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-grotesk font-semibold text-oldverse-secondary uppercase">Content</label>
                  <textarea
                    required
                    rows={4}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share what is happening behind the scenes, casting updates, or questions with your audience..."
                    className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold uppercase text-xs tracking-wider transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4" />
                  Publish Post
                </button>
              </form>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="bg-oldverse-card border border-white/5 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <Settings className="h-4.5 w-4.5 text-oldverse-accent" />
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                    Profile & Brand settings
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={currentCreator.avatar}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="font-grotesk text-sm font-bold text-oldverse-text">{currentCreator.name}</h4>
                      <p className="text-xs text-oldverse-secondary">@{currentCreator.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-oldverse-secondary block">Distribution Share</span>
                      <p className="text-sm font-bold text-oldverse-text">70% (Premium Creator Class)</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-oldverse-secondary block">Verification Badge</span>
                      <p className="text-sm font-bold text-oldverse-accent">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
