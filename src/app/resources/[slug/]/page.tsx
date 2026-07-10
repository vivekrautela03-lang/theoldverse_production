import React from "react";
import Link from "next/link";
import { getArticleContent, ARTICLES_REGISTRY, CATEGORIES } from "@/data/resources";
import { Clock, Calendar, ArrowLeft, ArrowRight, AlertCircle, HelpCircle, CheckCircle, Info } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleContent(slug);
  if (!article) return {};

  const baseUrl = "https://theoldverse-productions.in";
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `${baseUrl}/resources/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `${baseUrl}/resources/${article.slug}`,
      type: "article",
      publishedTime: `${article.date}T00:00:00Z`,
      authors: [article.author],
      siteName: "The Oldverse",
      images: [
        {
          url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: ["https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop"],
    }
  };
}

export async function generateStaticParams() {
  return ARTICLES_REGISTRY.map((a) => ({
    slug: a.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleContent(slug);

  if (!article) {
    notFound();
  }

  // Related articles filter
  const relatedArticles = ARTICLES_REGISTRY.filter(
    (a) => a.category === article.category && a.slug !== article.slug
  ).slice(0, 3);

  const baseUrl = "https://theoldverse-productions.in";

  // Breadcrumbs schema markup
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resources",
        "item": `${baseUrl}/resources`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${baseUrl}/resources/${article.slug}`
      }
    ]
  };

  // Article schema markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Oldverse Productions",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "description": article.metaDescription,
    "inLanguage": "en-US",
    "mainEntityOfPage": `${baseUrl}/resources/${article.slug}`
  };

  // FAQ schema markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      
      {/* Inject Structured Data Schemas (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {article.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumbs UI */}
        <div className="flex items-center gap-2 text-xs text-white/40 font-grotesk uppercase">
          <Link href="/" className="hover:text-oldverse-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/resources" className="hover:text-oldverse-accent transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-white/60 line-clamp-1">{article.title}</span>
        </div>

        {/* Back Link */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-oldverse-accent transition-colors uppercase font-grotesk font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back To Knowledge Hub
        </Link>

        {/* Article Title block */}
        <div className="space-y-4">
          <span className="inline-block bg-oldverse-accent/10 border border-oldverse-accent/20 text-oldverse-accent text-[10px] font-grotesk font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {CATEGORIES[article.category] || article.category}
          </span>
          <h1 className="font-bebas text-4xl sm:text-6xl text-oldverse-text tracking-wider uppercase leading-tight cinematic-glow">
            {article.title}
          </h1>

          {/* Author/Date Info line */}
          <div className="flex flex-wrap gap-6 text-xs text-white/50 font-grotesk uppercase pt-2 border-b border-white/5 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-oldverse-accent" /> Published: {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-oldverse-accent" /> Read Time: {article.readTime}
            </span>
            <span className="text-white/70">
              By {article.author}
            </span>
          </div>
        </div>

        {/* Featured Image Block */}
        <div className="relative h-[250px] sm:h-[400px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-oldverse-card flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop"
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute bottom-6 left-6 z-20 space-y-1">
            <p className="text-[10px] font-grotesk text-oldverse-accent uppercase tracking-widest font-semibold">Featured Guide</p>
            <p className="font-bebas text-xl sm:text-3xl text-white tracking-wider uppercase leading-none">{article.title}</p>
          </div>
        </div>

        {/* Article Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start">
          
          {/* Table of Contents sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="glassmorphism p-6 rounded-xl border border-white/5 space-y-4">
              <h3 className="font-bebas text-lg text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                Table of Contents
              </h3>
              <ul className="space-y-2.5 font-grotesk text-xs uppercase tracking-wider text-white/60">
                <li>
                  <a href="#introduction" className="hover:text-oldverse-accent transition-colors block">1. Introduction & Overview</a>
                </li>
                <li>
                  <a href="#detailed-answer" className="hover:text-oldverse-accent transition-colors block">2. In-Depth Analysis</a>
                </li>
                <li>
                  <a href="#matrix-table" className="hover:text-oldverse-accent transition-colors block">3. Comparison Matrix</a>
                </li>
                <li>
                  <a href="#examples" className="hover:text-oldverse-accent transition-colors block">4. Practical Case Study</a>
                </li>
                <li>
                  <a href="#tips" className="hover:text-oldverse-accent transition-colors block">5. Expert Tips</a>
                </li>
                <li>
                  <a href="#mistakes" className="hover:text-oldverse-accent transition-colors block">6. Critical Pitfalls</a>
                </li>
                {article.faqs.length > 0 && (
                  <li>
                    <a href="#faqs" className="hover:text-oldverse-accent transition-colors block">7. Frequently Asked Questions</a>
                  </li>
                )}
                <li>
                  <a href="#conclusion" className="hover:text-oldverse-accent transition-colors block">8. Summary & Next Steps</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="lg:col-span-8 space-y-10 text-white/80 leading-relaxed font-sans text-sm sm:text-base">
            
            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-28 space-y-4">
              <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                1. Introduction & Overview
              </h2>
              <div className="space-y-4 font-light text-white/80 leading-relaxed">
                {article.introduction.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* 2. Detailed Answer */}
            <section id="detailed-answer" className="scroll-mt-28 space-y-4">
              <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                2. In-Depth Analysis
              </h2>
              <div className="space-y-4 font-light text-white/80 leading-relaxed">
                {article.detailedAnswer.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* 3. Comparison Matrix Table */}
            <section id="matrix-table" className="scroll-mt-28 space-y-4">
              <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                3. Comparison Matrix
              </h2>
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0e0e0e] border-b border-white/10 font-grotesk uppercase tracking-wider text-oldverse-accent font-bold">
                      {article.tableHeaders.map((header) => (
                        <th key={header} className="p-4">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {article.tableRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors font-light">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-4 text-white/70">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Examples Section */}
            <section id="examples" className="scroll-mt-28 space-y-4">
              <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                4. Practical Case Study
              </h2>
              <div className="glassmorphism p-6 rounded-xl border border-white/5 flex gap-4 items-start relative overflow-hidden">
                <Info className="h-6 w-6 text-oldverse-accent flex-shrink-0 mt-1" />
                <div className="space-y-2 font-light text-white/70 italic text-xs sm:text-sm">
                  {article.examples.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Tips bulleted list */}
            <section id="tips" className="scroll-mt-28 space-y-4">
              <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                5. Expert Tips
              </h2>
              <ul className="space-y-3 font-light text-white/80">
                {article.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-oldverse-accent flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Mistakes numbered list */}
            <section id="mistakes" className="scroll-mt-28 space-y-4">
              <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                6. Critical Pitfalls
              </h2>
              <ul className="space-y-3 font-light text-white/80">
                {article.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-red-500/80 flex-shrink-0 mt-0.5" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. Frequently Asked Questions FAQ Accordion */}
            {article.faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-28 space-y-4">
                <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                  7. Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {article.faqs.map((faq, idx) => (
                    <div key={idx} className="glassmorphism p-5 rounded-xl border border-white/5 space-y-2">
                      <h4 className="font-grotesk text-sm sm:text-base font-bold text-white flex gap-2 items-start">
                        <HelpCircle className="h-5 w-5 text-oldverse-accent flex-shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-white/60 font-light pl-7 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 8. Conclusion & Call-to-action */}
            <section id="conclusion" className="scroll-mt-28 space-y-6">
              <h2 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
                8. Summary & Next Steps
              </h2>
              <div className="space-y-4 font-light text-white/80 leading-relaxed">
                {article.conclusion.split("\n\n").map((para, i) => {
                  if (para.startsWith(">")) {
                    return (
                      <div key={i} className="my-6 p-6 bg-oldverse-accent/5 border border-oldverse-accent/20 rounded-xl space-y-3">
                        <p className="font-bebas text-lg text-oldverse-accent tracking-wider uppercase">Contact The OldVerse Productions</p>
                        <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                          Want to work with The Oldverse Productions? Whether you're an aspiring filmmaker, actor, writer, editor, cinematographer, or brand looking for cinematic storytelling, contact us today.
                        </p>
                        <div className="pt-2">
                          <Link
                            href="/contact"
                            className="inline-block bg-oldverse-accent hover:bg-white text-oldverse-bg font-bold py-2.5 px-6 rounded-lg text-xs font-grotesk uppercase tracking-wider transition-all duration-300"
                          >
                            Get In Touch
                          </Link>
                        </div>
                      </div>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>
            </section>

            {/* Tags line */}
            <div className="pt-8 border-t border-white/5 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-white/40 font-grotesk uppercase mr-2">Tags:</span>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/resources/tag/${encodeURIComponent(tag)}`}
                  className="text-xs border border-white/10 text-white/70 hover:border-oldverse-accent hover:text-oldverse-accent py-1 px-3 rounded-full font-grotesk transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

          </div>

        </div>

        {/* Related Articles section */}
        {relatedArticles.length > 0 && (
          <div className="pt-16 border-t border-white/5 space-y-6">
            <h3 className="font-bebas text-2xl sm:text-3xl text-oldverse-text tracking-wider uppercase">
              Related Career Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((ra) => (
                <div
                  key={ra.slug}
                  className="glassmorphism p-5 rounded-xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-white/10 transition-colors group"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] font-grotesk uppercase text-oldverse-accent font-semibold">
                      {CATEGORIES[ra.category] || ra.category}
                    </span>
                    <h4 className="font-bebas text-lg text-white group-hover:text-oldverse-accent transition-colors tracking-wide leading-tight line-clamp-2">
                      <Link href={`/resources/${ra.slug}`}>{ra.title}</Link>
                    </h4>
                  </div>
                  <Link
                    href={`/resources/${ra.slug}`}
                    className="text-[10px] text-white/40 group-hover:text-white font-grotesk uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    Read Article <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
