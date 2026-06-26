"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star, Clock, Info } from "lucide-react";
import { MediaItem } from "@/lib/mockData";

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
          className="flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar py-4 px-1 scroll-smooth"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none w-44 sm:w-56 md:w-64 aspect-[2/3] relative rounded-lg overflow-hidden group cursor-pointer bg-oldverse-card border border-white/5 transition-all duration-500 ease-out hover:scale-[1.04] hover:z-10 hover:border-oldverse-accent/30 hover:shadow-2xl"
            >
              {/* Media Poster (Play Link) */}
              <Link
                href={item.videoUrl.includes("instagram.com") ? item.videoUrl : `/watch/${item.id}`}
                target={item.videoUrl.includes("instagram.com") ? "_blank" : undefined}
                rel={item.videoUrl.includes("instagram.com") ? "noopener noreferrer" : undefined}
                className="absolute inset-0 block h-full w-full z-0"
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </Link>

              {/* Black overlay at the bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

              {/* Hover overlay details */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:translate-y-4 md:group-hover:translate-y-0 translate-y-0 transition-transform duration-500 ease-out z-20">
                {/* Watch Button / Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-grotesk font-semibold bg-oldverse-accent/15 text-oldverse-accent border border-oldverse-accent/25 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  {item.isOriginal && (
                    <span className="text-[9px] uppercase font-bebas tracking-wider text-oldverse-accent-secondary bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      Original
                    </span>
                  )}
                </div>

                <h4 className="font-grotesk text-sm font-bold text-oldverse-text leading-snug line-clamp-2 mb-1 group-hover:text-oldverse-accent transition-colors duration-300">
                  {item.title}
                </h4>

                {/* Rating & Duration */}
                <div className="flex items-center gap-3 text-xs text-oldverse-secondary mb-3">
                  <div className="flex items-center gap-0.5 text-oldverse-accent">
                    <Star className="h-3 w-3 fill-oldverse-accent" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Quick actions (Play, Info) */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-75 z-30">
                  <Link
                    href={item.videoUrl.includes("instagram.com") ? item.videoUrl : `/watch/${item.id}`}
                    target={item.videoUrl.includes("instagram.com") ? "_blank" : undefined}
                    rel={item.videoUrl.includes("instagram.com") ? "noopener noreferrer" : undefined}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg text-xs font-bold transition-all duration-300"
                  >
                    <Play className="h-3 w-3 fill-oldverse-bg" />
                    Play
                  </Link>
                  <Link
                    href={`/watch/${item.id}#description`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-oldverse-text text-xs font-bold transition-all duration-300"
                  >
                    <Info className="h-3 w-3" />
                    Info
                  </Link>
                </div>
              </div>

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
