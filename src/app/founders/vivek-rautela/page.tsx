import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Film, MapPin, GraduationCap, Calendar, Award, ArrowRight, ShieldCheck, User } from "lucide-react";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export const metadata = {
  title: "Vivek Rautela — Founder, Writer, Director & Producer | TheOldverse Productions",
  description: "Vivek Rautela is a Dehradun-based filmmaker, writer, director and producer, and the Founder of TheOldverse Productions. He is currently pursuing a BBA at Uttaranchal University.",
  alternates: {
    canonical: "https://theoldverse-productions.in/founders/vivek-rautela",
  },
  openGraph: {
    title: "Vivek Rautela — Founder, Writer, Director & Producer | TheOldverse Productions",
    description: "Vivek Rautela is a Dehradun-based filmmaker, writer, director and producer, and the Founder of TheOldverse Productions.",
    url: "https://theoldverse-productions.in/founders/vivek-rautela",
    siteName: "TheOldverse Productions",
    type: "profile",
    images: [
      {
        url: "https://theoldverse-productions.in/images/founders/vivek-rautela-founder-theoldverse-productions.webp",
        width: 1200,
        height: 675,
        alt: "Vivek Rautela, Founder, Writer, Director and Producer of TheOldverse Productions",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function VivekRautelaProfilePage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://theoldverse-productions.in/founders/vivek-rautela#webpage",
        "url": "https://theoldverse-productions.in/founders/vivek-rautela",
        "name": "Vivek Rautela — Founder, Writer, Director & Producer | TheOldverse Productions",
        "description": "Official profile of Vivek Rautela, Founder, Writer, Director and Producer at TheOldverse Productions.",
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://theoldverse-productions.in/images/founders/vivek-rautela-founder-theoldverse-productions.webp#primaryimage",
          "url": "https://theoldverse-productions.in/images/founders/vivek-rautela-founder-theoldverse-productions.webp",
          "contentUrl": "https://theoldverse-productions.in/images/founders/vivek-rautela-founder-theoldverse-productions.webp",
          "caption": "Vivek Rautela, Founder, Writer, Director and Producer of TheOldverse Productions"
        },
        "mainEntity": {
          "@type": "Person",
          "@id": "https://theoldverse-productions.in/founders/vivek-rautela#person",
          "name": "Vivek Rautela",
          "givenName": "Vivek",
          "familyName": "Rautela",
          "jobTitle": "Founder, Writer, Director & Producer",
          "description": "Vivek Rautela is a Dehradun-based filmmaker, writer, director and producer, and the Founder of TheOldverse Productions. He is currently pursuing a BBA at Uttaranchal University.",
          "image": "https://theoldverse-productions.in/images/founders/vivek-rautela-founder-theoldverse-productions.webp",
          "url": "https://theoldverse-productions.in/founders/vivek-rautela",
          "birthDate": "2007-07-10",
          "sameAs": [
            "https://instagram.com/psf_vivek"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dehradun",
            "addressRegion": "Uttarakhand",
            "addressCountry": "India"
          },
          "almaMater": {
            "@type": "EducationalOrganization",
            "name": "Uttaranchal University",
            "url": "https://www.uttaranchaluniversity.ac.in"
          },
          "worksFor": {
            "@type": "Organization",
            "@id": "https://theoldverse-productions.in/#organization",
            "name": "TheOldverse Productions",
            "url": "https://theoldverse-productions.in",
            "logo": "https://theoldverse-productions.in/favicon.png"
          },
          "knowsAbout": [
            "Filmmaking",
            "Film Directing",
            "Screenwriting",
            "Film Production",
            "Cinematography",
            "Independent Cinema"
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
          <span className="text-white font-bold">Vivek Rautela</span>
        </nav>

        {/* Header Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0B0E13] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          {/* Portrait Image Container */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black max-w-sm w-full">
              <img
                src="/images/founders/vivek-rautela-founder-theoldverse-productions.webp"
                alt="Vivek Rautela, Founder, Writer, Director and Producer of TheOldverse Productions"
                width={1200}
                height={675}
                className="w-full h-auto object-cover aspect-[4/5] transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8DBEFF] font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  Official Studio Portrait
                </span>
              </div>
            </div>
          </div>

          {/* Core Info & Bios */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DBEFF] uppercase tracking-widest mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>OFFICIAL FOUNDER PROFILE</span>
              </div>
              <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
                Vivek Rautela
              </h1>
              <p className="text-sm sm:text-base font-semibold text-[#8DBEFF] mt-2">
                Founder · Writer · Director · Producer
              </p>
              <p className="text-xs text-[#B8C2CC] uppercase tracking-wider font-mono mt-0.5">
                TheOldverse Productions
              </p>
            </div>

            {/* Quick Fact Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  <Calendar className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>Age / DOB</span>
                </div>
                <p className="font-bold text-white">19 Years (10 July 2007)</p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  <MapPin className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>Location</span>
                </div>
                <p className="font-bold text-white">Dehradun, India</p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl col-span-2 sm:col-span-1 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wider font-bold">
                  <GraduationCap className="h-3.5 w-3.5 text-[#8DBEFF]" />
                  <span>Education</span>
                </div>
                <p className="font-bold text-white truncate" title="BBA at Uttaranchal University">
                  BBA @ Uttaranchal Univ.
                </p>
              </div>
            </div>

            {/* Social Link */}
            <div className="pt-2">
              <a
                href="https://instagram.com/psf_vivek"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-[#8DBEFF] text-white hover:text-[#050608] border border-white/10 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md group cursor-pointer"
              >
                <InstagramIcon className="h-4 w-4 text-[#8DBEFF] group-hover:text-[#050608]" />
                <span>Instagram Profile (@psf_vivek)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Biography Section */}
        <section className="bg-[#0B0E13] border border-white/5 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase border-b border-white/5 pb-3 flex items-center gap-2">
            <Film className="h-6 w-6 text-[#8DBEFF]" />
            <span>Biography & Creative Vision</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm font-light text-[#B8C2CC] leading-relaxed">
            <p>
              <strong className="text-white font-semibold">Vivek Rautela</strong> (born 10 July 2007) is an independent Indian filmmaker, writer, director, and producer based in Dehradun, Uttarakhand. He is the Founder of <strong className="text-white font-semibold">TheOldverse Productions</strong>, an independent creative studio dedicated to developing high-impact narrative films, commercials, and digital stories.
            </p>
            <p>
              Currently pursuing a Bachelor of Business Administration (BBA) at Uttaranchal University in Dehradun, Vivek combines strategic management insights with artistic visual storytelling. As a director and screenwriter, he focuses on crafting emotionally resonant stories rooted in realism, cinematic aesthetics, and human emotion.
            </p>
            <p>
              Under his leadership, TheOldverse Productions operates as a collaborative creative hub for filmmakers, writers, cinematographers, and performers across Uttarakhand and North India.
            </p>
          </div>
        </section>

        {/* Professional Roles & Contributions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0B0E13] border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="h-10 w-10 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/20 flex items-center justify-center text-[#8DBEFF]">
              <Film className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Writer & Director</h3>
            <p className="text-xs text-[#B8C2CC] font-light leading-relaxed">
              Conceptualizes original screenplays, directs actors, and establishes visual tone across cinematic short films and indie features.
            </p>
          </div>

          <div className="bg-[#0B0E13] border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="h-10 w-10 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/20 flex items-center justify-center text-[#8DBEFF]">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Producer & Studio Founder</h3>
            <p className="text-xs text-[#B8C2CC] font-light leading-relaxed">
              Manages production workflows, budget planning, talent casting, and project distribution under TheOldverse Productions banner.
            </p>
          </div>

          <div className="bg-[#0B0E13] border border-white/5 p-6 rounded-2xl space-y-3">
            <div className="h-10 w-10 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/20 flex items-center justify-center text-[#8DBEFF]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Academic & Enterprise</h3>
            <p className="text-xs text-[#B8C2CC] font-light leading-relaxed">
              Pursuing business administration at Uttaranchal University, building sustainable production methodologies for independent cinema.
            </p>
          </div>
        </section>

        {/* Navigation & Related Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs">
          <Link
            href="/founders/shivanshi-rauthan"
            className="flex items-center gap-2 text-[#8DBEFF] hover:underline font-bold uppercase tracking-wider"
          >
            <span>View Co-Founder Profile (Shivanshi Rauthan)</span>
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
