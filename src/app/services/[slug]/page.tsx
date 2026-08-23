import React from "react";
import Metadata from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Film, Video, Camera, Scissors, Compass, Music, Clapperboard, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { constructMetadata, getOrganizationSchema, getLocalBusinessSchema, getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";

interface ServiceDetail {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  heroHeadline: string;
  capabilities: string[];
  processSteps: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

const SERVICES_DATABASE: Record<string, ServiceDetail> = {
  "film-production": {
    slug: "film-production",
    title: "Film Production Services",
    seoTitle: "Film Production Services in Dehradun",
    description: "End-to-end film production services in Dehradun, Uttarakhand by TheOldverse Productions. From script writing and casting to cinematography, direction, and post-production.",
    heroHeadline: "Independent & Commercial Film Production",
    capabilities: [
      "Original Scriptwriting & Screenplay Development",
      "Casting & Location Scouting in Uttarakhand",
      "Budgeting & Production Scheduling",
      "Full Camera & Crew Operations",
      "Post-Production Color Grading & Sound Mixing"
    ],
    processSteps: [
      { title: "1. Pre-Production", desc: "Concept design, screenplay revisions, shot lists, location permissions, and crew assembly." },
      { title: "2. Principal Photography", desc: "On-set camera operations, lighting setup, audio recording, and scene direction." },
      { title: "3. Post-Production", desc: "Assembly editing, color grading, sound design, original music score, and final export." }
    ],
    faqs: [
      { question: "Do you produce both short films and feature films?", answer: "Yes, TheOldverse Productions develops original short films, feature films, and narrative digital series." },
      { question: "Where do film shoots take place?", answer: "Our primary production base is Dehradun, Uttarakhand, with capability to shoot on location across India." }
    ]
  },
  "video-production": {
    slug: "video-production",
    title: "Video Production Services",
    seoTitle: "Video Production Company in Dehradun",
    description: "Professional video production services in Dehradun. Corporate videos, brand storytelling, digital promotional content, and creative web video production by TheOldverse Productions.",
    heroHeadline: "High-Impact Video Production & Digital Content",
    capabilities: [
      "Corporate & Brand Documentaries",
      "Social Media Video Campaigns",
      "Product & Service Commercials",
      "Event & Live Coverage",
      "High-Definition 4K Video Masters"
    ],
    processSteps: [
      { title: "1. Creative Brief", desc: "Understanding brand objectives, target audience, key message, and format." },
      { title: "2. Production", desc: "Professional lighting, multi-angle camera coverage, and high-fidelity sound capture." },
      { title: "3. Delivery", desc: "Optimized web and broadcast video deliverables formatted for YouTube, Instagram, and web." }
    ],
    faqs: [
      { question: "Can you create videos tailored for Instagram and YouTube?", answer: "Yes, we produce custom aspect ratio videos (16:9, 9:16 vertical, 1:1 square) for all platforms." }
    ]
  },
  "cinematography": {
    slug: "cinematography",
    title: "Cinematography Services",
    seoTitle: "Cinematography Services in Dehradun",
    description: "Professional cinematography and camera operations in Dehradun, Uttarakhand. Atmospheric lighting, cinematic framing, and high-resolution digital filming by TheOldverse Productions.",
    heroHeadline: "Cinematography & Atmospheric Camera Operations",
    capabilities: [
      "Cinematic Lighting & Gaffer Setup",
      "High Dynamic Range 4K & RAW Capture",
      "Dynamic Camera Movement & Stabilization",
      "Drone & Aerial Videography",
      "Visual Aesthetics & Tone Framing"
    ],
    processSteps: [
      { title: "1. Visual Style Lookbook", desc: "Defining lighting palettes, lens selection, contrast ratios, and camera movement." },
      { title: "2. Filming", desc: "Precise exposure, focus pull, and framing during principal camera capture." }
    ],
    faqs: [
      { question: "Who heads the cinematography department?", answer: "Our camera operations and cinematography department is led by Ujjawal Gurung, Camera Team Head & Cinematographer." }
    ]
  },
  "video-editing": {
    slug: "video-editing",
    title: "Video Editing & Post-Production",
    seoTitle: "Video Editing Services in Dehradun",
    description: "Post-production video editing, color grading, sound design, and visual effects services in Dehradun by TheOldverse Productions.",
    heroHeadline: "Post-Production Editing, Color Grading & Sound Design",
    capabilities: [
      "Pacing & Narrative Assembly Editing",
      "Cinematic Color Grading & Match",
      "Sound Design & Foley Mixing",
      "Subtitles & Typography Motion Graphics",
      "Format Conversions & Master Deliverables"
    ],
    processSteps: [
      { title: "1. Assembly Cut", desc: "Organizing raw footage, syncing audio, and building story structure." },
      { title: "2. Picture Lock & Color", desc: "Fine-tuning cuts, applying color grade, and mixing audio." }
    ],
    faqs: [
      { question: "Who handles screenplay writing and editing?", answer: "Shivansh Mourya serves as Editor & Screenplay Writer, overseeing post-production cuts and narrative flow." }
    ]
  },
  "direction": {
    slug: "direction",
    title: "Direction & Screenplay Writing",
    seoTitle: "Film Direction & Screenplay Writing in Dehradun",
    description: "Original film direction, scriptwriting, screenplay development, and creative vision by Vivek Rautela, Shivanshi Rauthan, and the team at TheOldverse Productions.",
    heroHeadline: "Creative Direction & Original Screenplay Development",
    capabilities: [
      "Original Story & Treatment Conception",
      "Full Feature & Short Screenplay Drafting",
      "Director's Vision & Scene Composition",
      "Actor Coaching & Performance Guidance",
      "Creative Oversight Across Production"
    ],
    processSteps: [
      { title: "1. Concept & Treatment", desc: "Developing logarithmic premise, character arcs, and narrative structure." },
      { title: "2. Screenplay Drafts", desc: "Writing scene-by-scene script formatted to industry standards." }
    ],
    faqs: [
      { question: "Can I commission an original script or direction for my project?", answer: "Yes, Vivek Rautela (Founder/Writer/Director) and Shivanshi Rauthan (Co-Founder/Director) lead custom screenplay and direction projects." }
    ]
  },
  "music-video-production": {
    slug: "music-video-production",
    title: "Music Video Production",
    seoTitle: "Music Video Production Company in Dehradun",
    description: "Stylized, atmospheric music video production services in Dehradun, Uttarakhand by TheOldverse Productions. Creating visually memorable videos for independent musicians and record labels.",
    heroHeadline: "Stylized Music Video Production & Artist Visuals",
    capabilities: [
      "Concept Development & Moodboards",
      "Narrative & Performance Sequence Filming",
      "Stylized Lighting & Color Aesthetics",
      "Rhythmic Editing & Music Synchronization"
    ],
    processSteps: [
      { title: "1. Track Analysis", desc: "BPM analysis, lyrical moodboard creation, and concept alignment with artist." },
      { title: "2. Shoot & Edit", desc: "High-energy or atmospheric filming followed by rhythmic music video editing." }
    ],
    faqs: [
      { question: "Do you work with independent artists and bands?", answer: "Yes, we produce visual music videos for solo artists, bands, and independent record labels." }
    ]
  },
  "commercial-video-production": {
    slug: "commercial-video-production",
    title: "Commercial & Brand Films",
    seoTitle: "Commercial Film Production in Dehradun",
    description: "Commercial video ads, brand documentaries, and promotional campaign films produced in Dehradun by TheOldverse Productions.",
    heroHeadline: "Commercial Ads & Brand Film Production",
    capabilities: [
      "Brand Storytelling & Commercial Concepts",
      "High-End Commercial Lighting & Camera Setup",
      "Voiceover & Original Soundtrack Integration",
      "Multi-Format Export for Web, TV, & Social Media"
    ],
    processSteps: [
      { title: "1. Strategy", desc: "Identifying key brand message, marketing goals, and visual aesthetic." },
      { title: "2. Production & Launch", desc: "Precision filming and editing delivering broadcast-ready commercials." }
    ],
    faqs: [
      { question: "What is the turnaround time for a commercial video shoot?", answer: "Depending on script scope, pre-production takes 1-2 weeks, filming 1-3 days, and post-production 1 week." }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(SERVICES_DATABASE).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const srv = SERVICES_DATABASE[slug];
  if (!srv) return {};

  return constructMetadata({
    title: srv.seoTitle,
    description: srv.description,
    path: `/services/${slug}`
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const srv = SERVICES_DATABASE[slug];

  if (!srv) {
    notFound();
  }

  const orgSchema = getOrganizationSchema();
  const localSchema = getLocalBusinessSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: srv.title, url: `/services/${srv.slug}` }
  ]);
  const faqSchema = getFAQSchema(srv.faqs);

  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-20 font-grotesk text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, localSchema, breadcrumbSchema, faqSchema]) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#8DBEFF]">
          <Link href="/" className="hover:underline text-[#B8C2CC]">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:underline text-[#B8C2CC]">Services</Link>
          <span>/</span>
          <span className="text-white font-bold">{srv.title}</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-[#0B0E13] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DBEFF] uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            <span>THEOLDVERSE PRODUCTIONS • SERVICE CAPABILITY</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
            {srv.heroHeadline}
          </h1>
          <p className="text-sm sm:text-base text-[#B8C2CC] font-light leading-relaxed max-w-3xl">
            {srv.description}
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="space-y-6">
          <h2 className="font-bebas text-3xl text-white tracking-wider uppercase">
            Core Capabilities & Offerings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {srv.capabilities.map((cap, idx) => (
              <div key={idx} className="bg-[#0B0E13] border border-white/5 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#8DBEFF] flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-white font-semibold">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Production Process Steps */}
        <div className="bg-[#0B0E13] border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-bebas text-3xl text-white tracking-wider uppercase">
            Our Production Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {srv.processSteps.map((step, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-2">
                <h3 className="font-bold text-white text-sm text-[#8DBEFF]">{step.title}</h3>
                <p className="text-xs text-[#B8C2CC] font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        {srv.faqs.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-bebas text-3xl text-white tracking-wider uppercase">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {srv.faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#0B0E13] border border-white/5 p-5 rounded-2xl space-y-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-[#8DBEFF]" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs text-[#B8C2CC] font-light leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTA */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/services"
            className="text-xs font-bold text-[#8DBEFF] uppercase tracking-wider hover:underline"
          >
            ← View All Production Services
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
          >
            Inquire About {srv.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
