"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, FileText, Send, Info, Mail, ArrowLeft, Shield } from "lucide-react";

export default function DmcaPolicyPage() {
  const sections = [
    {
      id: "intro",
      title: "1. DMCA Notice",
      icon: Info,
      content: "TheOldverse respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond quickly to claims of copyright infringement committed on our platform."
    },
    {
      id: "claim",
      title: "2. Filing a Claim",
      icon: FileText,
      content: "If you are a copyright owner or authorized agent, please report alleged infringement by submitting a notice containing the following details to our designated agent:",
      list: [
        "Identification of the copyrighted work claimed to have been infringed.",
        "Identification of the material that is claimed to be infringing (including URLs).",
        "Your contact information (name, address, telephone number, and email).",
        "A statement that you have a good faith belief that the use of the material is not authorized.",
        "A statement that the information in the notification is accurate, under penalty of perjury.",
        "A physical or electronic signature of the copyright owner or authorized representative."
      ]
    },
    {
      id: "counter",
      title: "3. Counter-Notifications",
      icon: AlertTriangle,
      content: "If your content was removed due to a DMCA claim and you believe this was an error, you may submit a counter-notice. Your counter-notice must include your contact details, identification of the removed material, a statement under penalty of perjury that the removal was a mistake, and your consent to local federal court jurisdiction."
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
          <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block font-grotesk">Legal Portal</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="font-bebas text-5xl sm:text-6xl tracking-wider text-oldverse-text uppercase">
            DMCA & Copyright Policy
          </h1>
          <p className="text-sm font-light text-oldverse-secondary max-w-2xl leading-relaxed">
            Please read this policy carefully. It governs how we handle copyright infringement claims and protects creator rights on TheOldverse platform.
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
                {section.list && (
                  <ul className="list-disc pl-5 space-y-2 text-xs text-oldverse-secondary/90 font-light">
                    {section.list.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          {/* Contact Agent Info card */}
          <div className="md:col-span-2 glassmorphism p-8 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="h-32 w-32 text-white" />
            </div>
            <div>
              <h3 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-3">
                <Mail className="h-6 w-6 text-oldverse-accent" />
                Submit Infringement Notice
              </h3>
              <p className="text-xs text-oldverse-secondary font-light mt-2">
                All infringement notifications should be directed to our copyright agent:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Agent Name</span>
                <span className="text-xs font-semibold text-oldverse-text block">Copyright Agent</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Email Address</span>
                <a href="mailto:theoldverse@gmail.com" className="text-xs font-semibold text-oldverse-text hover:text-oldverse-accent transition-colors block">theoldverse@gmail.com</a>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Phone Line</span>
                <a href="tel:+919068850966" className="text-xs font-semibold text-oldverse-text hover:text-oldverse-accent transition-colors block">+91 9068850966</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Acknowledgement */}
        <div className="text-center max-w-xl mx-auto border-t border-white/5 pt-8">
          <p className="text-[10px] text-oldverse-secondary/80 font-grotesk tracking-wide leading-relaxed">
            By accessing TheOldverse services, you agree to respect the intellectual property of all creators.
          </p>
        </div>
      </div>
    </div>
  );
}
