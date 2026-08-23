import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Users, ArrowRight, ShieldCheck, User, ExternalLink } from "lucide-react";
import { constructMetadata, getOrganizationSchema, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Filmmakers & Team | TheOldverse Productions",
  description: "Meet the official team behind TheOldverse Productions in Dehradun: Vivek Rautela (Founder/Director), Shivanshi Rauthan (Co-Founder/Creative Lead), Shivansh Mourya (Editor/Screenplay Writer), and Ujjawal Gurung (Camera Head/Cinematographer).",
  path: "/team"
});

const teamMembers = [
  {
    name: "Vivek Rautela",
    role: "Founder · Writer · Director · Producer",
    bio: "Founder of TheOldverse Productions. Director, producer, and scriptwriter focused on building powerful cinematic stories.",
    url: "/founders/vivek-rautela",
    image: "/images/founders/vivek-rautela-founder-theoldverse-productions.webp"
  },
  {
    name: "Shivanshi Rauthan",
    role: "Co-Founder · Director · Producer · Creative Lead",
    bio: "Co-Founder of TheOldverse Productions leading visual direction and creative production across films and digital media.",
    url: "/founders/shivanshi-rauthan",
    image: ""
  },
  {
    name: "Shivansh Mourya",
    role: "Editor & Screenplay Writer",
    bio: "Editor and screenplay writer at TheOldverse Productions crafting narrative screenplays, video edits, and visual storytelling.",
    url: "/founders/shivansh-mourya",
    image: ""
  },
  {
    name: "Ujjawal Gurung",
    role: "Camera Team Head & Cinematographer",
    bio: "Camera team head and cinematographer at TheOldverse Productions leading camera operations, lighting design, and visual aesthetics.",
    url: "/founders/ujjawal-gurung",
    image: ""
  }
];

export default function TeamHubPage() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Team", url: "/team" }
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
            <ShieldCheck className="h-4 w-4" />
            <span>STUDIO TEAM & CREATIVE LEADERSHIP</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
            Meet The Oldverse Team
          </h1>
          <p className="text-xs sm:text-sm text-[#B8C2CC] font-light leading-relaxed">
            The directors, writers, cinematographers, and editors driving original cinematic productions at TheOldverse Productions in Dehradun.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((m) => (
            <div
              key={m.name}
              className="bg-[#0B0E13] border border-white/10 hover:border-[#8DBEFF]/40 rounded-2xl p-6 text-center space-y-4 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white/15 mx-auto bg-black flex items-center justify-center">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-[#8DBEFF]" />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-lg text-white">{m.name}</h2>
                  <span className="text-[10px] text-[#8DBEFF] font-semibold uppercase tracking-wider font-mono block mt-0.5">
                    {m.role}
                  </span>
                  <p className="text-xs text-[#B8C2CC] font-light mt-3 leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href={m.url}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8DBEFF] uppercase tracking-wider hover:underline"
                >
                  <span>View Profile & Work</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
