import React from "react";

export default function AdminLoading() {
  return (
    <div className="bg-[#050608] min-h-screen p-6 sm:p-8 space-y-8 font-grotesk animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 w-full bg-[#0B0E13] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
        <div className="h-4 w-40 bg-white/10 rounded-md" />
        <div className="h-8 w-72 bg-white/10 rounded-xl" />
        <div className="h-4 w-full max-w-lg bg-white/5 rounded-md" />
      </div>

      {/* Grid Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 bg-[#0B0E13] border border-white/5 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-white/10 rounded-md" />
            <div className="h-7 w-20 bg-[#8DBEFF]/20 rounded-lg" />
            <div className="h-3 w-32 bg-white/5 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table / List Skeleton */}
      <div className="h-72 bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="h-6 w-48 bg-white/10 rounded-md" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-10 w-full bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
