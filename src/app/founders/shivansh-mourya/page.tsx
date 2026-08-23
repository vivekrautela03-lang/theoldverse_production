import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Film, MapPin, GraduationCap, Calendar, Award, ArrowRight, ShieldCheck, User } from "lucide-react";

export const metadata = {
  title: "Shivansh Mourya — Director & Creative Producer | TheOldverse Productions",
  description: "Shivansh Mourya is a Director and Creative Producer at TheOldverse Productions, an independent film production studio based in Dehradun, Uttarakhand.",
  alternates: {
    canonical: "https://theoldverse-productions.in/founders/shivansh-mourya",
  },
  openGraph: {
    title: "Shivansh Mourya — Director & Creative Producer | TheOldverse Productions",
    description: "Shivansh Mourya is a Director and Creative Producer at TheOldverse Productions, an independent film production studio based in Dehradun, Uttarakhand.",
    url: "https://theoldverse-productions.in/founders/shivansh-mourya",
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

export default function ShivanshMouryaProfilePage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://theoldverse-productions.in/founders/shivansh-mourya#webpage",
        "url": "https://theoldverse-productions.in/founders/shivansh-mourya",
        "name": "Shivansh Mourya — Director & Creative Producer | TheOldverse Productions",
        "description": "Official profile of Shivansh Mourya, Director and Creative Producer at TheOldverse Productions.",
        "mainEntity": {
          "@type": "Person",
          "@id": "https://theoldverse-productions.in/founders/shivansh-mourya#person",
          "name": "Shivansh Mourya",
          "givenName": "Shivansh",
          "familyName": "Mourya",
          "jobTitle": "Director & Creative Producer",
          "description": "Shivansh Mourya is a Director and Creative Producer at TheOldverse Productions, an independent film production studio based in Dehradun, Uttarakhand.",
          "url": "https://theoldverse-productions.in/founders/shivansh-mourya",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#8DBEFF]">
          <Link href="/" className="hover:underline text-[#B8C2CC]">Home</Link>
          <span>/</span>
          <Link href="/about" className="hover:underline text-[#B8C2CC]">About</Link>
          <span>/</span>
          <span className="text-white font-bold">Shivansh Mourya</span>
        </nav>

        {/* Header Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0B0E13] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Avatar Container */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black max-w-sm w-full aspect-[4/5] flex items-center justify-center">
              <div className="h-full w-full bg-white/5 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="h-24 w-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-[#8DBEFF] shadow-xl">
                  <User className="h-12 w-12" />
                </div>
                <span className="text-xs font-mono text-[#8DBEFF] uppercase font-bold tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  STUDIO TEAM MEMBER
                </span>
              </div>
            </div>
          </div>

          {/* Core Info & Bio */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DBEFF] uppercase tracking-widest mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>OFFICIAL TEAM PROFILE</span>
              </div>
              <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
                Shivansh Mourya
              </h1>
              <p className="text-sm sm:text-base font-semibold text-[#8DBEFF] mt-2">
                Director & Creative Producer
              </p>
              <p className="text-xs text-[#B8C2CC] uppercase tracking-wider font-mono mt-0.5">
                TheOldverse Productions
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#B8C2CC] font-light leading-relaxed">
              <strong className="text-white font-semibold">Shivansh Mourya</strong> is a Director and Creative Producer at <strong className="text-white font-semibold">TheOldverse Productions</strong>, an independent creative studio based in Dehradun, Uttarakhand.
            </p>

            <p className="text-xs sm:text-sm text-[#B8C2CC] font-light leading-relaxed">
              Shivansh drives the development of compelling film narratives, visual storytelling, and creative production pipelines. He collaborates closely with directors, writers, and crew to transform high-concept ideas into finished cinematic productions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  <Film className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>Primary Role</span>
                </div>
                <p className="font-bold text-white">Director & Producer</p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  <MapPin className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>Location</span>
                </div>
                <p className="font-bold text-white">Dehradun, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-4 flex justify-between items-center border-t border-white/10">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBEFF] uppercase tracking-wider hover:underline"
          >
            <span>← Back to Studio About & Team Roster</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
