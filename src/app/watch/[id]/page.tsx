"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { Star, Clock, Calendar, Film, Heart, Sparkles, Send, Award, FileText, MessageSquare } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import MovieRow from "@/components/MovieRow";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { MediaItem, Episode, Review } from "@/lib/mockData";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [activePosterUrl, setActivePosterUrl] = useState("");
  const [activeEpisodeId, setActiveEpisodeId] = useState("");
  const [activeTab, setActiveTab] = useState<"about" | "episodes" | "reviews" | "gallery">("about");
  const [comments, setComments] = useState<{ author: string; avatar: string; text: string; date: string }[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Phase 3 States
  const [isScriptOpen, setIsScriptOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(4.5);
  const [reviewText, setReviewText] = useState("");
  
  const activeRef = useRef<HTMLDivElement>(null);

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
        if (activeTab === "about") {
          setActiveTab("episodes");
        }
      } else {
        setActiveVideoUrl(found.videoUrl);
        setActivePosterUrl(found.bannerUrl);
        setActiveEpisodeId("");
      }

      // Load comments
      const mediaComments = getStoreData.comments(found.id);
      setComments(mediaComments);

      // Load reviews
      const mediaReviews = getStoreData.reviews(found.id);
      setReviews(mediaReviews);

      // Load recommendations (exclude current, matching category)
      const matches = allMedia.filter(item => item.id !== found.id && item.category === found.category);
      setRecommendations(matches.length > 0 ? matches : allMedia.filter(item => item.id !== found.id));
    }
  };

  useEffect(() => {
    const allMedia = getStoreData.media();
    const found = allMedia.find(item => item.id === id);
    if (found && found.videoUrl.includes("instagram.com")) {
      window.location.href = found.videoUrl;
      return;
    }

    setIsClient(true);
    loadMediaDetails();

    window.addEventListener("oldverse_store_update", loadMediaDetails);
    return () => window.removeEventListener("oldverse_store_update", loadMediaDetails);
  }, [id, activeTab]);

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

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !mediaItem) return;

    mutateStore.addReview(mediaItem.id, "Visual Pioneer", userRating, reviewText);
    setReviewText("");
    setUserRating(4.5);
  };

  // Find active screenplay segment index
  const activeSegmentIndex = mediaItem?.screenplay
    ? mediaItem.screenplay.findIndex((s, idx) => {
        const next = mediaItem.screenplay![idx + 1];
        return currentTime >= s.time && (!next || currentTime < next.time);
      })
    : -1;

  // Auto-scroll script panel
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [activeSegmentIndex, isScriptOpen]);

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

  // Calculate review statistics
  const totalReviews = reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const rounded = Math.round(r.rating);
    if (rounded >= 1 && rounded <= 5) {
      distribution[rounded as 1 | 2 | 3 | 4 | 5]++;
    }
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 1; i <= 5; i++) {
      if (i <= full) {
        stars.push(<Star key={i} className="h-4 w-4 fill-oldverse-accent text-oldverse-accent" />);
      } else if (i === full + 1 && half) {
        stars.push(<Star key={i} className="h-4 w-4 text-oldverse-accent" style={{ fill: "url(#halfStar)" }} />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-white/10" />);
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      {/* SVG Gradient definitions for half stars */}
      <svg className="w-0 h-0 absolute pointer-events-none">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#F5A623" />
            <stop offset="50%" stopColor="#1C1C1E" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Custom Video Player & Script Side-Panel Layout */}
        <section className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${isScriptOpen && mediaItem.screenplay ? "lg:col-span-2" : "lg:col-span-3"} transition-all duration-500`}>
              <VideoPlayer 
                src={activeVideoUrl} 
                poster={activePosterUrl} 
                onTimeUpdate={setCurrentTime}
                hasScreenplay={!!mediaItem.screenplay}
                isScreenplayOpen={isScriptOpen}
                onToggleScreenplay={() => setIsScriptOpen(!isScriptOpen)}
              />
            </div>

            {isScriptOpen && mediaItem.screenplay && (
              <div className="bg-oldverse-card/50 border border-white/5 rounded-xl p-5 flex flex-col h-[400px] lg:h-auto overflow-hidden animate-slide-left">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/5">
                  <FileText className="h-4.5 w-4.5 text-oldverse-accent" />
                  <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                    Interactive Screenplay Sync
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3">
                  {mediaItem.screenplay.map((segment, idx) => {
                    const isActive = idx === activeSegmentIndex;
                    return (
                      <div
                        key={segment.id}
                        ref={isActive ? activeRef : null}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? "bg-oldverse-accent/15 border-l-4 border-oldverse-accent text-oldverse-text scale-[1.02] shadow"
                            : "opacity-30 text-oldverse-secondary hover:opacity-60"
                        }`}
                      >
                        {segment.character ? (
                          <div className="font-bold uppercase tracking-wider text-[10px] text-oldverse-accent mb-0.5">
                            {segment.character}
                          </div>
                        ) : (
                          <div className="text-[9px] uppercase tracking-widest text-oldverse-secondary/60 mb-0.5 font-bold">
                            Action
                          </div>
                        )}
                        <div className="font-mono text-xs leading-relaxed">
                          {segment.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 transition-colors ${
                  activeTab === "reviews" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
                }`}
              >
                Reviews & Ratings ({reviews.length})
              </button>
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
                <div className="space-y-6 animate-fade-in">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
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

              {activeTab === "reviews" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Star rating summary & Histogram */}
                    <div className="bg-oldverse-card/40 border border-white/5 rounded-xl p-5 space-y-4">
                      <div className="text-center space-y-1">
                        <span className="text-xs text-oldverse-secondary uppercase font-grotesk tracking-wider">Average Rating</span>
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bebas text-5xl text-oldverse-text">
                            {(parseFloat(mediaItem.rating) / 2).toFixed(1)}
                          </span>
                          <span className="text-oldverse-secondary text-sm">/ 5</span>
                        </div>
                        <div className="flex justify-center">
                          {renderStars(parseFloat(mediaItem.rating) / 2)}
                        </div>
                        <p className="text-[10px] text-oldverse-secondary font-light">Based on {totalReviews} reviews</p>
                      </div>

                      <div className="space-y-2 border-t border-white/5 pt-4">
                        {[5, 4, 3, 2, 1].map(stars => {
                          const count = distribution[stars as 1 | 2 | 3 | 4 | 5];
                          const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                          return (
                            <div key={stars} className="flex items-center gap-2 text-xs text-oldverse-secondary">
                              <span className="w-3 text-right">{stars}</span>
                              <Star className="h-3 w-3 fill-current text-oldverse-accent" />
                              <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-oldverse-accent transition-all duration-500" 
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                              <span className="w-6 text-right text-[10px]">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Write review form */}
                    <div className="md:col-span-2 bg-oldverse-card/20 border border-white/5 rounded-xl p-5 space-y-4">
                      <h4 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                        Log / Review this title
                      </h4>
                      <form onSubmit={handlePostReview} className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-oldverse-secondary font-medium">Your Rating:</span>
                            <span className="text-oldverse-accent font-bold font-mono">{userRating.toFixed(1)} Stars</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0.5"
                              max="5"
                              step="0.5"
                              value={userRating}
                              onChange={(e) => setUserRating(parseFloat(e.target.value))}
                              className="flex-grow h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-oldverse-accent"
                            />
                            <div className="w-24 flex justify-end">
                              {renderStars(userRating)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <textarea
                            placeholder="Write a Letterboxd-style review... What worked? How did the atmosphere feel?"
                            rows={3}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full text-xs p-3 bg-black/30 border border-white/10 rounded-lg text-oldverse-text placeholder-white/20 focus:outline-none focus:border-oldverse-accent transition-colors resize-none"
                            required
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold rounded-lg uppercase text-[11px] transition-colors"
                          >
                            Submit Review
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Reviews list */}
                  <div className="space-y-4 border-t border-white/5 pt-6">
                    <h4 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
                      Reviews from the community
                    </h4>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-oldverse-card/30 border border-white/5 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <img
                                src={review.avatar}
                                alt={review.author}
                                className="h-8 w-8 rounded-full object-cover border border-white/5"
                              />
                              <div>
                                <h5 className="text-xs font-bold text-oldverse-text">{review.author}</h5>
                                <p className="text-[10px] text-oldverse-secondary font-light">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {renderStars(review.rating)}
                              <span className="text-[9px] text-oldverse-secondary/60 font-mono">({review.rating.toFixed(1)}/5)</span>
                            </div>
                          </div>
                          <p className="text-xs text-oldverse-secondary leading-relaxed font-light font-sans">
                            {review.text}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-oldverse-secondary border-t border-white/5 pt-2">
                            <Heart className="h-3.5 w-3.5 text-oldverse-accent fill-current" />
                            <span>{review.likes} likes</span>
                          </div>
                        </div>
                      ))}
                      {reviews.length === 0 && (
                        <p className="text-xs text-oldverse-secondary/40 text-center py-8 font-light">
                          No reviews logged yet. Be the first to share your perspective!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
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

          {/* Right Column: Dynamic Director Notes & Discussion */}
          <div className="glassmorphism rounded-xl border border-white/5 p-5 space-y-6 self-start">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <MessageSquare className="h-4.5 w-4.5 text-oldverse-accent" />
              <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                Director Notes & Chat
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
