"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Upload, MessageSquare, Settings, Check, DollarSign, Users, Eye, Clock, Film, Sparkles, Plus, Trash2, Briefcase, Mail, FileText, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { MediaItem, Creator, CastingCall, JobApplication } from "@/lib/mockData";

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "upload" | "jobs" | "settings">("analytics");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Form states for Media Upload
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<MediaItem["type"]>("movie");
  const [uploadCategory, setUploadCategory] = useState("Action");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadDuration, setUploadDuration] = useState("1h 20m");
  const [uploadPosterUrl, setUploadPosterUrl] = useState("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600");
  const [uploadVideoUrl, setUploadVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4");

  // Form states for Job Posting
  const [jobTitle, setJobTitle] = useState("");
  const [jobProject, setJobProject] = useState("");
  const [jobRoleType, setJobRoleType] = useState<"casting" | "crew">("crew");
  const [jobRoleName, setJobRoleName] = useState("");
  const [jobBudget, setJobBudget] = useState("");
  const [jobLocationType, setJobLocationType] = useState<"Remote" | "On-Set" | "Hybrid">("Remote");
  const [jobLocation, setJobLocation] = useState("Remote");
  const [jobContractType, setJobContractType] = useState<CastingCall["type"]>("Contract");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");



  const loadDashboardData = () => {
    setMediaItems(getStoreData.media());
    setCreators(getStoreData.creators());
    // Filter applications where creatorId is current user creator
    setApplications(getStoreData.jobApplications().filter(app => app.creatorId === "creator-current-user"));
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

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) return;

    // Parse requirements
    const reqs = jobRequirements
      .split(",")
      .map(r => r.trim())
      .filter(r => r.length > 0);

    mutateStore.postJob({
      title: jobTitle,
      project: jobProject || "Untitled Production",
      role: jobRoleName || jobTitle,
      description: jobDescription,
      requirements: reqs.length > 0 ? reqs : ["Prior film production experience preferred"],
      location: jobLocation,
      type: jobContractType,
      roleType: jobRoleType,
      budget: jobBudget || "Paid / Contract",
      locationType: jobLocationType
    });

    confetti({
      particleCount: 80,
      spread: 60,
      colors: ["#34D399", "#F5A623"]
    });

    // Reset Form
    setJobTitle("");
    setJobProject("");
    setJobRoleName("");
    setJobBudget("");
    setJobLocation("Remote");
    setJobDescription("");
    setJobRequirements("");
    alert("Job listing posted successfully to the community opportunities board!");
  };


  const handleAppStatus = (appId: string, status: "approved" | "declined") => {
    mutateStore.updateApplicationStatus(appId, status);
    confetti({
      particleCount: 40,
      spread: 40,
      colors: status === "approved" ? ["#34D399", "#ffffff"] : ["#EF4444", "#ffffff"]
    });
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all cursor-pointer ${
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "upload"
                  ? "bg-oldverse-accent text-oldverse-bg shadow-lg shadow-oldverse-accent/15"
                  : "text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload Project
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "jobs"
                  ? "bg-oldverse-accent text-oldverse-bg shadow-lg shadow-oldverse-accent/15"
                  : "text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Casting & Crews ({applications.length})
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-grotesk font-semibold tracking-wide transition-all cursor-pointer ${
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

                {/* My Published Shows list */}
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
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text cursor-pointer outline-none"
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
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text cursor-pointer outline-none"
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
                      className="w-full text-xs pl-3 pr-3 py-2.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text cursor-pointer outline-none"
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
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold uppercase text-xs tracking-wider transition-all duration-300 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Publish Project
                </button>
              </form>
            )}

            {/* JOBS / OPPORTUNITIES TAB */}
            {activeTab === "jobs" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
                {/* Left Column: Post Job */}
                <form onSubmit={handleJobSubmit} className="bg-oldverse-card border border-white/5 rounded-xl p-6 space-y-4 self-start">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Plus className="h-4.5 w-4.5 text-oldverse-accent" />
                    <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                      Post Casting / Crew Listing
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Opportunity Title</label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Lead Colorist for Cyberpunk Film"
                      className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Role Category</label>
                      <select
                        value={jobRoleType}
                        onChange={(e) => setJobRoleType(e.target.value as "casting" | "crew")}
                        className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text cursor-pointer"
                      >
                        <option value="crew">Crew Finder (DP, Editor, Sound)</option>
                        <option value="casting">Casting Call (Actor, Model)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Project Name</label>
                      <input
                        type="text"
                        required
                        value={jobProject}
                        onChange={(e) => setJobProject(e.target.value)}
                        placeholder="e.g. Vector Zero"
                        className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Budget Details</label>
                      <input
                        type="text"
                        required
                        value={jobBudget}
                        onChange={(e) => setJobBudget(e.target.value)}
                        placeholder="e.g. $250/day or Profit Share"
                        className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Specific Role</label>
                      <input
                        type="text"
                        required
                        value={jobRoleName}
                        onChange={(e) => setJobRoleName(e.target.value)}
                        placeholder="e.g. Director of Photography"
                        className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Work Type</label>
                      <select
                        value={jobContractType}
                        onChange={(e) => setJobContractType(e.target.value as CastingCall["type"])}
                        className="w-full text-xs pl-2 pr-2 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text cursor-pointer"
                      >
                        <option value="Contract">Contract</option>
                        <option value="Collaboration">Collab</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Full-Time">Full-Time</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Location Type</label>
                      <select
                        value={jobLocationType}
                        onChange={(e) => setJobLocationType(e.target.value as any)}
                        className="w-full text-xs pl-2 pr-2 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text cursor-pointer"
                      >
                        <option value="Remote">Remote</option>
                        <option value="On-Set">On-Set</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">City / Region</label>
                      <input
                        type="text"
                        required
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        placeholder="e.g. London or Remote"
                        className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Requirements (comma-separated)</label>
                    <input
                      type="text"
                      value={jobRequirements}
                      onChange={(e) => setJobRequirements(e.target.value)}
                      placeholder="e.g. Owns RED camera, 5+ yrs experience, DaVinci Suite"
                      className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-grotesk font-bold text-oldverse-secondary uppercase">Listing Description</label>
                    <textarea
                      required
                      rows={3}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Outline details of the production, shoot schedule, expectations..."
                      className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Post Opportunity
                  </button>
                </form>

                {/* Right Column: Applications Received */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <FileText className="h-4.5 w-4.5 text-oldverse-accent" />
                    <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                      Applications Received ({applications.length})
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-3 relative hover:border-white/10 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-oldverse-text font-grotesk">{app.applicantName}</h4>
                            <span className="text-[10px] text-oldverse-accent font-semibold block">{app.jobTitle}</span>
                            <span className="text-[9px] text-oldverse-secondary font-light">Applied: {app.createdAt}</span>
                          </div>

                          <div className="text-right">
                            <span className={`text-[9px] uppercase font-grotesk font-bold px-2 py-0.5 rounded ${
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

                        {/* Details */}
                        <div className="space-y-2 text-xs text-oldverse-secondary font-light pt-2 border-t border-white/5">
                          <div className="flex flex-wrap gap-4 text-[10px] font-mono">
                            <a href={`mailto:${app.applicantEmail}`} className="flex items-center gap-1 hover:text-oldverse-accent">
                              <Mail className="h-3 w-3" />
                              {app.applicantEmail}
                            </a>
                            <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-oldverse-accent hover:underline">
                              <ExternalLink className="h-3 w-3" />
                              Portfolio Link
                            </a>
                          </div>
                          
                          <p className="font-sans italic bg-black/25 p-2.5 rounded border border-white/5 leading-relaxed text-[11px]">
                            "{app.coverLetter}"
                          </p>
                        </div>

                        {/* Action buttons */}
                        {app.status === "pending" && (
                          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                              onClick={() => handleAppStatus(app.id, "declined")}
                              className="px-3 py-1 text-[10px] font-grotesk uppercase font-bold text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAppStatus(app.id, "approved")}
                              className="px-3 py-1 text-[10px] font-grotesk uppercase font-bold bg-oldverse-accent text-oldverse-bg hover:bg-oldverse-accent-secondary rounded transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <div className="text-center py-16 text-oldverse-secondary/40 text-xs font-light">
                        No applications received yet for your postings.
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
