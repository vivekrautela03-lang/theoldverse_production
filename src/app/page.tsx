"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, Info, Star, Plus, Check } from "lucide-react";
import MovieRow from "@/components/MovieRow";
import AuthPortal from "@/components/AuthPortal";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { MediaItem, Creator } from "@/lib/mockData";

export default function HomePage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [slides, setSlides] = useState<MediaItem[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [featuredItem, setFeaturedItem] = useState<MediaItem | null>(null);
  const [isFollowingCreator, setIsFollowingCreator] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch from local storage store
  const loadData = () => {
    const allMedia = getStoreData.media();
    const allCreators = getStoreData.creators();
    setMediaItems(allMedia);
    setCreators(allCreators);

    // Check login state
    const user = localStorage.getItem("oldverse_user");
    setIsLoggedIn(!!user);

    // Get items flagged specifically for the hero slideshow
    const featuredSlides = allMedia.filter(item => item.isHeroSlide === true);
    setSlides(featuredSlides);

    const current = featuredSlides[0] || allMedia[0];
    setFeaturedItem(current || null);

    if (current) {
      const followed = getStoreData.followedIds();
      setIsFollowingCreator(followed.includes(current.creatorId));
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadData();

    // Listen to local store mutations
    window.addEventListener("oldverse_store_update", loadData);
    return () => window.removeEventListener("oldverse_store_update", loadData);
  }, []);

  // Set up auto-slide carousel rotation (every 6 seconds)
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides]);

  // Sync featuredItem when currentSlideIndex changes
  useEffect(() => {
    if (slides.length > 0) {
      const current = slides[currentSlideIndex];
      if (current) {
        setFeaturedItem(current);
        const followed = getStoreData.followedIds();
        setIsFollowingCreator(followed.includes(current.creatorId));
      }
    }
  }, [currentSlideIndex, slides]);

  const handleSlideSelect = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const handleFollowToggle = () => {
    if (featuredItem) {
      const isNowFollowing = mutateStore.followCreator(featuredItem.creatorId);
      setIsFollowingCreator(isNowFollowing);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin mx-auto"></div>
          <p className="text-oldverse-secondary text-sm font-grotesk tracking-widest uppercase">Opening Gates...</p>
        </div>
      </div>
    );
  }


  if (!featuredItem) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin mx-auto"></div>
          <p className="text-oldverse-secondary text-sm font-grotesk tracking-widest uppercase">Opening Gates...</p>
        </div>
      </div>
    );
  }

  // Filter media items into categories
  const continueWatching = mediaItems.filter(item => item.continueWatchingProgress !== undefined);
  const trending = mediaItems.filter(item => item.isTrending);
  const originals = mediaItems.filter(item => item.isOriginal);
  const movies = mediaItems.filter(item => item.type === "movie");
  const documentaries = mediaItems.filter(item => item.category === "Documentary");
  const behindTheScenes = mediaItems.filter(item => item.type === "bts");
  const comingSoon = mediaItems.filter(item => item.releaseDate === "Coming Soon");

  return (
    <div className="bg-oldverse-bg min-h-screen pb-16 relative">
      {/* 1. Cinematic Autoplay Carousel Slide */}
      <section className="relative h-[85vh] sm:h-[90vh] md:h-screen w-full overflow-hidden flex items-end">
        {/* Animated Background Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredItem.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            {featuredItem.id.startsWith("media-love") || featuredItem.isHeroSlide ? (
              <img
                src={featuredItem.bannerUrl}
                alt={featuredItem.title}
                className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.05]"
              />
            ) : (
              <video
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.05]"
                src={featuredItem.videoUrl}
                poster={featuredItem.bannerUrl}
              />
            )}
            {/* Black radial vignette gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-oldverse-bg via-transparent to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-oldverse-bg/85 via-transparent to-transparent z-10" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10 sm:pb-16 md:pb-20 relative z-20">
          <div className="max-w-2xl space-y-4">
            
            {/* Slide Pagination Dots */}
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlideSelect(idx)}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlideIndex === idx ? "w-6 bg-oldverse-accent" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Slide Details with transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredItem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Tag / Category */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest bg-oldverse-accent text-oldverse-bg font-bold font-grotesk px-3 py-1 rounded-full">
                    {featuredItem.isOriginal ? "Original" : "Spotlight"}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-oldverse-accent font-semibold">
                    <Star className="h-4 w-4 fill-oldverse-accent" />
                    <span>{featuredItem.rating} Rating</span>
                  </div>
                </div>

                {/* Title */}
                {featuredItem.id.startsWith("media-love") ? (
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs font-grotesk font-bold tracking-widest text-oldverse-accent uppercase">
                      Now Screening / Music Clip
                    </span>
                    <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-oldverse-text uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {featuredItem.title}
                    </h3>
                  </div>
                ) : (
                  <h2 className="font-bebas text-4xl sm:text-5xl md:text-7xl tracking-wider text-oldverse-text leading-none uppercase filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    {featuredItem.title}
                  </h2>
                )}

                {/* Synopsis */}
                <p className="text-oldverse-secondary text-xs sm:text-sm font-light leading-relaxed max-w-xl filter drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)] line-clamp-3">
                  {featuredItem.description}
                </p>

                {/* Creator Credit */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-oldverse-secondary font-grotesk uppercase tracking-wider">Created By</span>
                  <Link 
                    href={`/creator/${featuredItem.creatorId}`}
                    className="text-xs font-grotesk font-bold text-oldverse-text hover:text-oldverse-accent transition-colors"
                  >
                    {featuredItem.creatorName}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/watch/${featuredItem.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs tracking-wider uppercase shadow-lg shadow-oldverse-accent/20 transition-all duration-300 hover:scale-105"
              >
                <Play className="h-4 w-4 fill-oldverse-bg" />
                Play Show
              </Link>

              <button
                onClick={handleFollowToggle}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-oldverse-text font-grotesk font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105"
              >
                {isFollowingCreator ? (
                  <>
                    <Check className="h-4 w-4 text-oldverse-success" />
                    Following
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Follow
                  </>
                )}
              </button>

              <Link
                href={`/watch/${featuredItem.id}#description`}
                className="p-2.5 rounded-full border border-white/15 bg-oldverse-card/60 backdrop-blur-md text-oldverse-text hover:text-oldverse-accent hover:border-oldverse-accent/30 transition-colors"
                title="Details"
              >
                <Info className="h-4 w-4" />
              </Link>

              {/* Mute toggle button (only for videos) */}
              {!featuredItem.id.startsWith("media-love") && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-full border border-white/15 bg-oldverse-card/60 backdrop-blur-md text-oldverse-text hover:text-oldverse-accent hover:border-oldverse-accent/30 transition-colors"
                  aria-label="Toggle Sound"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. Media Rows Container */}
      <section className="relative z-20 space-y-4 md:space-y-8 -mt-4 sm:-mt-6 md:-mt-8">
        {/* Row 2: Trending This Week */}
        <MovieRow title="Trending This Week" items={trending} />

        {/* Section 1: Craft / What We Do */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4 w-full">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block">Craft</span>
            <h2 className="font-bebas text-4xl sm:text-5xl text-oldverse-text tracking-wider uppercase">What We Do</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-oldverse-secondary uppercase tracking-widest block">Signature Service</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wide uppercase">Film Production</h3>
            </div>
            <p className="text-sm font-light text-oldverse-secondary max-w-xl md:text-right">
              We bring stories to life through short films, cinematic reels, web series, and music videos.
            </p>
          </div>
        </div>

        {/* Row 3: Coming Soon */}
        {comingSoon.length > 0 && (
          <MovieRow title="MUSIC VIDEOS" items={comingSoon} />
        )}



        {/* Row 4: Featured Originals */}
        <MovieRow title="Originals & Series" items={originals} />
      </section>
    </div>
  );
}
