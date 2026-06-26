"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Check, Star, Video, Eye, Users, Film, Globe, Award, Image as ImageIcon, MessageSquare, Info, Heart } from "lucide-react";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { Creator, MediaItem, CommunityPost } from "@/lib/mockData";

export default function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [creatorMedia, setCreatorMedia] = useState<MediaItem[]>([]);
  const [creatorPosts, setCreatorPosts] = useState<CommunityPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"shows" | "photos" | "posts" | "about">("shows");
  const [isClient, setIsClient] = useState(false);

  // Mock photography portfolio images since photography creators showcase visual portfolios
  const mockPhotos = [
    { url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600", title: "Midnight Solitude", gear: "Leica M11 - 35mm f/1.4" },
    { url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600", title: "Steel & Light", gear: "Sony A7R V - 50mm f/1.2" },
    { url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600", title: "Cyan Nights", gear: "Fujifilm GFX 100S" },
    { url: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=600", title: "Grit & Gold", gear: "Leica M11 - 50mm f/1.4" },
    { url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600", title: "The Drift", gear: "Hasselblad X2D" },
    { url: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=600", title: "Ethereal Whispers", gear: "Sony A7R V - 85mm f/1.4" }
  ];

  const loadCreatorDetails = () => {
    const allCreators = getStoreData.creators();
    const allMedia = getStoreData.media();
    const allPosts = getStoreData.community();
    const followed = getStoreData.followedIds();

    const foundCreator = allCreators.find(c => c.id === id);
    if (foundCreator) {
      setCreator(foundCreator);
      setIsFollowing(followed.includes(foundCreator.id));

      // Filter shows/projects
      const mediaList = allMedia.filter(m => m.creatorId === foundCreator.id);
      setCreatorMedia(mediaList);

      // Filter posts
      const postList = allPosts.filter(p => p.creatorId === foundCreator.id);
      setCreatorPosts(postList);
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadCreatorDetails();

    window.addEventListener("oldverse_store_update", loadCreatorDetails);
    return () => window.removeEventListener("oldverse_store_update", loadCreatorDetails);
  }, [id]);



  if (!isClient) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-oldverse-bg pt-32 text-center space-y-4">
        <h2 className="font-bebas text-4xl text-oldverse-error">Creator Not Found</h2>
        <p className="text-oldverse-secondary text-sm">This visual architect does not exist in our grid.</p>
        <Link href="/" className="inline-block px-6 py-2.5 bg-oldverse-accent text-oldverse-bg font-grotesk font-bold rounded-full uppercase text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-oldverse-bg min-h-screen pb-16">
      {/* 1. Profile Banner Hero */}
      <section className="relative h-[40vh] sm:h-[50vh] w-full overflow-hidden">
        <img
          src={creator.banner}
          alt={creator.name}
          className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.05]"
        />
        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-oldverse-bg via-transparent to-black/20" />
      </section>

      {/* 2. Creator Stats & Cover Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24 sm:-mt-32">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 pb-6 border-b border-white/5">
          {/* Avatar cover */}
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden border-4 border-oldverse-bg ring-4 ring-white/5 shadow-2xl bg-oldverse-card flex-none">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details & Info block */}
          <div className="flex-grow space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-bebas text-4xl sm:text-5xl text-oldverse-text tracking-wider uppercase leading-none">
                {creator.name}
              </h1>
              {creator.isVerified && (
                <div className="p-0.5 bg-oldverse-accent rounded-full border border-oldverse-bg flex items-center justify-center">
                  <Check className="h-4.5 w-4.5 text-oldverse-bg stroke-[4]" />
                </div>
              )}
            </div>

            <p className="text-oldverse-secondary text-sm font-grotesk font-semibold tracking-wide">
              @{creator.username}
            </p>

            <p className="text-sm font-light text-oldverse-text/90 max-w-2xl leading-relaxed">
              {creator.bio}
            </p>

            {/* Social media connections */}
            <div className="flex items-center gap-4 text-oldverse-secondary pt-2">
              {creator.links.instagram && (
                <a href={creator.links.instagram} target="_blank" rel="noreferrer" className="hover:text-oldverse-accent transition-colors" aria-label="Instagram">
                  <svg className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              )}
              {creator.links.youtube && (
                <a href={creator.links.youtube} target="_blank" rel="noreferrer" className="hover:text-oldverse-accent transition-colors" aria-label="YouTube">
                  <svg className="h-4.5 w-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                    <polygon points="10 15 15 12 10 9" className="fill-current" />
                  </svg>
                </a>
              )}
              {creator.links.twitter && (
                <a href={creator.links.twitter} target="_blank" rel="noreferrer" className="hover:text-oldverse-accent transition-colors" aria-label="Twitter">
                  <svg className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              )}
              {creator.links.website && (
                <a href={creator.links.website} target="_blank" rel="noreferrer" className="hover:text-oldverse-accent transition-colors" aria-label="Website">
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Followers count and CTA */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 flex-none w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
            <div className="flex gap-4 md:text-right">
              <div>
                <span className="block font-bebas text-2xl tracking-wider text-oldverse-accent leading-none">
                  {creator.followers.toLocaleString()}
                </span>
                <span className="text-[10px] text-oldverse-secondary uppercase font-grotesk font-semibold tracking-wider">
                  Followers
                </span>
              </div>
              <div className="border-l border-white/10 pl-4 md:pl-0 md:border-l-0 md:text-right">
                <span className="block font-bebas text-2xl tracking-wider text-oldverse-text leading-none">
                  {creatorMedia.length}
                </span>
                <span className="text-[10px] text-oldverse-secondary uppercase font-grotesk font-semibold tracking-wider">
                  Releases
                </span>
              </div>
            </div>

            <a
              href="https://instagram.com/theoldverse_"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full font-grotesk font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-oldverse-accent text-oldverse-bg hover:bg-oldverse-accent-secondary inline-block text-center"
            >
              Follow Creator
            </a>
          </div>
        </div>
      </section>

      {/* 3. Portfolio Tabs & Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Navigation tabs */}
        <div className="flex gap-6 border-b border-white/5 text-sm font-grotesk tracking-wide font-medium">
          <button
            onClick={() => setActiveTab("shows")}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "shows" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Film className="h-4 w-4" />
            Shows & Projects
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "photos" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Photography
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "posts" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Backstage Feed ({creatorPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "about" ? "text-oldverse-accent border-b border-oldverse-accent" : "text-oldverse-secondary hover:text-oldverse-text"
            }`}
          >
            <Info className="h-4 w-4" />
            About
          </button>
        </div>

        {/* Tab contents */}
        <div className="min-h-80">
          {activeTab === "shows" && (
            <div>
              {creatorMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {creatorMedia.map((item) => (
                    <Link
                      key={item.id}
                      href={`/watch/${item.id}`}
                      className="group flex flex-col rounded-lg overflow-hidden border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/30 transition-all duration-300"
                    >
                      <div className="aspect-[2/3] overflow-hidden relative">
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-oldverse-accent">
                          <Star className="h-3 w-3 fill-oldverse-accent" />
                          {item.rating}
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <span className="text-[9px] uppercase font-grotesk font-semibold text-oldverse-accent tracking-wider block">
                          {item.category}
                        </span>
                        <h3 className="font-grotesk text-sm font-bold text-oldverse-text group-hover:text-oldverse-accent transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-oldverse-secondary font-light">
                          {item.duration}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-oldverse-secondary font-light text-sm">
                  This director has not uploaded any cinematic projects yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mockPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="group rounded-xl overflow-hidden border border-white/5 bg-oldverse-card/50 hover:border-oldverse-accent/30 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-grotesk text-sm font-bold text-oldverse-text group-hover:text-oldverse-accent transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-oldverse-secondary font-light">
                      {photo.gear}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "posts" && (
            <div className="max-w-2xl mx-auto space-y-4">
              {creatorPosts.map((post) => (
                <div
                  key={post.id}
                  className="glassmorphism-card rounded-xl p-5 space-y-4 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="h-9 w-9 rounded-full object-cover border border-white/5"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-grotesk text-sm font-bold text-oldverse-text">
                          {creator.name}
                        </h4>
                        {creator.isVerified && (
                          <div className="p-0.5 bg-oldverse-accent rounded-full border border-oldverse-bg flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-oldverse-bg stroke-[4]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-oldverse-secondary font-light">
                        {post.timestamp}
                      </span>
                    </div>
                    <span className="ml-auto text-[9px] uppercase font-grotesk font-semibold bg-white/5 px-2 py-0.5 border border-white/5 text-oldverse-secondary rounded-full">
                      {post.category}
                    </span>
                  </div>

                  <p className="text-sm font-light text-oldverse-text/95 leading-relaxed font-sans">
                    {post.content}
                  </p>

                  {post.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-white/5 aspect-video relative max-h-72">
                      <img
                        src={post.imageUrl}
                        alt="Post Asset"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-oldverse-secondary pt-2 border-t border-white/5">
                    <button className="flex items-center gap-1 hover:text-oldverse-accent transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes} Likes</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-oldverse-accent transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.commentsCount} Comments</span>
                    </button>
                  </div>
                </div>
              ))}
              {creatorPosts.length === 0 && (
                <div className="text-center py-16 text-oldverse-secondary font-light text-sm">
                  This creator has not shared any backstage diaries yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="max-w-3xl space-y-6">
              <div className="space-y-3">
                <h3 className="font-bebas text-2xl tracking-wider text-oldverse-text uppercase flex items-center gap-2">
                  <Award className="h-5 w-5 text-oldverse-accent" />
                  Biography & Philosophy
                </h3>
                <p className="text-oldverse-secondary font-light leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {creator.about}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                <div className="space-y-2">
                  <h4 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {creator.categories.map((c, i) => (
                      <span key={i} className="text-xs font-grotesk font-semibold bg-white/5 border border-white/5 text-oldverse-secondary px-3 py-1 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">Awards & Laurels</h4>
                  <ul className="space-y-1 text-sm text-oldverse-secondary font-light">
                    <li>🏆 Best Experimental Director – OldVerse Indie Awards 2024</li>
                    <li>🎬 Official Selection – Cannes Independent Showcase 2025</li>
                    <li>💡 Creative Catalyst Grant Recipient 2026</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
