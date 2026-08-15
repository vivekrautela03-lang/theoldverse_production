import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Film, MapPin, ShieldCheck, Camera, ArrowRight, UserCheck } from "lucide-react";

export const metadata = {
  title: "Shivanshi Rauthan — Co-Founder, Director & Producer | TheOldverse Productions",
  description: "Shivanshi Rauthan is the Co-Founder, Director and Producer of TheOldverse Productions, an independent creative production house based in Dehradun, Uttarakhand.",
  alternates: {
    canonical: "https://theoldverse-productions.in/founders/shivanshi-rauthan",
  },
  openGraph: {
    title: "Shivanshi Rauthan — Co-Founder, Director & Producer | TheOldverse Productions",
    description: "Shivanshi Rauthan is the Co-Founder, Director and Producer of TheOldverse Productions, an independent creative production house based in Dehradun, Uttarakhand.",
    url: "https://theoldverse-productions.in/founders/shivanshi-rauthan",
    siteName: "TheOldverse Productions",
    type: "profile",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function ShivanshiRauthanProfilePage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://theoldverse-productions.in/founders/shivanshi-rauthan#webpage",
        "url": "https://theoldverse-productions.in/founders/shivanshi-rauthan",
        "name": "Shivanshi Rauthan — Co-Founder, Director & Producer | TheOldverse Productions",
        "description": "Official profile of Shivanshi Rauthan, Co-Founder, Director and Producer at TheOldverse Productions.",
        "mainEntity": {
          "@type": "Person",
          "@id": "https://theoldverse-productions.in/founders/shivanshi-rauthan#person",
          "name": "Shivanshi Rauthan",
          "givenName": "Shivanshi",
          "familyName": "Rauthan",
          "jobTitle": "Co-Founder, Director & Producer",
          "description": "Shivanshi Rauthan is the Co-Founder, Director and Producer of TheOldverse Productions, an independent creative production house based in Dehradun, Uttarakhand.",
          "url": "https://theoldverse-productions.in/founders/shivanshi-rauthan",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dehradun",
            "addressRegion": "Uttarakhand",
            "addressCountry": "India"
          },
          "worksFor": {
            "@type": "Organization",
            "@id": "https://theoldverse-productions.in/#organization",
            "name": "TheOldverse Productions",
            "url": "https://theoldverse-productions.in",
            "logo": "https://theoldverse-productions.in/favicon.png"
          },
          "knowsAbout": [
            "Visual Direction",
            "Film Directing",
            "Creative Production",
            "Filmmaking",
            "Storytelling"
          ]
        }
      },
      {
        "@type": "Organization",
        "@id": "https://theoldverse-productions.in/#organization",
        "name": "TheOldverse Productions",
        "url": "https://theoldverse-productions.in",
        "logo": "https://theoldverse-productions.in/favicon.png",
        "founder": [
          {
            "@type": "Person",
            "name": "Vivek Rautela",
            "url": "https://theoldverse-productions.in/founders/vivek-rautela"
          },
          {
            "@type": "Person",
            "name": "Shivanshi Rauthan",
            "url": "https://theoldverse-productions.in/founders/shivanshi-rauthan"
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-20 font-grotesk text-white">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#8DBEFF] uppercase tracking-wider">
          <Link href="/" className="hover:underline text-[#B8C2CC]">Home</Link>
          <span>/</span>
          <Link href="/about" className="hover:underline text-[#B8C2CC]">About</Link>
          <span>/</span>
          <span className="text-white font-bold">Shivanshi Rauthan</span>
        </nav>

        {/* Header Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0B0E13] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          {/* Photo Coming Soon Placeholder */}
          <div className="md:col-span-5 flex justify-center">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 max-w-sm w-full aspect-[4/5] flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
              <div className="h-20 w-20 rounded-full bg-[#8DBEFF]/10 border border-[#8DBEFF]/20 flex items-center justify-center text-[#8DBEFF]">
                <Camera className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <span className="font-bebas text-lg tracking-wider uppercase text-white block">
                  Photo Coming Soon
                </span>
                <p className="text-[11px] text-[#B8C2CC] font-light">
                  Official studio portrait update pending.
                </p>
              </div>
            </div>
          </div>

          {/* Core Info & Roles */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DBEFF] uppercase tracking-widest mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>OFFICIAL CO-FOUNDER PROFILE</span>
              </div>
              <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
                Shivanshi Rauthan
              </h1>
              <p className="text-sm sm:text-base font-semibold text-[#8DBEFF] mt-2">
                Co-Founder · Director · Producer · Creative Lead
              </p>
              <p className="text-xs text-[#B8C2CC] uppercase tracking-wider font-mono mt-0.5">
                TheOldverse Productions
              </p>
            </div>

            {/* Quick Fact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/[0.03] border border-white/5 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  <UserCheck className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>Studio Role</span>
                </div>
                <p className="font-bold text-white">Co-Founder & Creative Lead</p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  <MapPin className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>Location</span>
                </div>
                <p className="font-bold text-white">Dehradun, Uttarakhand, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Biography Section */}
        <section className="bg-[#0B0E13] border border-white/5 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase border-b border-white/5 pb-3 flex items-center gap-2">
            <Film className="h-6 w-6 text-[#8DBEFF]" />
            <span>Biography & Creative Direction</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm font-light text-[#B8C2CC] leading-relaxed">
            <p>
              <strong className="text-white font-semibold">Shivanshi Rauthan</strong> is the Co-Founder, Director, and Producer of <strong className="text-white font-semibold">TheOldverse Productions</strong>, an independent creative studio based in Dehradun, Uttarakhand.
            </p>
            <p>
              As the creative lead of the studio, Shivanshi drives the visual direction and narrative integrity behind the production house's slate of films, digital content, and collaborative projects. Her passion for storytelling, visual composition, and artistic excellence shapes every production from development through post-production.
            </p>
            <p>
              Under her leadership alongside co-founder Vivek Rautela, TheOldverse Productions fosters an inclusive, innovative filmmaking ecosystem across North India.
            </p>
          </div>
        </section>

        {/* Navigation & Related Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs">
          <Link
            href="/founders/vivek-rautela"
            className="flex items-center gap-2 text-[#8DBEFF] hover:underline font-bold uppercase tracking-wider"
          >
            <span>View Founder Profile (Vivek Rautela)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/about"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <span>Explore TheOldverse Studio & Team</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
