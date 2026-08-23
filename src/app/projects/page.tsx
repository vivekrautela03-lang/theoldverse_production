"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, Film, Sparkles } from "lucide-react";
import { getStoreData, syncLiveProjects } from "@/lib/supabaseStore";
import { MediaItem } from "@/lib/mockData";
import { ProjectsGridSkeleton, PageSkeletonLayout } from "@/components/Skeletons";

const categories = [
  "All",
  "Originals",
  "Action",
  "Romance",
  "Drama",
  "Comedy",
  "Horror",
  "Documentary",
  "Animation",
  "Photography",
  "Travel",
  "Experimental",
  "Music",
  "Student Films"
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  const [activeCategory, setActiveCategory] = useState("All");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  const loadBrowseData = () => {
    setMediaItems(getStoreData.media());
  };

  useEffect(() => {
    setIsClient(true);
    loadBrowseData();
    syncLiveProjects();

    window.addEventListener("oldverse_store_update", loadBrowseData);
    return () => window.removeEventListener("oldverse_store_update", loadBrowseData);
  }, []);

  // Sync state with URL parameter if present
  useEffect(() => {
    if (catParam && categories.includes(catParam)) {
      setActiveCategory(catParam);
    }
  }, [catParam]);

  const filteredItems = activeCategory === "All"
    ? mediaItems
    : mediaItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-grotesk">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-oldverse-accent uppercase tracking-widest">
          <Sparkles className="h-4 w-4" />
          <span>PRODUCTION CATALOG</span>
        </div>
        <h1 className="font-bebas text-4xl sm:text-5xl tracking-wider text-oldverse-text uppercase">
          Explore Projects
        </h1>
        <p className="text-xs text-oldverse-secondary max-w-xl font-light">
          Browse original short films, trailers, feature productions, music videos, and independent creative works.
        </p>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                activeCategory === cat
                  ? "bg-oldverse-accent border-oldverse-accent text-oldverse-bg shadow-md shadow-oldverse-accent/15"
                  : "border-white/5 text-oldverse-secondary bg-white/3 hover:bg-white/5 hover:text-oldverse-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isClient ? (
          <ProjectsGridSkeleton count={8} />
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredItems.map((show) => {
              const isInsta = show.videoUrl?.includes("instagram.com");
              const cardContent = (
                <>
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <img
                      src={show.posterUrl}
                      alt={show.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-oldverse-accent">
                      <Star className="h-3 w-3 fill-oldverse-accent" />
                      {show.rating}
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[9px] uppercase font-grotesk font-semibold text-oldverse-accent tracking-wider block">
                      {show.category}
                    </span>
                    <h3 className="font-grotesk text-sm font-bold text-oldverse-text group-hover:text-oldverse-accent transition-colors line-clamp-1">
                      {show.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-oldverse-secondary">
                      <span>{show.duration}</span>
                      <span className="font-semibold text-oldverse-text/70">{show.creatorName}</span>
                    </div>
                  </div>
                </>
              );

              return isInsta ? (
                <a
                  key={show.id}
                  href={show.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-lg overflow-hidden border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/30 transition-all duration-300"
                >
                  {cardContent}
                </a>
              ) : (
                <Link
                  key={show.id}
                  href={`/watch/${show.id}`}
                  className="group flex flex-col rounded-lg overflow-hidden border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/30 transition-all duration-300"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 space-y-3">
            <Film className="h-12 w-12 text-oldverse-secondary/25 mx-auto" />
            <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
              Category Empty
            </h3>
            <p className="text-xs text-oldverse-secondary font-light">
              There are no published works under "{activeCategory}" yet.
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-4 inline-block px-5 py-2 rounded-full bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg text-xs font-bold font-grotesk uppercase"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<PageSkeletonLayout />}>
      <BrowseContent />
    </Suspense>
  );
}
