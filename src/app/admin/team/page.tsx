"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  Users,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Mail,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Globe,
  Share2
} from "lucide-react";

function InstagramIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function AdminTeamPage() {
  const { showToast } = useToast();

  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetMember, setTargetMember] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) {
        setTeam(data.team || []);
      }
    } catch {
      showToast("Failed to fetch team members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const toggleVisibility = async (member: any) => {
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible: !member.is_visible }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Team member "${member.name}" visibility updated`, "success");
        fetchTeam();
      }
    } catch {
      showToast("Failed to update member visibility", "error");
    }
  };

  const updateDisplayOrder = async (member: any, direction: "up" | "down") => {
    const newOrder = direction === "up" ? (member.display_order || 0) - 1 : (member.display_order || 0) + 1;
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: Math.max(0, newOrder) }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTeam();
      }
    } catch {
      // Ignore
    }
  };

  const handleDelete = async () => {
    if (!targetMember) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${targetMember.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Team member "${targetMember.name}" deleted`, "info");
        setDeleteModalOpen(false);
        setTargetMember(null);
        fetchTeam();
      } else {
        showToast(data.error || "Failed to delete team member", "error");
      }
    } catch {
      showToast("An error occurred during deletion", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Team Member"
        message={`Are you sure you want to remove "${targetMember?.name}" from the studio roster?`}
        confirmLabel="Remove Member"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetMember(null);
        }}
      />

      <div className="space-y-6 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Studio Team & Creative Roster
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Manage directors, writers, producers, cinematographers, and creative leaders shown on the public About page.
            </p>
          </div>

          <Link
            href="/admin/team/new"
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Team Member</span>
          </Link>
        </div>

        {/* Team Cards Grid */}
        {loading ? (
          <div className="p-12 text-center space-y-3 bg-[#0B0E13] border border-white/5 rounded-2xl">
            <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
            <p className="text-xs text-[#B8C2CC]">Loading studio roster...</p>
          </div>
        ) : team.length === 0 ? (
          <div className="p-16 text-center space-y-4 bg-[#0B0E13] border border-white/5 rounded-2xl shadow-xl">
            <Users className="h-12 w-12 text-white/20 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Team Members Found</h4>
              <p className="text-xs text-[#B8C2CC] font-light max-w-sm mx-auto">
                Add team profiles to populate the public About & Creators section.
              </p>
            </div>
            <Link
              href="/admin/team/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="h-4 w-4" />
              Add First Member
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl hover:border-[rgba(141,190,255,0.2)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-[#8DBEFF]/30 shadow-md shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-bold text-base text-white truncate">{member.name}</h3>
                      <span className="text-xs font-bold text-[#8DBEFF] uppercase tracking-wider block">
                        {member.position}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono block">
                        Order #{member.display_order || 0}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#B8C2CC] font-light leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    {/* Social icons */}
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      {member.instagram_url && <InstagramIcon className="h-3.5 w-3.5 text-[#8DBEFF]" />}
                      {member.linkedin_url && <LinkedinIcon className="h-3.5 w-3.5 text-[#8DBEFF]" />}
                      {member.email && <Mail className="h-3.5 w-3.5 text-[#8DBEFF]" />}
                    </div>

                    {/* Order buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateDisplayOrder(member, "up")}
                        className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => updateDisplayOrder(member, "down")}
                        className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    {/* Visibility badge toggle */}
                    <button
                      onClick={() => toggleVisibility(member)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        member.is_visible
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border border-white/10 text-white/30"
                      }`}
                    >
                      {member.is_visible ? "Visible" : "Hidden"}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/team/${member.id}`}
                        className="p-2 rounded-xl border border-[#8DBEFF]/30 hover:border-[#8DBEFF] bg-[#8DBEFF]/10 text-[#8DBEFF] transition-colors"
                        title="Edit Member"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => {
                          setTargetMember(member);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
