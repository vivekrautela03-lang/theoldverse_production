import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Film, Play, Star, Sparkles, ShieldCheck } from "lucide-react";
import { constructMetadata, getOrganizationSchema, getBreadcrumbSchema } from "@/lib/seo";
import { mockMediaItems } from "@/lib/mockData";

export const metadata = constructMetadata({
  title: "TheOldverse Film Catalog & Productions",
  description: "Explore official films, short movies, original documentaries, commercials, and digital projects created by TheOldverse Productions in Dehradun, Uttarakhand.",
  path: "/productions"
});

export default function ProductionsPage() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Productions", url: "/productions" }
  ]);

  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-20 font-grotesk text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, breadcrumbSchema]) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DBEFF] uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            <span>OFFICIAL FILM ARCHIVE</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
            TheOldverse Productions Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#B8C2CC] font-light leading-relaxed">
            Discover original films, trailers, cinematic visual art, documentary projects, and video productions created by TheOldverse studio team.
          </p>
        </div>

        {/* Productions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockMediaItems.map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="bg-[#0B0E13] border border-white/10 hover:border-[#8DBEFF]/50 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] sm:aspect-[4/5] relative overflow-hidden bg-black">
                  <img
                    src={item.posterUrl || item.bannerUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[#8DBEFF] font-mono text-[9px] font-bold uppercase border border-white/10">
                    {item.category}
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded text-[10px] text-[#8DBEFF] font-bold">
                    <Star className="h-3 w-3 fill-[#8DBEFF]" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="font-bold text-lg text-white group-hover:text-[#8DBEFF] transition-colors line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#B8C2CC] font-light line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between text-xs text-[#B8C2CC]">
                <span>{item.duration}</span>
                <span className="text-[#8DBEFF] font-bold flex items-center gap-1">
                  <Play className="h-3 w-3" /> Watch Film
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
