"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star, Clock, Info, X, Plus, Check } from "lucide-react";
import { MediaItem } from "@/lib/mockData";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";

interface MovieCardProps {
  item: MediaItem;
}

function MovieCard({ item }: MovieCardProps) {
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
    // Check if max-width is 1024px (mobile/touch device)
    const isTouch = window.matchMedia("(max-width: 1024px)").matches;
    if (isTouch) {
      if (!isOverlayActive) {
        e.preventDefault();
        e.stopPropagation();
        setIsOverlayActive(true);
      }
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="flex-none w-36 sm:w-44 md:w-52 aspect-[2/3] relative group cursor-pointer bg-oldverse-card rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:z-30 hover:shadow-2xl"
    >
      {/* Poster Image Container */}
      <div className="w-full h-full rounded-lg overflow-hidden border border-white/5 relative">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Mobile active state indicator indicator dot */}
        {isOverlayActive && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-[10px] text-white font-bold bg-[#0066FF] px-2.5 py-1 rounded">Active Info</span>
          </div>
        )}
      </div>

      {/* Absolute Expanding Hover Dropdown */}
      <div className={`absolute top-[99%] left-0 w-full bg-[#141414] border border-white/10 border-t-0 rounded-b-lg p-3 z-30 shadow-2xl transition-all duration-300 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transform origin-top scale-y-95 group-hover:scale-y-100 space-y-2.5 ${
        isOverlayActive ? "opacity-100 pointer-events-auto scale-y-100" : ""
      }`}>
        {/* Row 1: Play, duration, plus, info icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {item.videoUrl?.includes("instagram.com") ? (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0066FF] hover:bg-[#0055DD] text-white px-3 py-1.5 rounded flex items-center gap-1 text-[10px] font-bold tracking-wide transition-colors"
              >
                <Play className="h-3 w-3 fill-current" />
                Play
              </a>
            ) : (
              <Link
                href={`/watch/${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0066FF] hover:bg-[#0055DD] text-white px-3 py-1.5 rounded flex items-center gap-1 text-[10px] font-bold tracking-wide transition-colors"
              >
                <Play className="h-3 w-3 fill-current" />
                Play
              </Link>
            )}
            
            <span className="text-[9px] text-white/50 font-medium ml-1">
              {item.duration || "2h 10m"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Watchlist Plus Button */}
            <button
              onClick={handleWatchlistToggle}
              className="w-6 h-6 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white cursor-pointer hover:bg-white/5 transition-colors"
              title="Watchlist"
            >
              {isInWatchlist ? <Check className="h-3.5 w-3.5 text-oldverse-accent" /> : <Plus className="h-3.5 w-3.5" />}
            </button>

            {/* More Info Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowInfo(true);
                setIsOverlayActive(false);
              }}
              className="w-6 h-6 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white cursor-pointer hover:bg-white/5 transition-colors"
              title="More Details"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Title */}
        <h4 className="text-[11px] font-bold text-white font-grotesk tracking-wide truncate">
          {item.title}
        </h4>

        {/* Row 3: Genres */}
        <p className="text-[9px] text-white/40 truncate">
          {item.category === "Music" ? "Music, Romance, Audio" : item.category === "Series" ? "Drama, Sci-Fi, Romance" : `${item.category}, Spotlight`}
        </p>

        {/* Row 4: Ratings & Star Rating Section */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="border border-white/20 px-1 py-0.5 rounded text-[8px] text-white/50 font-medium font-grotesk tracking-wide uppercase">
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
                  className={`h-2.5 w-2.5 ${
                    star <= (ratingHover || userRating)
                      ? "text-oldverse-accent fill-oldverse-accent"
                      : "text-white/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Details Overlay Panel */}
      {showInfo && (
        <div className="absolute inset-0 bg-black/95 z-40 p-4 flex flex-col justify-between animate-fade-in font-sans rounded-lg">
          <div className="space-y-3 flex-grow overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-white/5 pb-1">
              <span className="text-[10px] uppercase font-grotesk font-semibold text-oldverse-accent">
                {item.category}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInfo(false);
                }}
                className="p-1 rounded text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h4 className="font-grotesk text-sm font-bold text-oldverse-text">
              {item.title}
            </h4>

            <p className="text-[11px] font-light text-oldverse-secondary leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="pt-2 border-t border-white/5">
            {item.videoUrl?.includes("instagram.com") ? (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-center gap-1 py-1.5 rounded bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg text-xs font-bold transition-all duration-300"
              >
                <Play className="h-3 w-3 fill-oldverse-bg" />
                Play Video
              </a>
            ) : (
              <Link
                href={`/watch/${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-center gap-1 py-1.5 rounded bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg text-xs font-bold transition-all duration-300"
              >
                <Play className="h-3 w-3 fill-oldverse-bg" />
                Play Video
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar for continue watching */}
      {item.continueWatchingProgress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-20">
          <div
            className="h-full bg-oldverse-accent"
            style={{ width: `${item.continueWatchingProgress}%` }}
          />
        </div>
      )}
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

  const checkScrollLimits = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 5);
      // Math.ceil is used to prevent rounding discrepancies
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

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
          className="flex gap-4 overflow-x-auto overflow-y-visible no-scrollbar pt-4 pb-28 -mb-24 px-1 scroll-smooth"
        >
          {items.map((item) => (
            <MovieCard key={item.id} item={item} />
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
