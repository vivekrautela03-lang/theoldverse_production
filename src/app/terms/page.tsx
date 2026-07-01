"use client";

import React from "react";
import Link from "next/link";
import { Landmark, ShieldAlert, FileText, CheckCircle, Scale, ExternalLink, AlertTriangle, UserX, HelpCircle, Mail, ArrowLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
  const sections = [
    {
      id: "usage",
      title: "1. Website Usage",
      icon: FileText,
      content: "By accessing and browsing The OldVerse website, you agree to comply with and be bound by these Terms & Conditions. If you disagree with any part of these terms, you must not use our website."
    },
    {
      id: "intellectual",
      title: "2. Intellectual Property",
      icon: Scale,
      content: "All content displayed on this website, including but not limited to films, videos, screenplays, text, photographs, graphics, logos, and software, is the property of The OldVerse or its content creators and is protected by international copyright, trademark, and intellectual property laws."
    },
    {
      id: "copyright",
      title: "3. Copyright & Licensing",
      icon: Landmark,
      content: "No material from this website may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed in any way without prior written permission from The OldVerse. Unauthorized use of any material may violate copyright laws and lead to legal action."
    },
    {
      id: "user-resp",
      title: "4. User Responsibilities",
      icon: CheckCircle,
      content: "Users are responsible for ensuring that their access to and use of this site is legal and does not infringe upon any local regulations. You agree to use the site only for lawful purposes."
    },
    {
      id: "acceptable",
      title: "5. Acceptable Use Policy",
      icon: ShieldAlert,
      content: "You must not use this website in any way that causes, or may cause, damage to the website or impairment of its availability or accessibility, or in any way which is unlawful, illegal, fraudulent, or harmful."
    },
    {
      id: "third-party",
      title: "6. Third-Party Links",
      icon: ExternalLink,
      content: "Our website contains links to external platforms (such as YouTube, Instagram, and WhatsApp) which are not operated by us. We hold no responsibility or liability for the content, privacy policies, or practices of any third-party websites."
    },
    {
      id: "disclaimer",
      title: "7. Disclaimer of Warranties",
      icon: AlertTriangle,
      content: "This website is provided 'as is' without any representations or warranties, express or implied. The OldVerse makes no representations or warranties in relation to this website or the information and materials provided on this website."
    },
    {
      id: "liability",
      title: "8. Limitation of Liability",
      icon: UserX,
      content: "The OldVerse will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any direct, indirect, special, or consequential loss."
    },
    {
      id: "termination",
      title: "9. Termination of Use",
      icon: UserX,
      content: "We reserve the right to restrict or terminate your access to our website or any of its features at any time without notice, particularly if we believe you have breached these Terms & Conditions."
    },
    {
      id: "governing",
      title: "10. Governing Law",
      icon: HelpCircle,
      content: "These Terms & Conditions will be governed by and construed in accordance with the laws of India, and any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts in Dehradun, Uttarakhand."
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
            Terms & Conditions
          </h1>
          <p className="text-oldverse-secondary text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Please read these terms carefully before exploring our digital archives.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-oldverse-secondary font-grotesk tracking-wider">
            <span>Last Updated:</span>
            <span className="font-bold text-oldverse-text">June 27, 2026</span>
          </div>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* Grid of Sections */}
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
                </div>
              </div>
            );
          })}

          {/* Section 11: Contact Us (Full span card) */}
          <div className="md:col-span-2 glassmorphism p-8 sm:p-10 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Scale className="h-32 w-32 text-white" />
            </div>
            <div>
              <h3 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase border-b border-white/5 pb-2 flex items-center gap-3">
                <Mail className="h-6 w-6 text-oldverse-accent" />
                11. Contact Information
              </h3>
              <p className="text-xs text-oldverse-secondary font-light mt-2">
                For any clarifications regarding our Terms & Conditions, please contact us:
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
                <span className="text-[9px] uppercase font-bold text-oldverse-accent font-grotesk tracking-wider block">Social Channels</span>
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
            By using this website, you acknowledge that you agree to be bound by these Terms & Conditions.
          </p>
        </div>

      </div>
    </div>
  );
}
