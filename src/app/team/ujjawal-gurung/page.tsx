import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Film, MapPin, GraduationCap, Calendar, Award, ArrowRight, ShieldCheck, User, Camera } from "lucide-react";

export const metadata = {
  title: "Ujjawal Gurung — Camera Team Head & Cinematographer | TheOldverse Productions",
  description: "Ujjawal Gurung is the Camera Team Head and Lead Cinematographer at TheOldverse Productions, an independent film production studio based in Dehradun, Uttarakhand.",
  alternates: {
    canonical: "https://theoldverse-productions.in/team/ujjawal-gurung",
  },
  openGraph: {
    title: "Ujjawal Gurung — Camera Team Head & Cinematographer | TheOldverse Productions",
    description: "Ujjawal Gurung is the Camera Team Head and Lead Cinematographer at TheOldverse Productions, an independent film production studio based in Dehradun, Uttarakhand.",
    url: "https://theoldverse-productions.in/team/ujjawal-gurung",
    siteName: "TheOldverse Productions",
    locale: "en_IN",
    type: "profile",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export default function UjjawalGurungProfilePage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://theoldverse-productions.in/team/ujjawal-gurung#webpage",
        "url": "https://theoldverse-productions.in/team/ujjawal-gurung",
        "name": "Ujjawal Gurung — Camera Team Head & Cinematographer | TheOldverse Productions",
        "description": "Official profile of Ujjawal Gurung, Camera Team Head and Lead Cinematographer at TheOldverse Productions.",
        "mainEntity": {
          "@type": "Person",
          "@id": "https://theoldverse-productions.in/team/ujjawal-gurung#person",
          "name": "Ujjawal Gurung",
          "givenName": "Ujjawal",
          "familyName": "Gurung",
          "jobTitle": "Camera Team Head & Cinematographer",
          "description": "Ujjawal Gurung is the Camera Team Head and Lead Cinematographer at TheOldverse Productions, an independent film production studio based in Dehradun, Uttarakhand.",
          "url": "https://theoldverse-productions.in/team/ujjawal-gurung",
          "worksFor": {
            "@type": "Organization",
            "@id": "https://theoldverse-productions.in/#organization",
            "name": "TheOldverse Productions",
            "url": "https://theoldverse-productions.in"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dehradun",
            "addressRegion": "Uttarakhand",
            "addressCountry": "India"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theoldverse-productions.in" },
          { "@type": "ListItem", "position": 2, "name": "Team", "item": "https://theoldverse-productions.in/team" },
          { "@type": "ListItem", "position": 3, "name": "Ujjawal Gurung", "item": "https://theoldverse-productions.in/team/ujjawal-gurung" }
        ]
      }
    ]
  };

  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-20 font-grotesk text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#8DBEFF]">
          <Link href="/" className="hover:underline text-[#B8C2CC]">Home</Link>
          <span>/</span>
          <Link href="/team" className="hover:underline text-[#B8C2CC]">Team</Link>
          <span>/</span>
          <span className="text-white font-bold">Ujjawal Gurung</span>
        </nav>

        {/* Header Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0B0E13] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Avatar Container */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black max-w-sm w-full aspect-[4/5] flex items-center justify-center">
              <div className="h-full w-full bg-white/5 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-24 w-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-[#8DBEFF] shadow-xl">
                  <Camera className="h-12 w-12" />
                </div>
                <span className="text-xs font-mono text-[#8DBEFF] uppercase font-bold tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  STUDIO TEAM MEMBER
                </span>
              </div>
            </div>
          </div>

          {/* Core Info & Bio */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8DBEFF]">
                <ShieldCheck className="h-4 w-4" />
                <span className="uppercase font-bold tracking-widest">OFFICIAL STUDIO TEAM PROFILE</span>
              </div>
              <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
                Ujjawal Gurung
              </h1>
              <p className="text-sm font-semibold text-[#8DBEFF] font-mono tracking-wide uppercase">
                Camera Team Head & Cinematographer
              </p>
            </div>

            <p className="text-sm text-[#B8C2CC] font-light leading-relaxed">
              <strong className="text-white font-semibold">Ujjawal Gurung</strong> is the Camera Team Head and Lead Cinematographer at <strong className="text-white font-semibold">TheOldverse Productions</strong>, an independent film production studio based in Dehradun, Uttarakhand.
            </p>

            <p className="text-sm text-[#B8C2CC] font-light leading-relaxed">
              Ujjawal oversees camera department operations, lens selections, lighting setups, and visual atmosphere across all short films, commercials, and visual storytelling projects.
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono text-[#B8C2CC]">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin className="h-3.5 w-3.5 text-[#8DBEFF]" />
                <span>Dehradun, Uttarakhand</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Film className="h-3.5 w-3.5 text-[#8DBEFF]" />
                <span>Cinematography & Camera Operations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
