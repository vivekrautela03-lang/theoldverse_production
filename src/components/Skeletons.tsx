"use client";

import React from "react";

// Shimmer pulse base block
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white/[0.04] border border-white/5 rounded-xl animate-pulse ${className}`}
    />
  );
}

// 1. Hero Carousel Skeleton
export function HeroSkeleton() {
  return (
    <div className="w-full relative aspect-[16/9] sm:aspect-[21/9] bg-[#0B0E13] border border-white/10 rounded-3xl overflow-hidden p-6 sm:p-12 flex flex-col justify-end space-y-4 animate-pulse">
      <div className="h-4 w-36 bg-white/10 rounded-md" />
      <div className="h-10 sm:h-14 w-3/4 max-w-xl bg-white/10 rounded-xl" />
      <div className="h-4 w-full max-w-lg bg-white/5 rounded-md" />
      <div className="h-4 w-2/3 max-w-md bg-white/5 rounded-md" />
      <div className="pt-4 flex gap-4">
        <div className="h-11 w-36 bg-[#8DBEFF]/20 rounded-xl" />
        <div className="h-11 w-32 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}

// 2. Movie Card / Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse flex flex-col justify-between">
      <div className="space-y-3">
        <div className="aspect-[16/9] sm:aspect-[4/5] bg-white/5 rounded-xl w-full" />
        <div className="h-5 w-3/4 bg-white/10 rounded-md" />
        <div className="h-3 w-full bg-white/5 rounded-md" />
        <div className="h-3 w-4/5 bg-white/5 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-3 w-16 bg-white/10 rounded-md" />
        <div className="h-3 w-12 bg-white/10 rounded-md" />
      </div>
    </div>
  );
}

// 3. Grid of Project Skeletons
export function ProjectsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <ProjectCardSkeleton key={idx} />
      ))}
    </div>
  );
}

// 4. Horizontal Movie Row Skeleton
export function MovieRowSkeleton() {
  return (
    <div className="space-y-4 py-4 w-full">
      <div className="h-6 w-48 bg-white/10 rounded-md animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="flex-none w-48 sm:w-60 aspect-[16/9] bg-[#0B0E13] border border-white/5 rounded-2xl p-3 space-y-2 animate-pulse"
          >
            <div className="h-full w-full bg-white/5 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Team Member Card Skeleton
export function TeamMemberSkeleton() {
  return (
    <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 text-center space-y-4 animate-pulse flex flex-col items-center">
      <div className="h-20 w-20 rounded-full bg-white/10" />
      <div className="h-4 w-32 bg-white/10 rounded-md" />
      <div className="h-3 w-40 bg-[#8DBEFF]/20 rounded-md" />
      <div className="h-3 w-full bg-white/5 rounded-md" />
      <div className="h-3 w-3/4 bg-white/5 rounded-md" />
    </div>
  );
}

// 6. Watch Page Video & Details Skeleton
export function WatchPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8 animate-pulse font-grotesk">
      {/* Video Player Skeleton */}
      <div className="aspect-video w-full bg-[#0B0E13] border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white/10" />
      </div>

      {/* Metadata & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-8 w-2/3 bg-white/10 rounded-xl" />
          <div className="h-4 w-full bg-white/5 rounded-md" />
          <div className="h-4 w-4/5 bg-white/5 rounded-md" />
          <div className="flex gap-3 pt-2">
            <div className="h-9 w-28 bg-[#8DBEFF]/20 rounded-xl" />
            <div className="h-9 w-24 bg-white/10 rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="h-40 bg-[#0B0E13] border border-white/5 rounded-2xl p-4" />
        </div>
      </div>
    </div>
  );
}

// 7. Full App Route Loading Screen (Next.js loading.tsx)
export function PageSkeletonLayout() {
  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-16 font-grotesk text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <HeroSkeleton />
        <MovieRowSkeleton />
        <ProjectsGridSkeleton count={3} />
      </div>
    </div>
  );
}
