"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ARTICLES_REGISTRY, CATEGORIES, TAGS } from "@/data/resources";
import { BookOpen, Search, Folder, Tag as TagIcon, Clock, Calendar, ArrowRight } from "lucide-react";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter logic
  const filteredArticles = ARTICLES_REGISTRY.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true;

    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none cinematic-glow">
            FILM CAREER GUIDE
          </h1>
          <p className="text-oldverse-accent font-grotesk text-xs sm:text-sm uppercase tracking-widest font-semibold">
            YOUR ULTIMATE SEO KNOWLEDGE HUB FOR FILMMAKING & PRODUCTION SERVICES IN INDIA
          </p>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Search & Filters Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar Filters */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Search Input Box */}
            <div className="glassmorphism p-6 rounded-xl border border-white/5 space-y-4">
              <h3 className="font-bebas text-lg text-oldverse-text tracking-wider uppercase flex items-center gap-2">
                <Search className="h-4 w-4 text-oldverse-accent" /> Search Guide
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-oldverse-accent/50 transition-colors"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
              </div>
            </div>

            {/* Categories Filter list */}
            <div className="glassmorphism p-6 rounded-xl border border-white/5 space-y-4">
              <h3 className="font-bebas text-lg text-oldverse-text tracking-wider uppercase flex items-center gap-2">
                <Folder className="h-4 w-4 text-oldverse-accent" /> Categories
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`text-left text-sm py-2 px-3 rounded-lg transition-colors font-grotesk ${
                    selectedCategory === null
                      ? "bg-oldverse-accent text-oldverse-bg font-bold"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  All Categories ({ARTICLES_REGISTRY.length})
                </button>
                {Object.entries(CATEGORIES).map(([key, name]) => {
                  const count = ARTICLES_REGISTRY.filter(a => a.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`text-left text-sm py-2 px-3 rounded-lg transition-colors font-grotesk flex justify-between items-center ${
                        selectedCategory === key
                          ? "bg-oldverse-accent text-oldverse-bg font-bold"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{name}</span>
                      <span className="text-xs opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags cloud */}
            <div className="glassmorphism p-6 rounded-xl border border-white/5 space-y-4">
              <h3 className="font-bebas text-lg text-oldverse-text tracking-wider uppercase flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-oldverse-accent" /> Tags Cloud
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`text-xs py-1.5 px-3 rounded-full transition-colors font-grotesk border ${
                    selectedTag === null
                      ? "bg-oldverse-accent border-oldverse-accent text-oldverse-bg font-bold"
                      : "border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  All Tags
                </button>
                {TAGS.map((tag) => {
                  const count = ARTICLES_REGISTRY.filter(a => a.tags.includes(tag)).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-xs py-1.5 px-3 rounded-full transition-colors font-grotesk border flex items-center gap-1 ${
                        selectedTag === tag
                          ? "bg-oldverse-accent border-oldverse-accent text-oldverse-bg font-bold"
                          : "border-white/10 text-white/70 hover:bg-white/5"
                      }`}
                    >
                      {tag} <span className="opacity-50 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset CTA */}
            {(searchQuery || selectedCategory || selectedTag) && (
              <button
                onClick={handleResetFilters}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg text-sm font-grotesk transition-colors"
              >
                Clear All Filters
              </button>
            )}

          </div>

          {/* Right Column: Articles Grid List */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <p className="text-sm text-white/50 font-light">
                Showing <span className="text-oldverse-text font-medium">{filteredArticles.length}</span> articles
              </p>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.slug}
                    className="glassmorphism p-6 rounded-xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-white/10 transition-all duration-300 group"
                  >
                    <div className="space-y-3">
                      {/* Meta elements line */}
                      <div className="flex items-center gap-4 text-[10px] text-white/40 font-grotesk uppercase">
                        <span className="text-oldverse-accent font-semibold">
                          {CATEGORIES[article.category] || article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {article.readTime}
                        </span>
                      </div>

                      <h2 className="font-bebas text-xl sm:text-2xl text-oldverse-text tracking-wide group-hover:text-oldverse-accent transition-colors leading-tight">
                        <Link href={`/resources/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-3">
                        {article.metaDescription}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                        <Calendar className="h-3 w-3" /> {article.date}
                      </div>
                      <Link
                        href={`/resources/${article.slug}`}
                        className="text-xs text-oldverse-accent hover:text-white font-grotesk font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        Read Guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0c0c0c]/50 rounded-xl border border-white/5 space-y-4">
                <BookOpen className="h-12 w-12 text-white/20 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bebas text-xl text-white tracking-wider">No Guides Found</h3>
                  <p className="text-sm text-white/50 max-w-sm mx-auto font-light">
                    We couldn't find any articles matching your filters. Try resetting search query or categories.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="bg-oldverse-accent text-oldverse-bg py-2 px-5 rounded-lg text-xs font-grotesk font-bold uppercase tracking-wider transition-colors hover:bg-white"
                >
                  Reset Search
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
