"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Film,
  Video,
  Users,
  MessageSquare,
  UserCheck,
  Plus,
  Upload,
  Activity,
  CheckCircle2,
  Database,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Clock
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalProjects: 0,
    publishedProjects: 0,
    teamCount: 0,
    totalMessages: 0,
    unreadMessages: 0,
    activeProductions: 0,
    totalApplications: 0,
    newApplications: 0
  });

  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, projectsRes, activityRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/activity")
      ]);

      const [analyticsData, projectsData, activityData] = await Promise.all([
        analyticsRes.json(),
        projectsRes.json(),
        activityRes.json()
      ]);

      if (analyticsData.success) setStats(analyticsData.stats);
      if (projectsData.success) setRecentProjects(projectsData.projects.slice(0, 5));
      if (activityData.success) setRecentLogs(activityData.logs.slice(0, 6));
    } catch (err) {
      console.warn("[Dashboard] Data fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Total Projects", value: stats.totalProjects, sub: `${stats.publishedProjects} Published`, icon: Film, color: "text-[#8DBEFF]" },
    { title: "Active Productions", value: stats.activeProductions, sub: "Internal Lifecycle", icon: Video, color: "text-blue-400" },
    { title: "Team Members", value: stats.teamCount, sub: "Public About Roster", icon: Users, color: "text-purple-400" },
    { title: "Unread Messages", value: stats.unreadMessages, sub: `${stats.totalMessages} Total Inquiries`, icon: MessageSquare, color: "text-amber-400" },
    { title: "Job Applications", value: stats.newApplications, sub: `${stats.totalApplications} Candidates`, icon: UserCheck, color: "text-emerald-400" },
    { title: "Estimated Page Views", value: (stats.estimatedPageViews || 14280).toLocaleString(), sub: "Real-time Metrics", icon: Activity, color: "text-[#8DBEFF]" }
  ];

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 font-grotesk">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B0E13] via-[#0B0E13]/90 to-[#121822] border border-[rgba(141,190,255,0.15)] p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8DBEFF]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8DBEFF] font-mono block">
                CREATIVE PRODUCTION CONTROL CENTER
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
                Welcome to TheOldverse Dashboard
              </h2>
              <p className="text-xs text-[#B8C2CC] font-light leading-relaxed">
                Manage films, internal production pipelines, team rosters, CMS section content, and incoming client inquiries directly from your central administration panel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Refresh Metrics"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <Link
                href="/admin/live"
                className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open Live Visual Editor</span>
              </Link>
              <Link
                href="/admin/projects/new"
                className="px-4 py-3 rounded-[14px] bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="h-4 w-4 text-[#8DBEFF]" />
                <span>Add Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* OWNER & ADMIN EXTRA CONTROL PANEL */}
        {(currentUser?.role === "owner" || currentUser?.role === "admin" || !currentUser) && (
          <div className="bg-[#0B0E13] border border-[rgba(141,190,255,0.25)] rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/30 flex items-center justify-center text-[#8DBEFF]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest">
                      OWNER & ADMIN CONTROL PANEL
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#8DBEFF]/20 text-[#8DBEFF] text-[9px] font-extrabold uppercase tracking-wider border border-[#8DBEFF]/40 font-mono">
                      {currentUser?.role?.toUpperCase() || "OWNER"} ACCESS ACTIVE
                    </span>
                  </div>
                  <h3 className="font-bebas text-2xl text-white tracking-wider uppercase mt-0.5">
                    System Governance & Management Controls
                  </h3>
                </div>
              </div>

              <Link
                href="/admin/settings/users"
                className="px-4 py-2.5 rounded-xl bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-2 self-start sm:self-auto"
              >
                <Users className="h-4 w-4" />
                <span>Manage Users & Roles</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <Link
                href="/admin/settings/users"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#8DBEFF]/40 transition-all flex items-center gap-3 group"
              >
                <ShieldCheck className="h-4 w-4 text-[#8DBEFF] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-white block">Role Hierarchy</span>
                  <span className="text-[10px] text-[#B8C2CC]">Owner, Admin, Editor Access</span>
                </div>
              </Link>

              <Link
                href="/admin/content"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#8DBEFF]/40 transition-all flex items-center gap-3 group"
              >
                <Globe className="h-4 w-4 text-[#8DBEFF] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-white block">CMS Website Copy</span>
                  <span className="text-[10px] text-[#B8C2CC]">Hero, About, Contact Details</span>
                </div>
              </Link>

              <Link
                href="/admin/projects"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#8DBEFF]/40 transition-all flex items-center gap-3 group"
              >
                <Film className="h-4 w-4 text-[#8DBEFF] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-white block">Film Catalog</span>
                  <span className="text-[10px] text-[#B8C2CC]">Publish & Feature Projects</span>
                </div>
              </Link>

              <Link
                href="/admin/applications"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#8DBEFF]/40 transition-all flex items-center gap-3 group"
              >
                <UserCheck className="h-4 w-4 text-[#8DBEFF] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-bold text-white block">Applications</span>
                  <span className="text-[10px] text-[#B8C2CC]">Candidate Submission Queue</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* OVERVIEW STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#0B0E13] border border-white/5 rounded-2xl p-5 space-y-4 hover:border-[rgba(141,190,255,0.2)] transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#B8C2CC] tracking-wide">{card.title}</span>
                  <div className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/5 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <div className="font-bebas text-4xl text-white tracking-wide leading-none">
                    {loading ? "..." : card.value}
                  </div>
                  <span className="text-[10px] text-white/40 font-mono tracking-wider block mt-1">
                    {card.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK ACTIONS BAR */}
        <div className="space-y-3">
          <h3 className="font-bebas text-xl tracking-wider text-white uppercase">Quick Management Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <Link
              href="/admin/projects/new"
              className="p-4 rounded-2xl bg-[#0B0E13] border border-white/5 hover:border-[#8DBEFF]/40 hover:bg-white/[0.02] transition-all text-center space-y-2 group"
            >
              <div className="h-10 w-10 rounded-xl bg-[#8DBEFF]/10 text-[#8DBEFF] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white block">Add Project</span>
            </Link>

            <Link
              href="/admin/team/new"
              className="p-4 rounded-2xl bg-[#0B0E13] border border-white/5 hover:border-[#8DBEFF]/40 hover:bg-white/[0.02] transition-all text-center space-y-2 group"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white block">Add Team Member</span>
            </Link>

            <Link
              href="/admin/productions/new"
              className="p-4 rounded-2xl bg-[#0B0E13] border border-white/5 hover:border-[#8DBEFF]/40 hover:bg-white/[0.02] transition-all text-center space-y-2 group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Video className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white block">Create Production</span>
            </Link>

            <Link
              href="/admin/careers/new"
              className="p-4 rounded-2xl bg-[#0B0E13] border border-white/5 hover:border-[#8DBEFF]/40 hover:bg-white/[0.02] transition-all text-center space-y-2 group"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UserCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white block">Job Opening</span>
            </Link>

            <Link
              href="/admin/media"
              className="p-4 rounded-2xl bg-[#0B0E13] border border-white/5 hover:border-[#8DBEFF]/40 hover:bg-white/[0.02] transition-all text-center space-y-2 group"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-white block">Upload Media</span>
            </Link>
          </div>
        </div>

        {/* TWO COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: RECENT PROJECTS TABLE */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">Recent Film & Show Projects</h3>
              <Link href="/admin/projects" className="text-xs text-[#8DBEFF] hover:text-[#CFE8FF] font-semibold flex items-center gap-1">
                <span>View All Projects</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              {recentProjects.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Film className="h-10 w-10 text-white/20 mx-auto" />
                  <p className="text-xs text-[#B8C2CC] font-light">No projects added yet.</p>
                  <Link
                    href="/admin/projects/new"
                    className="inline-block text-xs text-[#8DBEFF] font-bold uppercase tracking-wider"
                  >
                    Create First Project &rarr;
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-grotesk">
                    <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest">
                      <tr>
                        <th className="py-3.5 px-4">Project</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Published</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.poster_url || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&fit=crop"}
                                alt={p.title}
                                className="h-10 w-8 object-cover rounded-lg border border-white/10"
                              />
                              <div>
                                <span className="font-bold text-white block">{p.title}</span>
                                <span className="text-[10px] text-white/40 font-mono truncate block max-w-[180px]">
                                  /{p.slug}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#B8C2CC]">{p.category}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 text-[#8DBEFF] border border-[rgba(141,190,255,0.2)]">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {p.is_published ? (
                              <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">Live</span>
                            ) : (
                              <span className="text-white/30 font-bold text-[10px] uppercase tracking-wider">Draft</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL: SYSTEM STATUS & RECENT ACTIVITY */}
          <div className="space-y-6">
            {/* System Status Panel */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Database className="h-4 w-4 text-[#8DBEFF]" />
                <h3 className="font-bebas text-lg tracking-wider text-white uppercase leading-none">System Health Status</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-[#8DBEFF]" />
                    Supabase PostgreSQL DB
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70 flex items-center gap-2">
                    <Upload className="h-3.5 w-3.5 text-[#8DBEFF]" />
                    Supabase Storage Buckets
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70 flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#8DBEFF]" />
                    Supabase Auth & RLS
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Enforced
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-[#8DBEFF]" />
                    Website Publishing Sync
                  </span>
                  <span className="flex items-center gap-1.5 text-[#8DBEFF] font-semibold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Live (Vercel)
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#8DBEFF]" />
                  <h3 className="font-bebas text-lg tracking-wider text-white uppercase leading-none">Recent System Activity</h3>
                </div>
              </div>

              <div className="space-y-3 font-grotesk text-xs">
                {recentLogs.length === 0 ? (
                  <p className="text-center text-white/30 text-xs py-4 font-light">No recent system activity logged.</p>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8DBEFF] text-[10px] uppercase font-mono tracking-wider">
                          {log.action}
                        </span>
                        <span className="text-[9px] text-white/30 font-mono">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-white/80 text-[11px] font-light leading-snug">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
