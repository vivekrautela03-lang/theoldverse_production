import React from "react";
import Link from "next/link";
import { ARTICLES_REGISTRY, CATEGORIES } from "@/data/resources";
import { Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decodedTag = decodeURIComponent(id);
  return {
    title: `Articles tagged with "${decodedTag}" | The Oldverse Productions`,
    description: `Expert articles, guidelines, and film tips tagged with ${decodedTag} on The Oldverse.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { id } = await params;
  const decodedTag = decodeURIComponent(id);
  const articles = ARTICLES_REGISTRY.filter((a) => a.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase() || t === decodedTag));

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 font-grotesk uppercase">
          <Link href="/" className="hover:text-oldverse-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/resources" className="hover:text-oldverse-accent transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-white/60">Tag: {decodedTag}</span>
        </div>

        {/* Header Block */}
        <div className="space-y-4 border-b border-white/5 pb-8">
          <Link
            href="/resources"
            className="text-xs text-white/50 hover:text-oldverse-accent transition-colors flex items-center gap-1.5 uppercase font-grotesk font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back To Hub
          </Link>
          <div className="space-y-2">
            <h1 className="font-bebas text-4xl sm:text-6xl text-oldverse-text tracking-wider uppercase leading-none">
              Tag: #{decodedTag}
            </h1>
            <p className="text-sm text-white/50 font-light">
              Showing {articles.length} guides tagged with #{decodedTag}
            </p>
          </div>
        </div>

        {/* Articles List */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="glassmorphism p-6 rounded-xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[10px] text-white/40 font-grotesk uppercase">
                    <span className="text-oldverse-accent font-semibold">
                      {CATEGORIES[article.category] || article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  </div>

                  <h2 className="font-bebas text-xl sm:text-2xl text-oldverse-text tracking-wide group-hover:text-oldverse-accent transition-colors leading-tight">
                    <Link href={`/resources/${article.slug}`}>{article.title}</Link>
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
            <p className="text-white/50 text-sm font-light">No articles tagged with #{decodedTag} yet.</p>
            <Link
              href="/resources"
              className="inline-block bg-oldverse-accent text-oldverse-bg font-bold py-2.5 px-6 rounded-lg text-xs font-grotesk uppercase tracking-wider transition-colors hover:bg-white"
            >
              Return to Knowledge Hub
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
