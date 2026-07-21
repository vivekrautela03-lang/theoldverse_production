"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, X, Star, Users, Video, Film, Eye, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  bannerUrl: string;
  videoUrl: string;
  director: string;
  stars: string;
}

const galleryData: GalleryItem[] = [
  {
    id: "media-love-1",
    title: "Silence Glances, Golden Moments",
    category: "Short Film",
    description: "A silent romantic tale told in golden light, where feelings speak far louder than words can.",
    bannerUrl: "/silence_glances_golden_moments.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    director: "Shivanshi",
    stars: "Harendra & Soundarya"
  },
  {
    id: "media-love-2",
    title: "Destined",
    category: "Music Clip",
    description: "An emotional romance music clip based on true heartstrings and cinematic frames.",
    bannerUrl: "/destined.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    director: "Shivanshi & Vivek Rautela",
    stars: "Harendra & Jiya"
  },
  {
    id: "media-music-3",
    title: "Chai or tum",
    category: "Music Clip",
    description: "A warm romance based around cups of tea and random encounters in Dehradun.",
    bannerUrl: "/chai_or_tum.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    director: "Shivanshi & Vivek Rautela",
    stars: "Jiya & Harendra"
  },
  {
    id: "media-coming-3",
    title: "The Ache Beneath My Ribs",
    category: "Indie Drama",
    description: "A poetic journey exploring the silent sorrows and beautiful longings of a visual storyteller.",
    bannerUrl: "/the_ache_beneath_my_ribs.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    director: "Shivanshi",
    stars: "Shivanshi"
  }
];

// Custom Lazy Loaded Image Component with IntersectionObserver (rootMargin: 200px)
function LazyStageImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px" // Trigger load 200px before scrolling into viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-white/2 transition-opacity duration-700 ease-out ${
        isLoaded ? "opacity-100" : "opacity-30"
      } ${className || ""}`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export default function CinematicStagePage() {
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 35 });
  const [videoOpen, setVideoOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Mouse tracking spotlight effect on the Hero banner
  const handleMouseMove = (e: React.MouseEvent) => {
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlightPos({ x, y });
    }
  };

  const handlePlayNaadaniya = () => {
    setVideoOpen(true);
    confetti({
      particleCount: 150,
      spread: 80,
      colors: ["#F5A623", "#FF8C32", "#FFFFFF"]
    });
  };

  return (
    <div className="bg-[#07090e] min-h-screen text-oldverse-text selection:bg-oldverse-accent selection:text-oldverse-bg font-sans overflow-x-hidden relative">
      
      {/* Preload Hero Image manually in document head to skip lazy loading */}
      <link rel="preload" as="image" href="/naadaniya.png" />

      {/* Cinematic Film Grain Overlay (Tactile Texture) */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* --- HERO FOLD: THE SPOTLIT STAGE --- */}
      <section
        ref={stageRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen w-full flex flex-col justify-between items-center pt-24 pb-12 px-4 overflow-hidden border-b border-white/5"
        style={{
          // Spotlight conic/radial gradient background centered on cursor
          background: `radial-gradient(circle 400px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(245, 166, 35, 0.12) 0%, rgba(7, 9, 14, 0) 100%), #07090e`
        }}
      >
        {/* Dynamic Dramatic Spotlight Beam (CSS Visual Cone) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[550px] pointer-events-none opacity-40 mix-blend-screen transition-all duration-300 blur-3xl z-10"
          style={{
            background: `radial-gradient(circle at ${spotlightPos.x}% 20%, rgba(245, 166, 35, 0.25) 0%, rgba(245, 166, 35, 0.05) 50%, rgba(7, 9, 14, 0) 80%)`,
            transform: `translateX(-50%) rotate(${(spotlightPos.x - 50) * 0.15}deg)`
          }}
        />

        {/* Stage Header */}
        <div className="text-center space-y-2 z-20 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-oldverse-accent/10 border border-oldverse-accent/20 text-[9px] uppercase tracking-widest font-bold text-oldverse-accent font-grotesk">
            <Sparkles className="h-3 w-3 animate-pulse" /> The Oldverse Stage
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-widest text-oldverse-text uppercase leading-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            Every Story Deserves a Stage
          </h1>
          <p className="text-xs text-oldverse-secondary uppercase tracking-widest font-light font-grotesk max-w-md mx-auto">
            A theatrical display honoring independent cinematic craftsmanship
          </p>
        </div>

        {/* --- ABOVE THE FOLD: NAADANIYA SPECIAL HERO BANNER --- */}
        <div className="relative w-full max-w-4xl z-20 my-auto flex flex-col items-center">
          
          {/* Spotlight highlight circle under the banner */}
          <div 
            className="absolute -bottom-8 w-[300px] sm:w-[450px] h-12 bg-oldverse-accent/20 rounded-full blur-2xl filter mix-blend-screen transition-all duration-300"
            style={{ left: `calc(${spotlightPos.x}% - 150px)` }}
          />

          {/* Tactical Glassmorphic Stage Box */}
          <div className="w-full bg-[#0d121d]/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col md:flex-row hover:border-oldverse-accent/30 transition-all duration-500 group">
            
            {/* Spotlight Banner (NO LAZY LOADING - LOAD INSTANTLY) */}
            <div className="md:w-1/2 relative h-64 md:h-96 overflow-hidden">
              <img
                src="/naadaniya.png"
                alt="Naadaniya Film Cover"
                loading="eager" // Load instantly above the fold
                fetchPriority="high" // Prioritize request loading
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-transparent to-transparent pointer-events-none" />
              
              {/* Animated Floating Spotlight ring */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_120px_at_center,rgba(245,166,35,0.15),transparent)] pointer-events-none mix-blend-screen animate-pulse" />
            </div>

            {/* Stage Info Clapperboard details */}
            <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest font-grotesk bg-oldverse-accent/10 px-2.5 py-0.5 rounded border border-oldverse-accent/20">
                    Now Spotlit
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-grotesk flex items-center gap-1">
                    <Video className="h-3 w-3" /> Music Clip
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="font-bebas text-4xl sm:text-5xl text-oldverse-text tracking-wider uppercase leading-none">
                    Naadaniya
                  </h2>
                  <p className="text-[10px] text-oldverse-secondary font-grotesk tracking-wider uppercase">
                    Directed by <span className="text-white font-bold">Shivanshi & Vivek Rautela</span>
                  </p>
                </div>

                <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                  A serene music clip based on the song &quot;Dooron Dooron&quot;. Capturing romantic glances, golden moments, and an organic visual storyline set around a scenic brick tower.
                </p>
              </div>

              {/* Cast & Specs Metadata */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 text-[10px] font-grotesk uppercase tracking-wider text-oldverse-secondary">
                <div>
                  <span className="block text-[9px] text-white/30 font-bold mb-1">Starring</span>
                  <span className="text-white font-semibold">Harendra & Jiya</span>
                </div>
                <div>
                  <span className="block text-[9px] text-white/30 font-bold mb-1">Production</span>
                  <span className="text-white font-semibold">The Oldverse Studio</span>
                </div>
              </div>

              {/* Play CTA Button */}
              <button
                onClick={handlePlayNaadaniya}
                className="w-full py-4 bg-oldverse-accent hover:bg-white text-oldverse-bg font-grotesk font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-oldverse-accent/10 hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="h-4.5 w-4.5 fill-current" /> Play Spotlit Clip
              </button>

            </div>
          </div>
        </div>

        {/* --- DYNAMIC WOODEN STAGE FLOOR --- */}
        <div className="w-full max-w-6xl h-16 relative perspective-[800px] z-10 select-none pointer-events-none mt-8 sm:mt-12">
          {/* Wood Planks Stage Perspective Trapezoid */}
          <div 
            className="w-full h-full bg-gradient-to-b from-[#14100c] to-[#080605] border-t border-white/20 origin-bottom"
            style={{
              transform: "rotateX(60deg)",
              boxShadow: "0 -20px 40px rgba(0,0,0,0.8), inset 0 20px 40px rgba(255,255,255,0.05)",
              backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.4) 40px, rgba(0,0,0,0.4) 41px)"
            }}
          />
          {/* Floor spotlight reflection overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[30px] bg-oldverse-accent/10 rounded-full blur-xl pointer-events-none" />
        </div>

      </section>

      {/* --- GALLERY SECTION: BELOW THE FOLD --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12 relative z-20">
        
        <div className="space-y-2 text-left border-l-2 border-oldverse-accent pl-4">
          <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block font-grotesk">
            Backstage Archive
          </span>
          <h2 className="font-bebas text-4xl sm:text-5xl text-oldverse-text tracking-wider uppercase leading-none">
            Selected Stage Works
          </h2>
          <p className="text-xs text-oldverse-secondary uppercase tracking-wider font-light max-w-md font-grotesk">
            Hover to reveal spotlight details. Fades in gracefully just before scrolling.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {galleryData.map((item) => (
            <div
              key={item.id}
              className="bg-oldverse-card/20 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Lazy Stage Image: Fade-in 200px before scrolling */}
              <div className="aspect-video w-full overflow-hidden relative">
                <LazyStageImage
                  src={item.bannerUrl}
                  alt={item.title}
                  className="w-full h-full"
                />
                
                {/* Floating Category tag */}
                <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-bold uppercase tracking-widest text-oldverse-accent border border-white/5 font-grotesk">
                  {item.category}
                </span>
              </div>

              {/* Card Meta details */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wide uppercase leading-none group-hover:text-oldverse-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[9px] text-oldverse-secondary uppercase tracking-widest font-grotesk">
                    Directed by {item.director}
                  </p>
                </div>

                <p className="text-white/50 text-xs font-light leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] text-white/30 uppercase tracking-widest font-grotesk">
                    Stars: <strong className="text-white/60 font-semibold">{item.stars}</strong>
                  </span>
                  
                  <Link
                    href={`/watch/${item.id}`}
                    className="flex items-center gap-1 text-[10px] font-bold text-oldverse-accent uppercase tracking-widest font-grotesk hover:underline"
                  >
                    Watch Work <Play className="h-3 w-3 fill-current" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* --- LIGHTBOX VIDEO PLAYER FOR NAADANIYA --- */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          
          {/* Close Lightbox area */}
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer z-50 hover:scale-105"
            aria-label="Close Video Player"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Cinematic Lightbox Frame */}
          <div className="w-full max-w-4xl aspect-video bg-black border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
            
            {/* Cloudinary Video stream */}
            <video
              src="https://res.cloudinary.com/q15xvfwy/video/upload/v1783006313/WhatsApp_Video_2026-07-02_at_8.58.19_PM_wk6qim.mp4"
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

          </div>
        </div>
      )}

    </div>
  );
}
