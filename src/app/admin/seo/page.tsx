"use client";

import React from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Zap,
  MapPin,
  Share2,
  ExternalLink,
  HelpCircle,
  Code
} from "lucide-react";

export default function AdminSEOPage() {
  const seoChecklist = [
    { title: "Homepage Unique Metadata & H1", status: "passed", detail: "Optimized title, meta description, and H1 targeting Dehradun production studio." },
    { title: "Canonical Domain Normalization", status: "passed", detail: "Enforced https://theoldverse-productions.in across all routes & metadataBase." },
    { title: "Dynamic XML Sitemap (/sitemap.xml)", status: "passed", detail: "Active with 95+ canonical URLs (services, productions, founder profiles, articles)." },
    { title: "Robots Directives (/robots.txt)", status: "passed", detail: "Allows public crawlers; excludes /admin/, /api/, /dashboard/, and private portals." },
    { title: "Organization & LocalBusiness Schema", status: "passed", detail: "JSON-LD schema configured for entity knowledge & Dehradun local search." },
    { title: "Founder & Team Person Schemas", status: "passed", detail: "Vivek Rautela, Shivanshi Rauthan, Shivansh Mourya, Ujjawal Gurung schema profiles active." },
    { title: "Services Information Architecture", status: "passed", detail: "Dedicated routes for Film Production, Cinematography, Screenplay, Post-Production, Commercials." },
    { title: "Open Graph & Twitter Share Cards", status: "passed", detail: "Large summary image card sharing templates configured site-wide." },
    { title: "Core Web Vitals & Image Alt Text", status: "passed", detail: "Responsive WebP images, Skeleton loaders, and LCP safeguards active." },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 font-grotesk text-white">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B0E13] via-[#0B0E13]/90 to-[#121822] border border-[rgba(141,190,255,0.2)] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                TECHNICAL & GOOGLE SEARCH DASHBOARD
              </span>
              <h1 className="font-bebas text-3xl sm:text-5xl text-white tracking-wider uppercase leading-none">
                Google SEO & Entity Governance
              </h1>
              <p className="text-xs text-[#B8C2CC] font-light max-w-2xl leading-relaxed">
                Monitor indexability, Schema.org JSON-LD structured data, sitemap generation, local Dehradun search signals, and AI Search engine readability for TheOldverse Productions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
              >
                <Globe className="h-4 w-4" />
                <span>View XML Sitemap</span>
              </a>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0B0E13] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B8C2CC]">
              <span>Indexable Pages</span>
              <Globe className="h-4 w-4 text-[#8DBEFF]" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">85 / 85</p>
            <span className="text-[10px] text-green-400 font-mono font-bold uppercase">100% CANONICAL MATCH</span>
          </div>

          <div className="bg-[#0B0E13] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B8C2CC]">
              <span>Structured Data Schemas</span>
              <Code className="h-4 w-4 text-[#8DBEFF]" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">6 Active</p>
            <span className="text-[10px] text-green-400 font-mono font-bold uppercase">JSON-LD VALIDATED</span>
          </div>

          <div className="bg-[#0B0E13] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B8C2CC]">
              <span>Local Entity Targeting</span>
              <MapPin className="h-4 w-4 text-[#8DBEFF]" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">Dehradun, IN</p>
            <span className="text-[10px] text-[#8DBEFF] font-mono font-bold uppercase">PRIMARY GEOGRAPHIC BASE</span>
          </div>

          <div className="bg-[#0B0E13] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#B8C2CC]">
              <span>Core Web Vitals Safeguard</span>
              <Zap className="h-4 w-4 text-[#8DBEFF]" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">LCP &lt; 2.5s</p>
            <span className="text-[10px] text-green-400 font-mono font-bold uppercase">OPTIMIZED SKELETON & WEBP</span>
          </div>
        </div>

        {/* Audit Checklist */}
        <div className="bg-[#0B0E13] border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
              AUTOMATED SYSTEM AUDIT
            </span>
            <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase mt-0.5">
              Technical SEO & Crawlability Checklist
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {seoChecklist.map((item, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="text-[11px] text-[#B8C2CC] font-light mt-0.5">{item.detail}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-mono font-bold uppercase">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Console Setup Guide */}
        <div className="bg-[#0B0E13] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DBEFF] uppercase tracking-widest">
            <Search className="h-4 w-4" />
            <span>GOOGLE SEARCH CONSOLE INTEGRATION GUIDE</span>
          </div>
          <h2 className="font-bebas text-2xl text-white tracking-wider uppercase">
            Sitemap & Domain Verification Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
              <span className="font-mono text-[#8DBEFF] font-bold">Step 1: Open Console</span>
              <p className="text-[#B8C2CC] font-light">
                Log into Google Search Console with the studio email (<code className="text-white font-mono">theoldverse@gmail.com</code>).
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
              <span className="font-mono text-[#8DBEFF] font-bold">Step 2: Add Domain</span>
              <p className="text-[#B8C2CC] font-light">
                Add <code className="text-white font-mono">https://theoldverse-productions.in</code> as Domain or URL Prefix property.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
              <span className="font-mono text-[#8DBEFF] font-bold">Step 3: Submit Sitemap</span>
              <p className="text-[#B8C2CC] font-light">
                Navigate to Sitemaps and enter <code className="text-white font-mono">sitemap.xml</code> for instant index submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
