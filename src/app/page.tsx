"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, Info, Star, Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node) {
      node.muted = true;
      node.playsInline = true;
      node.setAttribute("playsinline", "true");
      node.setAttribute("muted", "true");
      node.load();
      
      const playPromise = node.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay blocked on mount. Setting up touch-to-play fallback:", err);
          
          // Fallback: Start playing on first touch/click interaction on mobile devices
          const forcePlay = () => {
            node.play().catch(() => {});
            document.removeEventListener("touchstart", forcePlay);
            document.removeEventListener("click", forcePlay);
          };
          document.addEventListener("touchstart", forcePlay, { passive: true });
          document.addEventListener("click", forcePlay, { passive: true });
        });
      }
    }
  }, []);

  // Fetch from local storage store
  const loadData = () => {
    const allMedia = getStoreData.media();
    const allCreators = getStoreData.creators();

    // Kids Mode filtering
    const isKidsMode = localStorage.getItem("oldverse_kids_mode") === "true";
    const filteredMedia = isKidsMode
      ? allMedia.filter(item => 
          !item.category.toLowerCase().includes("crime") && 
          !item.category.toLowerCase().includes("thriller") &&
          !item.description.toLowerCase().includes("mature") &&
          !item.description.toLowerCase().includes("violence")
        )
      : allMedia;

    setMediaItems(filteredMedia);
    setCreators(allCreators);

    // Check login state
    const user = localStorage.getItem("oldverse_user");
    setIsLoggedIn(!!user);

    // Get items flagged specifically for the hero slideshow
    const featuredSlides = filteredMedia.filter(item => item.isHeroSlide === true);
    setSlides(featuredSlides);

    const current = featuredSlides[0] || filteredMedia[0];
    setFeaturedItem(current || null);

    if (current) {
      const followed = getStoreData.followedIds();
      setIsFollowingCreator(followed.includes(current.creatorId));
      setIsInWatchlist(getStoreData.watchlistIds().includes(current.id));
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadData();

    // Listen to local store mutations
    window.addEventListener("oldverse_store_update", loadData);
    return () => window.removeEventListener("oldverse_store_update", loadData);
  }, []);

  // Set up auto-slide carousel rotation (every 6 seconds for static slides, waits for videos to end)
  useEffect(() => {
    if (slides.length === 0) return;

    // Check if the current featuredItem is a playable video slide
    const isPlayableVideo = featuredItem && featuredItem.videoUrl && (
      featuredItem.videoUrl.includes(".mp4") || 
      featuredItem.videoUrl.includes("cloudinary")
    );

    // If it's a playable video slide, do NOT use the 6-second automatic interval.
    // Instead, the slide transition will be triggered when the video ends (via onEnded).
    if (isPlayableVideo) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides, featuredItem]);

  // Sync featuredItem when currentSlideIndex changes
  useEffect(() => {
    if (slides.length > 0) {
      const item = slides[currentSlideIndex];
      setFeaturedItem(item || null);
      if (item) {
        setIsInWatchlist(getStoreData.watchlistIds().includes(item.id));
      }
    }
  }, [currentSlideIndex, slides]);

  const handleSlideSelect = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!featuredItem) return;
    const nextVal = mutateStore.toggleWatchlist(featuredItem.id);
    setIsInWatchlist(nextVal);
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
  
  // Originals & Series row items (The Light From Nowhere, Nishaan, Kirdar Aur Khat)
  const originals = mediaItems.filter(item => 
    item.id === "media-coming-1" || 
    item.id === "media-coming-2" ||
    item.id === "media-series-1"
  );
  
  // MUSIC VIDEOS row items (Destiny, Love 1, Love 2, and new clips)
  const comingSoon = mediaItems.filter(item => 
    item.id === "media-coming-3" || 
    item.id === "media-love-1" || 
    item.id === "media-love-2" ||
    item.id === "media-music-1" ||
    item.id === "media-music-2" ||
    item.id === "media-music-3" ||
    item.id === "media-music-4" ||
    item.id === "media-music-5" ||
    item.id === "media-music-6"
  );

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
            {featuredItem.videoUrl && (featuredItem.videoUrl.includes(".mp4") || featuredItem.videoUrl.includes("cloudinary")) ? (
              <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={() => {
                  setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
                }}
                className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.05]"
                src={featuredItem.videoUrl}
                poster={featuredItem.bannerUrl}
              />
            ) : (
              <img
                src={featuredItem.bannerUrl}
                alt={featuredItem.title}
                className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.05]"
              />
            )}
            {/* Black radial vignette gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-oldverse-bg via-transparent to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-oldverse-bg/85 via-transparent to-transparent z-10" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content Overlay (Image 2 style) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 sm:pb-16 md:pb-24 relative z-20 flex flex-col justify-end min-h-[50vh] sm:min-h-[60vh] md:min-h-[80vh]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 w-full">
            
            {/* Left Content Column */}
            <div className="max-w-2xl space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredItem.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3.5"
                >
                  {/* Languages | Genres Metadata */}
                  <p className="text-xs font-semibold text-oldverse-accent tracking-wide font-grotesk">
                    Hindi &bull; {featuredItem.category === "Music" ? "Music, Romance, Serene" : featuredItem.category === "Series" ? "Romance, Sci-Fi, Drama" : "Original, Spotlight"}
                  </p>

                  {/* Title */}
                  {featuredItem.id.startsWith("media-love") ? (
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-grotesk font-bold tracking-widest text-oldverse-accent uppercase">
                        Now Screening / Music Clip
                      </span>
                      <h3 className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-wide text-oldverse-text uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        {featuredItem.title}
                      </h3>
                    </div>
                  ) : (
                    <h2 className="font-bebas text-4xl sm:text-5xl md:text-7xl tracking-wider text-oldverse-text leading-none uppercase filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                      {featuredItem.title}
                    </h2>
                  )}

                  {/* Synopsis */}
                  <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed max-w-xl filter drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)] line-clamp-3">
                    {featuredItem.description}
                  </p>

                  {/* Creator Credit */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 font-grotesk uppercase tracking-wider">Created By</span>
                    <Link 
                      href={`/creator/${featuredItem.creatorId}`}
                      className="text-xs font-grotesk font-bold text-oldverse-text hover:text-oldverse-accent transition-colors"
                    >
                      Shivanshi & Vivek Rautela
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                {featuredItem.videoUrl?.includes("instagram.com") ? (
                  <a
                    href={featuredItem.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#F5A623] hover:bg-[#FF8C32] text-black font-grotesk font-bold text-sm tracking-wide transition-all shadow-lg hover:scale-102"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Play
                  </a>
                ) : (
                  <Link
                    href={`/watch/${featuredItem.id}`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#F5A623] hover:bg-[#FF8C32] text-black font-grotesk font-bold text-sm tracking-wide transition-all shadow-lg hover:scale-102"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Play
                  </Link>
                )}

                {featuredItem.videoUrl?.includes("instagram.com") ? (
                  <a
                    href={featuredItem.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/5 bg-white/10 hover:bg-white/15 text-white font-grotesk font-bold text-sm tracking-wide transition-all hover:scale-102"
                  >
                    <Info className="h-4 w-4" />
                    More Info
                  </a>
                ) : (
                  <Link
                    href={`/watch/${featuredItem.id}#description`}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/5 bg-white/10 hover:bg-white/15 text-white font-grotesk font-bold text-sm tracking-wide transition-all hover:scale-102"
                  >
                    <Info className="h-4 w-4" />
                    More Info
                  </Link>
                )}

                {/* Add to My List Button */}
                <button
                  onClick={handleWatchlistToggle}
                  className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white transition-colors text-sm font-semibold hover:scale-102 cursor-pointer"
                >
                  {isInWatchlist ? <Check className="h-4.5 w-4.5 text-oldverse-accent" /> : <Plus className="h-4.5 w-4.5" />}
                  <span>{isInWatchlist ? "In My List" : "Add to My List"}</span>
                </button>
              </div>
            </div>

            {/* Right Controls Column (Navigation Arrows & Mute) */}
            <div className="flex items-center self-end md:self-auto gap-2">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentSlideIndex((prevIdx) => (prevIdx - 1 + slides.length) % slides.length)}
                className="p-2.5 rounded-lg border border-white/5 bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer hover:scale-105"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Next Button */}
              <button
                onClick={() => setCurrentSlideIndex((prevIdx) => (prevIdx + 1) % slides.length)}
                className="p-2.5 rounded-lg border border-white/5 bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer hover:scale-105"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Mute Toggle Button */}
              {featuredItem.videoUrl && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-lg border border-white/5 bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer hover:scale-105 ml-2"
                  aria-label="Toggle Sound"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              )}
            </div>

          </div>

          {/* Centered Pagination Dots at the very bottom */}
          <div className="flex justify-center gap-1.5 pt-8 w-full">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSlideSelect(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlideIndex === idx ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Media Rows Container */}
      <section className="relative z-20 space-y-4 md:space-y-8 -mt-4 sm:-mt-6 md:-mt-8">
        {/* Row 2: Trending This Week */}
        <MovieRow title="Trending This Week" items={trending} />

        {/* Section 1: Craft / What We Do (With Scroll Animation) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="px-4 sm:px-6 lg:px-8 py-4 space-y-4 w-full"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block">Craft</span>
            <h2 className="font-bebas text-4xl sm:text-5xl text-oldverse-text tracking-wider uppercase">What We Do</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-oldverse-accent/20 transition-colors duration-300">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-oldverse-secondary uppercase tracking-widest block">Signature Service</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wide uppercase">Film Production</h3>
            </div>
            <p className="text-sm font-light text-oldverse-secondary max-w-xl md:text-right">
              We bring stories to life through short films, cinematic reels, web series, and music videos.
            </p>
          </div>
        </motion.div>

        {/* Row 3: Coming Soon */}
        {comingSoon.length > 0 && (
          <MovieRow title="MUSIC VIDEOS" items={comingSoon} />
        )}

        {/* Row 4: Originals & Series */}
        {originals.length > 0 && (
          <MovieRow title="Originals & Series" items={originals} />
        )}
      </section>
    </div>
  );
}
