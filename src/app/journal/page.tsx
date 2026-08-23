import React from "react";
import Metadata from "next";
import Link from "next/link";
import { BookOpen, Calendar, User, ArrowRight, Sparkles } from "lucide-react";
import { constructMetadata, getOrganizationSchema, getBreadcrumbSchema } from "@/lib/seo";
import { ARTICLES_REGISTRY } from "@/data/resources";

export const metadata = constructMetadata({
  title: "Filmmaking Journal & Case Studies",
  description: "Read filmmaking guides, cinematography insights, behind-the-scenes production case studies, and film industry articles by TheOldverse Productions in Dehradun.",
  path: "/journal"
});

export default function JournalPage() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Journal", url: "/journal" }
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
            <BookOpen className="h-4 w-4" />
            <span>CINEMATIC JOURNAL & CASE STUDIES</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
            TheOldverse Filmmaking Journal
          </h1>
          <p className="text-xs sm:text-sm text-[#B8C2CC] font-light leading-relaxed">
            In-depth guides on cinematography, screenplay development, short film production, post-production editing, and behind-the-scenes stories from Dehradun.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES_REGISTRY.map((art) => (
            <Link
              key={art.slug}
              href={`/resources/${art.slug}`}
              className="bg-[#0B0E13] border border-white/10 hover:border-[#8DBEFF]/40 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8DBEFF] uppercase font-bold">
                  <span>{art.category}</span>
                  <span>{art.readTime}</span>
                </div>
                <h2 className="font-bold text-xl text-white group-hover:text-[#8DBEFF] transition-colors line-clamp-2">
                  {art.title}
                </h2>
                <p className="text-xs text-[#B8C2CC] font-light line-clamp-3 leading-relaxed">
                  {art.metaDescription}
                </p>
              </div>

              <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs text-[#B8C2CC]">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>{art.author}</span>
                </span>
                <span className="font-bold text-[#8DBEFF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
