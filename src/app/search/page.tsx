"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Film, User, Star, Clock, Sparkles } from "lucide-react";
import { getStoreData } from "@/lib/supabaseStore";
import { MediaItem, Creator } from "@/lib/mockData";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "shows" | "creators" | "bts">("all");
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [allCreators, setAllCreators] = useState<Creator[]>([]);
  const [isClient, setIsClient] = useState(false);

  const loadSearchData = () => {
    setAllMedia(getStoreData.media());
    setAllCreators(getStoreData.creators());
  };

  useEffect(() => {
    setIsClient(true);
    loadSearchData();

    window.addEventListener("oldverse_store_update", loadSearchData);
    return () => window.removeEventListener("oldverse_store_update", loadSearchData);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Live filter query logic
  const queryNormalized = searchQuery.toLowerCase().trim();

  const filteredMedia = allMedia.filter((item) => {
    // Basic match
    const matchesQuery =
      item.title.toLowerCase().includes(queryNormalized) ||
      item.category.toLowerCase().includes(queryNormalized) ||
      item.creatorName.toLowerCase().includes(queryNormalized) ||
      item.description.toLowerCase().includes(queryNormalized);

    if (!matchesQuery) return false;

    // Filter by type
    if (activeFilter === "shows") return item.type === "movie" || item.type === "series" || item.type === "original";
    if (activeFilter === "bts") return item.type === "bts";
    return true; // "all"
  });

  const filteredCreators = activeFilter === "all" || activeFilter === "creators"
    ? allCreators.filter((c) =>
        c.name.toLowerCase().includes(queryNormalized) ||
        c.username.toLowerCase().includes(queryNormalized) ||
        c.bio.toLowerCase().includes(queryNormalized)
      )
    : [];

  const hasResults = filteredMedia.length > 0 || filteredCreators.length > 0;

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Header Input bar */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-6 w-6 text-oldverse-secondary pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search movies, series, creators, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-xl bg-oldverse-card border border-white/5 text-lg font-grotesk tracking-wide text-oldverse-text placeholder-white/30 focus:outline-none focus:border-oldverse-accent focus:ring-1 focus:ring-oldverse-accent transition-all duration-300 shadow-2xl"
            />
          </div>

          {/* Filtering badges */}
          <div className="flex flex-wrap gap-2 text-xs font-grotesk font-semibold uppercase tracking-wider justify-center sm:justify-start">
            {[
              { id: "all", label: "All Archives" },
              { id: "shows", label: "Films & Shows" },
              { id: "creators", label: "Creators" },
              { id: "bts", label: "Behind The Scenes" }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-4 py-1.5 rounded-full border transition-all ${
                  activeFilter === filter.id
                    ? "bg-oldverse-accent border-oldverse-accent text-oldverse-bg"
                    : "border-white/5 text-oldverse-secondary bg-white/3 hover:bg-white/5 hover:text-oldverse-text"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Display Grid */}
        <div className="space-y-10">
          {searchQuery && !hasResults ? (
            <div className="text-center py-20 space-y-3">
              <Film className="h-12 w-12 text-oldverse-secondary/20 mx-auto" />
              <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                No Entries Found
              </h3>
              <p className="text-xs text-oldverse-secondary font-light">
                Try searching for something else, like 'Vance', 'Wasteland', 'Drama', or 'monsoon'.
              </p>
            </div>
          ) : (
            <>
              {/* Creators Results */}
              {filteredCreators.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bebas text-xl sm:text-2xl tracking-wider text-oldverse-text uppercase">
                    Matching Creators ({filteredCreators.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredCreators.map((creator) => (
                      <Link
                        key={creator.id}
                        href={`/creator/${creator.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/25 transition-all group"
                      >
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="h-12 w-12 rounded-full object-cover border border-white/5"
                        />
                        <div className="min-w-0 flex-grow">
                          <h4 className="font-grotesk text-sm font-bold text-oldverse-text group-hover:text-oldverse-accent transition-colors truncate">
                            {creator.name}
                          </h4>
                          <p className="text-[10px] text-oldverse-secondary truncate">@{creator.username}</p>
                        </div>
                        <span className="text-[9px] uppercase font-bebas text-oldverse-accent-secondary border border-oldverse-accent-secondary/20 px-2 py-0.5 rounded bg-oldverse-accent-secondary/5 flex-none">
                          View Stage
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Films / Series Results */}
              {filteredMedia.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="font-bebas text-xl sm:text-2xl tracking-wider text-oldverse-text uppercase">
                    Films & Series ({filteredMedia.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMedia.map((show) => {
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
                </div>
              )}
            </>
          )}
        </div>

        {/* Suggestion tags if idle */}
        {!searchQuery && (
          <div className="max-w-xl mx-auto text-center space-y-4 pt-16">
            <Sparkles className="h-8 w-8 text-oldverse-accent/40 mx-auto" />
            <h4 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-secondary">
              Search Recommendations
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Wasteland", "Action", "Elena", "monsoon", "Cyberpunk", "Documentary", "Vance"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3.5 py-1.5 rounded-lg border border-white/5 bg-white/3 hover:bg-white/5 text-xs text-oldverse-secondary hover:text-oldverse-text transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
