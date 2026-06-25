"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Star, Clock, Calendar, Film, Heart, Sparkles, Send, Award } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import MovieRow from "@/components/MovieRow";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { MediaItem, Episode } from "@/lib/mockData";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [activePosterUrl, setActivePosterUrl] = useState("");
  const [activeEpisodeId, setActiveEpisodeId] = useState("");
  const [activeTab, setActiveTab] = useState<"about" | "episodes" | "gallery">("about");
  const [comments, setComments] = useState<{ author: string; avatar: string; text: string; date: string }[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  const loadMediaDetails = () => {
    const allMedia = getStoreData.media();
    const found = allMedia.find(item => item.id === id);
    if (found) {
      setMediaItem(found);
      
      // If it's a series and has episodes, default to the first episode
      if (found.type === "series" && found.episodes && found.episodes.length > 0) {
        const firstEp = found.episodes[0];
        setActiveVideoUrl(firstEp.videoUrl);
        setActivePosterUrl(firstEp.thumbnail);
        setActiveEpisodeId(firstEp.id);
        setActiveTab("episodes");
      } else {
        setActiveVideoUrl(found.videoUrl);
        setActivePosterUrl(found.bannerUrl);
        setActiveEpisodeId("");
        setActiveTab("about");
      }

      // Load comments
      const mediaComments = getStoreData.comments(found.id);
      setComments(mediaComments);

      // Load recommendations (exclude current, matching category)
      const matches = allMedia.filter(item => item.id !== found.id && item.category === found.category);
      setRecommendations(matches.length > 0 ? matches : allMedia.filter(item => item.id !== found.id));
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadMediaDetails();

    window.addEventListener("oldverse_store_update", loadMediaDetails);
    return () => window.removeEventListener("oldverse_store_update", loadMediaDetails);
  }, [id]);

  const selectEpisode = (ep: Episode) => {
    setActiveVideoUrl(ep.videoUrl);
    setActivePosterUrl(ep.thumbnail);
    setActiveEpisodeId(ep.id);
    // Scroll to player smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !mediaItem) return;

    mutateStore.addComment(mediaItem.id, "Visual Pioneer", newCommentText);
    setNewCommentText("");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!mediaItem) {
    return (
      <div className="min-h-screen bg-oldverse-bg pt-32 text-center space-y-4">
        <h2 className="font-bebas text-4xl text-oldverse-error">Show Not Found</h2>
        <p className="text-oldverse-secondary text-sm">The digital archives do not contain this entry.</p>
        <Link href="/" className="inline-block px-6 py-2.5 bg-oldverse-accent text-oldverse-bg font-grotesk font-bold rounded-full uppercase text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Custom Video Player Wrap */}
        <section className="w-full">
          <VideoPlayer src={activeVideoUrl} poster={activePosterUrl} />
        </section>

        {/* 2. Show Description & Action Bar */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              {/* Category, Rating, Date */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="uppercase font-grotesk font-bold bg-oldverse-accent/15 text-oldverse-accent border border-oldverse-accent/25 px-2.5 py-0.5 rounded-full">
                  {mediaItem.category}
                </span>
                {mediaItem.isOriginal && (
                  <span className="uppercase font-bebas tracking-wider text-oldverse-accent-secondary border border-oldverse-accent-secondary/30 px-2 py-0.5 rounded bg-oldverse-accent-secondary/5">
                    Original Series
                  </span>
                )}
                <div className="flex items-center gap-1 text-oldverse-accent font-semibold ml-2">
                  <Star className="h-4 w-4 fill-oldverse-accent" />
                  <span>{mediaItem.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-oldverse-secondary">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{mediaItem.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-oldverse-secondary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{mediaItem.releaseDate}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl text-oldverse-text tracking-wider uppercase leading-none">
                {mediaItem.title}
              </h1>

              {/* Creator details */}
              <div className="flex items-center gap-3 py-1.5 border-y border-white/5">
                <Link
                  href={`/creator/${mediaItem.creatorId}`}
                  className="flex items-center gap-2 hover:text-oldverse-accent transition-colors group"
                >
                  <span className="text-xs text-oldverse-secondary font-grotesk uppercase">Created By</span>
                  <span className="text-sm font-grotesk font-bold text-oldverse-text group-hover:text-oldverse-accent">
                    {mediaItem.creatorName}
                  </span>
                </Link>
              </div>
            </div>

            {/* Tabs System */}
            <div className="border-b border-white/5 flex gap-6 text-sm font-grotesk tracking-wide font-medium">
              <button
                onClick={() => setActiveTab("about")}
                className={`pb-3 transition-colors ${
                  activeTab === "about" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
                }`}
              >
                About & Cast
              </button>
              {mediaItem.type === "series" && mediaItem.episodes && (
                <button
                  onClick={() => setActiveTab("episodes")}
                  className={`pb-3 transition-colors ${
                    activeTab === "episodes" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
                  }`}
                >
                  Episodes ({mediaItem.episodes.length})
                </button>
              )}
              <button
                onClick={() => setActiveTab("gallery")}
                className={`pb-3 transition-colors ${
                  activeTab === "gallery" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
                }`}
              >
                Behind The Scenes
              </button>
            </div>

            {/* Tab content panels */}
            <div className="min-h-48">
              {activeTab === "about" && (
                <div className="space-y-6">
                  {/* Synopsis */}
                  <p id="description" className="text-oldverse-secondary font-light leading-relaxed text-sm sm:text-base">
                    {mediaItem.description}
                  </p>
                  
                  {/* Cast & Crew grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <h4 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">Cast</h4>
                      <ul className="space-y-1 text-sm text-oldverse-secondary font-light">
                        {mediaItem.cast.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">Crew</h4>
                      <ul className="space-y-1.5 text-sm text-oldverse-secondary font-light">
                        {mediaItem.crew.map((c, i) => (
                          <li key={i}>
                            <span className="font-bold text-oldverse-text/80">{c.role}: </span>
                            {c.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "episodes" && mediaItem.episodes && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mediaItem.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() => selectEpisode(ep)}
                      className={`flex flex-col rounded-lg overflow-hidden border cursor-pointer hover:border-oldverse-accent/30 transition-all duration-300 ${
                        activeEpisodeId === ep.id
                          ? "bg-oldverse-accent/5 border-oldverse-accent"
                          : "bg-oldverse-card/50 border-white/5"
                      }`}
                    >
                      <div className="aspect-video relative overflow-hidden group">
                        <img
                          src={ep.thumbnail}
                          alt={ep.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Film className="h-8 w-8 text-oldverse-accent" />
                        </div>
                        <span className="absolute bottom-2 right-2 text-[10px] font-grotesk font-semibold bg-black/75 px-2 py-0.5 rounded text-white">
                          {ep.duration}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="font-grotesk text-xs font-bold text-oldverse-accent tracking-wide">
                          Episode {ep.episodeNumber}
                        </h4>
                        <h5 className="font-grotesk text-sm font-bold text-oldverse-text line-clamp-1">
                          {ep.title}
                        </h5>
                        <p className="text-xs text-oldverse-secondary font-light line-clamp-2">
                          {ep.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaItem.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg overflow-hidden border border-white/5 relative group cursor-zoom-in"
                    >
                      <img
                        src={imgUrl}
                        alt="Gallery Scene"
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comments Panel */}
          <div className="glassmorphism rounded-xl border border-white/5 p-5 space-y-6 self-start">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Sparkles className="h-4.5 w-4.5 text-oldverse-accent" />
              <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                Director Notes & Discussions
              </h3>
            </div>

            {/* Input Form */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Join the discussion..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-grow text-xs pl-3 pr-3 py-2 bg-oldverse-card border border-white/10 rounded-lg text-oldverse-text placeholder-white/30 focus:outline-none focus:border-oldverse-accent transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg transition-colors duration-300"
                aria-label="Post Comment"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Comments Lists */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {comments.map((comment, index) => (
                <div key={index} className="flex gap-3 text-xs leading-normal animate-fade-in">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="h-7 w-7 rounded-full object-cover border border-white/5"
                  />
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-oldverse-text">{comment.author}</span>
                      <span className="text-[10px] text-oldverse-secondary font-light">{comment.date}</span>
                    </div>
                    <p className="text-oldverse-secondary font-light font-sans text-xs">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-oldverse-secondary/40 text-center py-6 font-light">Be the first to speak into the dark.</p>
              )}
            </div>
          </div>
        </section>

        {/* 3. Recommendations Row */}
        <section className="pt-8 border-t border-white/5">
          <MovieRow title="More Like This" items={recommendations} subtitle="Curated Selections from Similar Realms" />
        </section>
      </div>
    </div>
  );
}
