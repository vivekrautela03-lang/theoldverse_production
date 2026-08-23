import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Film, Video, Camera, Scissors, Compass, Music, Clapperboard, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { constructMetadata, getOrganizationSchema, getLocalBusinessSchema, getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Film & Creative Production Services in Dehradun",
  description: "Explore professional film production, cinematography, video editing, direction, screenplay writing, commercials, and music video production services by TheOldverse Productions in Dehradun, Uttarakhand.",
  path: "/services"
});

const serviceList = [
  {
    slug: "film-production",
    title: "Film Production",
    icon: Film,
    shortBio: "End-to-end production for short films, indie features, and cinematic narrative projects from pre-production to final cut.",
    href: "/services/film-production"
  },
  {
    slug: "video-production",
    title: "Video Production",
    icon: Video,
    shortBio: "High-quality corporate videos, brand storytelling, digital content, and promotional media tailored for modern digital platforms.",
    href: "/services/video-production"
  },
  {
    slug: "cinematography",
    title: "Cinematography & Camera Operations",
    icon: Camera,
    shortBio: "Atmospheric visual framing, professional camera rigging, lighting design, and high-resolution digital cinematography.",
    href: "/services/cinematography"
  },
  {
    slug: "video-editing",
    title: "Post-Production & Video Editing",
    icon: Scissors,
    shortBio: "Precision video editing, color grading, sound design, soundscapes, and visual effects for cinematic projects.",
    href: "/services/video-editing"
  },
  {
    slug: "direction",
    title: "Direction & Screenplay Writing",
    icon: Compass,
    shortBio: "Original story development, screenplay drafting, creative direction, actor guidance, and scene composition.",
    href: "/services/direction"
  },
  {
    slug: "music-video-production",
    title: "Music Video Production",
    icon: Music,
    shortBio: "Visually arresting music clips, atmospheric storytelling, artist branding, and stylized visual music narratives.",
    href: "/services/music-video-production"
  },
  {
    slug: "commercial-video-production",
    title: "Commercial & Brand Films",
    icon: Clapperboard,
    shortBio: "Commercial video ads, brand documentaries, product showcases, and high-impact digital campaign videos.",
    href: "/services/commercial-video-production"
  }
];

const faqs = [
  {
    question: "What production services does TheOldverse Productions offer in Dehradun?",
    answer: "TheOldverse Productions provides end-to-end filmmaking services including film production, cinematography, video editing, direction, screenplay writing, music video production, and commercial video creation."
  },
  {
    question: "Where is TheOldverse Productions based?",
    answer: "TheOldverse Productions is based in Dehradun, Uttarakhand, India, working on local, national, and international visual storytelling projects."
  },
  {
    question: "How can clients start a production project with TheOldverse?",
    answer: "You can reach out directly via our Contact page or email theoldverse@gmail.com with your script, project brief, budget, or creative concept."
  }
];

export default function ServicesPage() {
  const orgSchema = getOrganizationSchema();
  const localSchema = getLocalBusinessSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" }
  ]);
  const faqSchema = getFAQSchema(faqs);

  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-20 font-grotesk text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, localSchema, breadcrumbSchema, faqSchema]) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Banner */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DBEFF] uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            <span>DEHRADUN CREATIVE PRODUCTION SERVICES</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
            Film & Visual Production Capabilities
          </h1>
          <p className="text-sm sm:text-base text-[#B8C2CC] font-light leading-relaxed">
            TheOldverse Productions offers end-to-end creative filmmaking, cinematography, direction, screenplay development, and post-production editing services based in Dehradun, Uttarakhand.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.slug}
                href={srv.href}
                className="bg-[#0B0E13] border border-white/10 hover:border-[#8DBEFF]/50 rounded-2xl p-6 space-y-4 group transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/30 flex items-center justify-center text-[#8DBEFF] group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-bold text-xl text-white group-hover:text-[#8DBEFF] transition-colors">
                    {srv.title}
                  </h2>
                  <p className="text-xs text-[#B8C2CC] font-light leading-relaxed">
                    {srv.shortBio}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#8DBEFF] uppercase tracking-wider pt-4 border-t border-white/5">
                  <span>Explore Service Capabilities</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Local SEO & FAQ Section */}
        <div className="bg-[#0B0E13] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider uppercase">
              Working With TheOldverse Productions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-2">
                <h3 className="font-bold text-white text-sm flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-[#8DBEFF] flex-shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-[#B8C2CC] font-light leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Have a Production Inquiry?</h3>
              <p className="text-xs text-[#B8C2CC]">Let's discuss your script, commercial, or creative vision in Dehradun.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              Contact Studio Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
