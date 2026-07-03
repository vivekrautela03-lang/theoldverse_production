"use client";

import React from "react";
import Link from "next/link";
import { Users, ShieldAlert, Heart, Info, ArrowLeft, Mail, Shield } from "lucide-react";

export default function CommunityGuidelinesPage() {
  const sections = [
    {
      id: "respect",
      title: "1. Respect Each Other",
      icon: Heart,
      content: "TheOldverse is a creative space for filmmakers, actors, crew, and fans. We strictly prohibit harassment, hate speech, bullying, threat of violence, or defamatory remarks toward any member of the community."
    },
    {
      id: "safety",
      title: "2. Content Safety",
      icon: ShieldAlert,
      content: "Ensure all uploaded materials (short films, casting details, posts, comments) are safe for the intended audience. Explicit adult content, gratuitous violence, drug usage promotions, or illegal operations are strictly prohibited."
    },
    {
      id: "collaboration",
      title: "3. Professionalism in Casting",
      icon: Users,
      content: "Casting calls and project inquiries must represent real opportunities with transparent details (budget, location, guidelines). Impersonation, fake job postings, or fraudulent representation will lead to immediate account termination."
    }
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-grotesk tracking-wider uppercase text-oldverse-secondary hover:text-oldverse-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block font-grotesk">Community Portal</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="font-bebas text-5xl sm:text-6xl tracking-wider text-oldverse-text uppercase">
            Community Guidelines
          </h1>
          <p className="text-sm font-light text-oldverse-secondary max-w-2xl leading-relaxed">
            These rules are designed to keep TheOldverse a safe, collaborative, and highly creative platform for creators worldwide.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="font-bebas text-2xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-3">
                  <Icon className="h-5.5 w-5.5 text-oldverse-accent" />
                  {section.title}
                </h3>
                <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                  {section.content}
                </p>
              </div>
            );
          })}

          {/* Reporting abuse info card */}
          <div className="md:col-span-2 glassmorphism p-8 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="h-32 w-32 text-white" />
            </div>
            <div>
              <h3 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-oldverse-accent" />
                Report an Infraction
              </h3>
              <p className="text-xs text-oldverse-secondary font-light mt-2">
                If you encounter any posts, casting applications, or comments violating these guidelines, report them immediately to our moderation board:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Moderation Email</span>
                <a href="mailto:theoldverse@gmail.com" className="text-xs font-semibold text-oldverse-text hover:text-oldverse-accent transition-colors block">theoldverse@gmail.com</a>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Response Time</span>
                <span className="text-xs font-semibold text-oldverse-text block">Within 24 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Acknowledgement */}
        <div className="text-center max-w-xl mx-auto border-t border-white/5 pt-8">
          <p className="text-[10px] text-oldverse-secondary/80 font-grotesk tracking-wide leading-relaxed">
            By engaging in TheOldverse platform, you agree to uphold this code of conduct.
          </p>
        </div>
      </div>
    </div>
  );
}
