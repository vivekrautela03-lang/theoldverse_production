"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star, Clock, Info, X, Plus, Check } from "lucide-react";
import { MediaItem } from "@/lib/mockData";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";

interface MovieCardProps {
  item: MediaItem;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

function MovieCard({ item, isActive, onActivate, onDeactivate }: MovieCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingHover, setRatingHover] = useState<number>(0);

  // Sync watchlist & user rating on mount
  useEffect(() => {
    setIsInWatchlist(getStoreData.watchlistIds().includes(item.id));
    const savedRating = localStorage.getItem(`oldverse_user_rating_${item.id}`);
    if (savedRating) {
      setUserRating(Number(savedRating));
    }
  }, [item.id]);

  // Listen to store updates to keep watchlist sync
  useEffect(() => {
    const handleUpdate = () => {
      setIsInWatchlist(getStoreData.watchlistIds().includes(item.id));
    };
    window.addEventListener("oldverse_store_update", handleUpdate);
    return () => window.removeEventListener("oldverse_store_update", handleUpdate);
  }, [item.id]);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextVal = mutateStore.toggleWatchlist(item.id);
    setIsInWatchlist(nextVal);
  };

  const handleRate = (stars: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUserRating(stars);
    localStorage.setItem(`oldverse_user_rating_${item.id}`, String(stars));
    alert(`Thank you! You rated "${item.title}" ${stars} stars.`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isTouch = window.matchMedia("(max-width: 1024px)").matches;
    if (isTouch) {
      if (!isActive) {
        e.preventDefault();
        onActivate();
      } else {
        onDeactivate();
      }
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] relative group cursor-pointer bg-oldverse-card rounded-lg"
    >
      {/* 1. Base Poster Card (scales down slightly when group is hovered to draw focus to expanding card) */}
      <div className="w-full h-full rounded-lg overflow-hidden border border-white/5 relative transition-all duration-300 group-hover:opacity-30">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {item.continueWatchingProgress !== undefined && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-10">
            <div
              className="h-full bg-oldverse-accent"
              style={{ width: `${item.continueWatchingProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* 2. Netflix-style Landscape Expanding Hover Overlay Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[300px] md:w-[340px] bg-[#141414] rounded-xl shadow-2xl z-50 border border-white/10 overflow-hidden transition-all duration-300 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 space-y-0 ${
          isActive ? "opacity-100 pointer-events-auto scale-100" : ""
        }`}
      >
        {/* Banner image top half with blur-contain backdrop */}
        <div className="relative h-[110px] sm:h-[140px] md:h-[160px] w-full overflow-hidden bg-black flex items-center justify-center">
          {/* Blurred poster background to fill landscape box */}
          <img
            src={item.posterUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-40 scale-110"
            loading="lazy"
          />
          {/* Centered clean banner/poster with original aspect ratio */}
          <img
            src={item.bannerUrl || item.posterUrl}
            alt={item.title}
            className="relative h-full object-contain z-10"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-20" />
          
          <span className="absolute bottom-2 left-3 bg-black/60 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] text-white/80 font-bold uppercase font-grotesk tracking-wide border border-white/10 z-20">
            {item.isOriginal ? "Original" : "Spotlight"}
          </span>
        </div>

        {/* Details bottom half */}
        <div className="p-3 sm:p-4 bg-[#141414]">
          {showInfo ? (
            /* Detailed Info Slide inside the expanding box */
            <div className="space-y-2.5 animate-fade-in text-xs font-sans">
              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-[10px] uppercase font-grotesk font-semibold text-[#F5A623]">
                  {item.category} Details
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowInfo(false);
                  }}
                  className="p-1 rounded text-white/50 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                  title="Show Main Options"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[10px] sm:text-[11px] font-light text-white/80 leading-relaxed max-h-[75px] overflow-y-auto no-scrollbar">
                {item.description}
              </p>
              <div className="flex justify-between items-center text-[9px] text-white/40 pt-1 border-t border-white/5 font-grotesk">
                <span>Cast: {item.cast?.slice(0, 2).join(", ") || "Crew"}</span>
                <span>Release: {item.releaseDate || "2026"}</span>
              </div>
            </div>
          ) : (
            /* Standard Controls / Options Row */
            <div className="space-y-3">
              {/* Row 1: Orange Play button, duration, Watchlist, Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.videoUrl?.includes("instagram.com") ? (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#F5A623] hover:bg-[#FF8C32] text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 text-[10px] sm:text-xs font-bold font-grotesk tracking-wider uppercase transition-all shadow-md active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Play
                    </a>
                  ) : (
                    <Link
                      href={`/watch/${item.id}`}
                      className="bg-[#F5A623] hover:bg-[#FF8C32] text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 text-[10px] sm:text-xs font-bold font-grotesk tracking-wider uppercase transition-all shadow-md active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Play
                    </Link>
                  )}
                  
                  <span className="text-[10px] sm:text-xs text-white/60 font-semibold tracking-wide ml-1">
                    {item.duration || "1 Season"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Watchlist Plus Button */}
                  <button
                    onClick={handleWatchlistToggle}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white cursor-pointer hover:bg-white/5 transition-colors"
                    title="Watchlist"
                  >
                    {isInWatchlist ? <Check className="h-4 w-4 text-[#F5A623]" /> : <Plus className="h-4 w-4" />}
                  </button>

                  {/* More Info Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowInfo(true);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white cursor-pointer hover:bg-white/5 transition-colors"
                    title="More Details"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: Title */}
              <h4 className="text-xs sm:text-sm font-bold text-white font-grotesk tracking-wide truncate">
                {item.title}
              </h4>

              {/* Row 3: Genres */}
              <p className="text-[10px] sm:text-xs text-white/50 truncate">
                {item.category === "Music" ? "Music, Romance, Audio" : item.category === "Series" ? "Drama, Sci-Fi, Romance" : `${item.category}, Spotlight`}
              </p>

              {/* Row 4: Age Badge & Interactive Rating Stars */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="border border-white/20 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] text-white/50 font-bold font-grotesk tracking-wider uppercase">
                  {item.isOriginal ? "U/A 13+" : "U/A 16+"}
                </span>

                {/* Interactive Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={(e) => handleRate(star, e)}
                      onMouseEnter={() => setRatingHover(star)}
                      onMouseLeave={() => setRatingHover(0)}
                      className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-3 w-3 ${
                          star <= (ratingHover || userRating)
                            ? "text-[#F5A623] fill-[#F5A623]"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MovieRowProps {
  title: string;
  items: MediaItem[];
  subtitle?: string;
}

export default function MovieRow({ title, items, subtitle }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const checkScrollLimits = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 5);
      // Math.ceil is used to prevent rounding discrepancies
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
      
      // Auto close popovers when row is scrolled/swiped
      setActiveCardId(null);
    }
  };

  // Close active card when vertical page scroll occurs
  useEffect(() => {
    const handlePageScroll = () => {
      setActiveCardId(null);
    };
    window.addEventListener("scroll", handlePageScroll, { passive: true });
    return () => window.removeEventListener("scroll", handlePageScroll);
  }, []);

  // Close active card when tapping outside anywhere
  useEffect(() => {
    if (!activeCardId) return;
    const handleOutsideClick = () => {
      setActiveCardId(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [activeCardId]);

  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      row.addEventListener("scroll", checkScrollLimits);
      // Run once initially
      checkScrollLimits();

      // Also listen to window resize
      window.addEventListener("resize", checkScrollLimits);
    }
    return () => {
      if (row) row.removeEventListener("scroll", checkScrollLimits);
      window.removeEventListener("resize", checkScrollLimits);
    };
  }, [items]);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative space-y-3 px-4 sm:px-6 lg:px-8 py-4 group/row">
      <div className="flex flex-col">
        <h3 className="font-bebas text-2xl tracking-wider text-oldverse-text">
          {title}
        </h3>
        {subtitle && (
          <p className="font-grotesk text-xs text-oldverse-secondary font-medium tracking-wide">
            {subtitle}
          </p>
        )}
      </div>

      {/* Row Wrapper */}
      <div className="relative">
        {/* Left Scroll Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-oldverse-bg to-transparent flex items-center justify-start text-white/50 hover:text-oldverse-accent opacity-0 group-hover/row:opacity-100 transition-all duration-300 cursor-pointer"
            aria-label="Scroll Left"
          >
            <div className="p-1 rounded-full bg-oldverse-card/60 backdrop-blur-md border border-white/5 shadow-lg ml-1 hover:scale-110 transition-transform">
              <ChevronLeft className="h-6 w-6" />
            </div>
          </button>
        )}

        {/* Horizontal scroll container */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto overflow-y-visible no-scrollbar pt-6 pb-20 -mb-16 px-1 scroll-smooth"
        >
          {items.map((item) => (
            <MovieCard 
              key={item.id} 
              item={item} 
              isActive={activeCardId === item.id}
              onActivate={() => setActiveCardId(item.id)}
              onDeactivate={() => setActiveCardId(null)}
            />
          ))}
        </div>

        {/* Right Scroll Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-l from-oldverse-bg to-transparent flex items-center justify-end text-white/50 hover:text-oldverse-accent opacity-0 group-hover/row:opacity-100 transition-all duration-300 cursor-pointer"
            aria-label="Scroll Right"
          >
            <div className="p-1 rounded-full bg-oldverse-card/60 backdrop-blur-md border border-white/5 shadow-lg mr-1 hover:scale-110 transition-transform">
              <ChevronRight className="h-6 w-6" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
