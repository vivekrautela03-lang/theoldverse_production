"use client";

import React from "react";
import Link from "next/link";
import { Shield, Eye, Database, Cookie, Share2, Key, Users, BookOpen, Mail, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "intro",
      title: "1. Introduction",
      icon: Shield,
      content: "Welcome to The OldVerse. We are committed to protecting your privacy and ensuring that your personal information is handled responsibly. This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit our website or contact us."
    },
    {
      id: "collect",
      title: "2. Information We Collect",
      icon: Eye,
      content: "We may collect:",
      list: [
        "Full Name",
        "Email Address",
        "Phone Number",
        "Messages submitted through contact forms",
        "Project inquiry details",
        "Browser and device information",
        "IP Address",
        "Website usage statistics",
        "Cookies and analytics data"
      ]
    },
    {
      id: "usage",
      title: "3. How We Use Your Information",
      icon: Database,
      content: "We use your information to:",
      list: [
        "Respond to inquiries",
        "Communicate regarding projects and collaborations",
        "Improve our website and user experience",
        "Provide customer support",
        "Maintain website security",
        "Analyze website performance",
        "Prevent fraud and misuse"
      ],
      footerNote: "We do not sell, rent, or trade your personal information to third parties."
    },
    {
      id: "cookies",
      title: "4. Cookies",
      icon: Cookie,
      content: "Our website may use cookies and similar technologies to:",
      list: [
        "Improve website functionality",
        "Remember user preferences",
        "Analyze website traffic",
        "Enhance browsing experience"
      ],
      footerNote: "Users can disable cookies through their browser settings."
    },
    {
      id: "thirdparty",
      title: "5. Third-Party Services",
      icon: Share2,
      content: "Our website may use trusted third-party services including:",
      list: [
        "Vercel (hosting)",
        "Supabase (backend services)",
        "Google Analytics (visitor traffic analytics)",
        "WhatsApp (communication link)",
        "Instagram (social updates embed)",
        "YouTube (video playback embeds)"
      ],
      footerNote: "These services may collect and process information according to their own privacy policies."
    },
    {
      id: "security",
      title: "6. Data Security",
      icon: Key,
      content: "We implement reasonable technical and organizational security measures to protect your information. While we strive to protect your data, no internet transmission or storage system is completely secure."
    },
    {
      id: "rights",
      title: "7. Your Rights",
      icon: Users,
      content: "You have the right to:",
      list: [
        "Request access to your personal information",
        "Request corrections to incorrect data",
        "Request deletion of your data",
        "Contact us regarding privacy concerns"
      ]
    },
    {
      id: "children",
      title: "8. Children's Privacy",
      icon: Shield,
      content: "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children."
    },
    {
      id: "changes",
      title: "9. Changes to This Privacy Policy",
      icon: BookOpen,
      content: "This Privacy Policy may be updated periodically. Any changes will be reflected on this page with an updated revision date."
    }
  ];

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Back navigation */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-grotesk font-semibold uppercase tracking-wider text-oldverse-secondary hover:text-oldverse-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold text-oldverse-accent uppercase tracking-widest block bg-oldverse-accent/15 px-3 py-1 rounded-full w-fit mx-auto border border-oldverse-accent/25">
            Legal Center
          </span>
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none cinematic-glow">
            Privacy Policy
          </h1>
          <p className="text-oldverse-secondary text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Your privacy matters to us. Learn how The OldVerse collects, uses, and protects your information.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-oldverse-secondary font-grotesk tracking-wider">
            <span>Last Updated:</span>
            <span className="font-bold text-oldverse-text">June 27, 2026</span>
          </div>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Content Section cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="glassmorphism-card p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 hover:border-oldverse-accent/25 transition-all relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-oldverse-accent/15 border border-oldverse-accent/25 rounded-lg flex items-center justify-center text-oldverse-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text">
                      {section.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-oldverse-secondary font-light leading-relaxed">
                    {section.content}
                  </p>

                  {section.list && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-oldverse-secondary font-light pl-4 list-disc marker:text-oldverse-accent">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="leading-tight">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {section.footerNote && (
                  <p className="text-[10px] text-oldverse-accent/80 font-grotesk tracking-wide border-t border-white/5 pt-3 mt-2 font-medium">
                    {section.footerNote}
                  </p>
                )}
              </div>
            );
          })}

          {/* Section 10: Contact Us (Full span card) */}
          <div className="md:col-span-2 glassmorphism p-8 sm:p-10 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="h-32 w-32 text-white" />
            </div>
            <div>
              <h3 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-3">
                <Mail className="h-6 w-6 text-oldverse-accent" />
                10. Contact Us
              </h3>
              <p className="text-xs text-oldverse-secondary font-light mt-2">
                If you have any questions or feedback regarding this Privacy Policy, please feel free to connect with our legal officers:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Studio Name</span>
                <span className="text-xs font-semibold text-oldverse-text block">The OldVerse</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Email Address</span>
                <a href="mailto:theoldverse@gmail.com" className="text-xs font-semibold text-oldverse-text hover:text-oldverse-accent transition-colors block">theoldverse@gmail.com</a>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Phone Number</span>
                <a href="tel:+919068850966" className="text-xs font-semibold text-oldverse-text hover:text-oldverse-accent transition-colors block">+91 9068850966</a>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Social Direct</span>
                <div className="flex gap-3 pt-1">
                  <a href="https://instagram.com/theoldverse_" target="_blank" rel="noreferrer" className="text-oldverse-secondary hover:text-oldverse-accent transition-all hover:scale-105">
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="https://youtube.com/@theoldverse_07" target="_blank" rel="noreferrer" className="text-oldverse-secondary hover:text-oldverse-accent transition-all hover:scale-105">
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Acknowledgement Statement */}
        <div className="text-center max-w-xl mx-auto border-t border-white/5 pt-8">
          <p className="text-[10px] text-oldverse-secondary/80 font-grotesk tracking-wide leading-relaxed">
            By using The OldVerse website, you acknowledge that you have read and agreed to this Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
}
