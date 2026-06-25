"use client";

import React from "react";
import { Users, Mail, Globe, ArrowUpRight } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  email: string;
  website?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Shivanshi",
    role: "Co-Founder & Creative Director",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&fit=crop",
    bio: "Independent filmmaker and producer. Shivanshi leads the creative vision, content curation, and visual direction of all platform originals.",
    email: "shivanshi@theoldverse.com",
    website: "https://shivanshi.film"
  },
  {
    name: "Vivek Rautela",
    role: "Co-Founder & Lead Systems Architect",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
    bio: "Lead software engineer and systems architect. Vivek drives the development of the custom video player, collaborative pitch workspace, and streaming nodes.",
    email: "vivek@theoldverse.com"
  },
  {
    name: "Rishika",
    role: "Head of Casting & Community",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop",
    bio: "Producer and community manager. Rishika guides the Casting Call boards, manages actor auditions, and fosters writer collaborations in the Writing Room.",
    email: "rishika@theoldverse.com"
  },
  {
    name: "Prince",
    role: "Chief Cinematography Coordinator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
    bio: "Veteran Director of Photography. Prince consults on video player high-framerate rendering, visual styling guidelines, and photography portfolios.",
    email: "prince@theoldverse.com"
  },
  {
    name: "Priya Karanwal",
    role: "Director of Content Operations",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop",
    bio: "Transcoding and curation operations lead. Priya manages the video submission vetting process and ensures uploaded projects adhere to encoding guidelines.",
    email: "priya@theoldverse.com"
  }
];

export default function TeamPage() {
  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none">
            Meet the Visionaries
          </h1>
          <p className="text-oldverse-accent font-grotesk text-xs sm:text-sm uppercase tracking-widest font-semibold">
            The Team Behind The Lens
          </p>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="glassmorphism-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Avatar & Role Header */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-grotesk text-base font-bold text-oldverse-text">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Action Buttons / Contact Details */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-grotesk">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-oldverse-secondary hover:text-oldverse-accent transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
                
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-oldverse-accent hover:text-oldverse-accent-secondary transition-colors"
                  >
                    <span>Website</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
