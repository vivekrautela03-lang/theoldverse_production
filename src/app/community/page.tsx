"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Users, Award, Film, User, Send, Heart, Check, Plus, Landmark, NotebookText } from "lucide-react";
import confetti from "canvas-confetti";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { CommunityPost, CastingCall } from "@/lib/mockData";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "casting" | "writing">("feed");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [castingCalls, setCastingCalls] = useState<CastingCall[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  
  // Posting states
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<CommunityPost["category"]>("discussion");
  const [postImageUrl, setPostImageUrl] = useState("");

  // Application Modal state
  const [activeApplication, setActiveApplication] = useState<CastingCall | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantBio, setApplicantBio] = useState("");

  const loadCommunityData = () => {
    setPosts(getStoreData.community());
    setCastingCalls(getStoreData.casting());
    setAppliedJobs(getStoreData.applications());
  };

  useEffect(() => {
    loadCommunityData();
    window.addEventListener("oldverse_store_update", loadCommunityData);
    return () => window.removeEventListener("oldverse_store_update", loadCommunityData);
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    mutateStore.addCommunityPost(postContent, postCategory, postImageUrl || undefined);
    
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#F5A623", "#34D399"]
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#F5A623", "#34D399"]
    });

    setPostContent("");
    setPostImageUrl("");
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplication || !applicantName.trim()) return;

    mutateStore.applyToCasting(activeApplication.id);
    
    // Confetti shower
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ["#F5A623", "#34D399"]
    });

    setActiveApplication(null);
    setApplicantName("");
    setApplicantBio("");
    alert("Your portfolio and audition tape have been submitted to the director!");
  };

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-white/5">
          <h1 className="font-bebas text-4xl sm:text-6xl text-oldverse-text tracking-wider uppercase leading-none">
            Creator Community
          </h1>
          <p className="text-oldverse-secondary text-xs font-grotesk tracking-wide uppercase">
            Collaboration, Casting, Diaries, and Directorial Debates
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-6 border-b border-white/5 text-sm font-grotesk tracking-wide font-medium">
          <button
            onClick={() => setActiveTab("feed")}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "feed" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Backstage Feed
          </button>
          <button
            onClick={() => setActiveTab("casting")}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "casting" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Users className="h-4 w-4" />
            Casting & Crews
          </button>
          <button
            onClick={() => setActiveTab("writing")}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "writing" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <NotebookText className="h-4 w-4" />
            Writing Room
          </button>
        </div>

        {/* Tab contents panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main feeds */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* FEED TAB */}
            {activeTab === "feed" && (
              <div className="space-y-6">
                {/* Create post box */}
                <form onSubmit={handlePostSubmit} className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
                  <h3 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
                    Speak to the Backstage
                  </h3>
                  <textarea
                    required
                    rows={3}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share casting updates, production journals, or screenplay snippets..."
                    className="w-full text-xs pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text placeholder-white/30 focus:outline-none focus:border-oldverse-accent transition-colors resize-none"
                  />
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={postImageUrl}
                      onChange={(e) => setPostImageUrl(e.target.value)}
                      placeholder="Attach image URL (Optional)..."
                      className="flex-grow text-xs pl-3 pr-3 py-1.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text placeholder-white/20 focus:outline-none"
                    />
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value as any)}
                      className="text-xs pl-3 pr-3 py-1.5 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text"
                    >
                      <option value="discussion">Discussion</option>
                      <option value="behind-the-scenes">Behind the scenes</option>
                      <option value="writing-room">Screenplay Idea</option>
                    </select>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs uppercase"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Post
                    </button>
                  </div>
                </form>

                {/* Posts List */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="glassmorphism-card rounded-xl p-5 space-y-4 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={post.creatorAvatar}
                          alt={post.creatorName}
                          className="h-9 w-9 rounded-full object-cover border border-white/5"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-grotesk text-sm font-bold text-oldverse-text">
                              {post.creatorName}
                            </h4>
                            {post.isVerified && (
                              <div className="p-0.5 bg-oldverse-accent rounded-full border border-oldverse-bg flex items-center justify-center">
                                <Check className="h-2.5 w-2.5 text-oldverse-bg stroke-[4]" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-oldverse-secondary font-light">
                            {post.timestamp}
                          </span>
                        </div>
                        <span className="ml-auto text-[9px] uppercase font-grotesk font-bold bg-white/5 px-2 py-0.5 border border-white/5 text-oldverse-accent rounded-full">
                          {post.category}
                        </span>
                      </div>

                      <p className="text-sm font-light text-oldverse-text/95 leading-relaxed font-sans">
                        {post.content}
                      </p>

                      {post.imageUrl && (
                        <div className="rounded-lg overflow-hidden border border-white/5 aspect-video relative max-h-72">
                          <img
                            src={post.imageUrl}
                            alt="Post Asset"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-oldverse-secondary pt-2 border-t border-white/5">
                        <button className="flex items-center gap-1 hover:text-oldverse-accent transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes} Likes</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-oldverse-accent transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.commentsCount} Comments</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CASTING TAB */}
            {activeTab === "casting" && (
              <div className="space-y-4">
                {castingCalls.map((job) => {
                  const hasApplied = appliedJobs[job.id];
                  return (
                    <div
                      key={job.id}
                      className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4 hover:border-oldverse-accent/25 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={job.creatorAvatar}
                          alt={job.creatorName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-grotesk text-xs text-oldverse-secondary font-medium">
                            Posted by {job.creatorName}
                          </h4>
                          <span className="text-[10px] text-oldverse-secondary/60">
                            {job.datePosted}
                          </span>
                        </div>
                        <span className="ml-auto text-[9px] uppercase font-grotesk font-bold bg-oldverse-accent/10 border border-oldverse-accent/20 px-2 py-0.5 text-oldverse-accent rounded">
                          {job.type}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-grotesk text-base font-bold text-oldverse-text">
                          {job.title}
                        </h3>
                        <p className="text-[10px] uppercase font-grotesk font-bold text-oldverse-accent tracking-wider">
                          Project: {job.project}
                        </p>
                        <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <h5 className="font-grotesk text-[10px] uppercase font-bold text-oldverse-text">Requirements</h5>
                        <ul className="text-xs text-oldverse-secondary font-light space-y-1 list-disc pl-4">
                          {job.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-xs text-oldverse-secondary font-light">📍 {job.location}</span>
                        {hasApplied ? (
                          <span className="flex items-center gap-1.5 text-xs text-oldverse-success font-semibold px-4 py-1.5 rounded-full border border-oldverse-success/20 bg-oldverse-success/5">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => setActiveApplication(job)}
                            className="px-4 py-1.5 rounded-full bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs uppercase transition-colors"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* WRITING ROOM TAB */}
            {activeTab === "writing" && (
              <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bebas text-xl sm:text-2xl tracking-wider text-oldverse-text uppercase">
                    The Scriptwriting Room
                  </h3>
                  <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                    Visual script formatting guidelines and live collaboration boards. Drop your pitch or logline and let the collective polish it.
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-white/3 border border-white/5 space-y-3 font-mono text-xs text-oldverse-secondary">
                    <p className="text-oldverse-text font-bold">EXT. SECTOR 7 - DUST SHIELD - DUSK</p>
                    <p className="pl-6 leading-relaxed">
                      KIRA (28) stands on the edge of the copper cliff. The dust shield hums above, flickering cyan. She clutches the seed jar.
                    </p>
                    <p className="text-center text-oldverse-text/90 font-bold uppercase w-32 mx-auto">KIRA</p>
                    <p className="text-center max-w-sm mx-auto leading-relaxed italic">
                      "If we do not cross tonight, there won't be a Sector 7 left to save tomorrow."
                    </p>
                  </div>
                  
                  <p className="text-xs text-oldverse-secondary font-light text-center">
                    Submit your screenplays in standard Courier format to get featured in the Original Incubator.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar widget columns */}
          <div className="space-y-6">
            {/* Film Festivals Widget */}
            <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Award className="h-4.5 w-4.5 text-oldverse-accent" />
                <h3 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
                  Festivals & Incubators
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-grotesk text-xs font-bold text-oldverse-text">
                    OldVerse Winter Showcase 2026
                  </h4>
                  <p className="text-[10px] text-oldverse-secondary font-light">
                    Submissions close: Oct 15, 2026. Focus: Cyberpunk Narratives.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-grotesk text-xs font-bold text-oldverse-text">
                    The Soundscape Grant
                  </h4>
                  <p className="text-[10px] text-oldverse-secondary font-light">
                    $10,000 for original audio design in documentaries. Opens tomorrow.
                  </p>
                </div>
              </div>
            </div>

            {/* Crew Recruitment Widget */}
            <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Film className="h-4.5 w-4.5 text-oldverse-accent" />
                <h3 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
                  Crew Recruitment
                </h3>
              </div>
              
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center text-oldverse-secondary">
                  <span>🎬 Assistant Director</span>
                  <span className="text-[10px] text-oldverse-accent font-semibold font-grotesk">2 Offers</span>
                </div>
                <div className="flex justify-between items-center text-oldverse-secondary">
                  <span>🎨 Production Designer</span>
                  <span className="text-[10px] text-oldverse-accent font-semibold font-grotesk">1 Offer</span>
                </div>
                <div className="flex justify-between items-center text-oldverse-secondary">
                  <span>🔊 Boom Operator</span>
                  <span className="text-[10px] text-oldverse-accent font-semibold font-grotesk">3 Offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audition application modal */}
      {activeApplication && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-oldverse-card border border-white/10 rounded-xl p-6 max-w-md w-full space-y-4 relative animate-fade-in">
            <h3 className="font-grotesk text-base font-bold text-oldverse-text">
              Audition for "{activeApplication.title}"
            </h3>
            
            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-grotesk font-semibold text-oldverse-secondary uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="font-grotesk font-semibold text-oldverse-secondary uppercase">Cover Note / Experience</label>
                <textarea
                  required
                  rows={3}
                  value={applicantBio}
                  onChange={(e) => setApplicantBio(e.target.value)}
                  placeholder="Briefly state your acting experience or links to showcase reels..."
                  className="w-full pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text focus:outline-none focus:border-oldverse-accent resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveApplication(null)}
                  className="px-4 py-2 rounded-full border border-white/10 text-oldverse-text hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold uppercase transition-colors"
                >
                  Submit Audition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
