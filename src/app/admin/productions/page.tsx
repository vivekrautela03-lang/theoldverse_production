"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  Video,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  DollarSign,
  MapPin,
  Edit,
  Trash2,
  RefreshCw,
  ChevronRight
} from "lucide-react";

export default function AdminProductionsPage() {
  const { showToast } = useToast();

  const [productions, setProductions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetProd, setTargetProd] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProductions = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== "all" ? `/api/admin/productions?status=${statusFilter}` : "/api/admin/productions";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProductions(data.productions || []);
      }
    } catch {
      showToast("Failed to fetch internal production logs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, [statusFilter]);

  const handleDelete = async () => {
    if (!targetProd) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/productions/${targetProd.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Production "${targetProd.title}" deleted`, "info");
        setDeleteModalOpen(false);
        setTargetProd(null);
        fetchProductions();
      } else {
        showToast(data.error || "Failed to delete production", "error");
      }
    } catch {
      showToast("An error occurred during deletion", "error");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      "Planning": "bg-blue-500/15 border-blue-500/30 text-blue-400",
      "Pre-production": "bg-purple-500/15 border-purple-500/30 text-purple-400",
      "Production": "bg-amber-500/15 border-amber-500/30 text-amber-400",
      "Post-production": "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
      "Completed": "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      "On Hold": "bg-red-500/15 border-red-500/30 text-red-400"
    };
    return badges[status] || "bg-white/5 border-white/10 text-white";
  };

  return (
    <AdminLayout>
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Production Entry"
        message={`Are you sure you want to delete internal production log for "${targetProd?.title}"?`}
        confirmLabel="Delete Log"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetProd(null);
        }}
      />

      <div className="space-y-6 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Internal Production Management
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Track project lifecycle stages, crew rosters, filming locations, and budget progress.
            </p>
          </div>

          <Link
            href="/admin/productions/new"
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Production Entry</span>
          </Link>
        </div>

        {/* Phase Filter Controls */}
        <div className="flex items-center justify-between bg-[#0B0E13] border border-white/5 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["all", "Planning", "Pre-production", "Production", "Post-production", "Completed", "On Hold"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-[#8DBEFF] text-[#050608] font-bold shadow-[0_0_15px_rgba(141,190,255,0.2)]"
                    : "bg-white/3 border border-white/5 text-[#B8C2CC] hover:text-white hover:bg-white/5"
                }`}
              >
                {st === "all" ? "All Phases" : st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchProductions}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Productions Grid */}
        {loading ? (
          <div className="p-12 text-center space-y-3 bg-[#0B0E13] border border-white/5 rounded-2xl">
            <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
            <p className="text-xs text-[#B8C2CC]">Loading production pipeline entries...</p>
          </div>
        ) : productions.length === 0 ? (
          <div className="p-16 text-center space-y-4 bg-[#0B0E13] border border-white/5 rounded-2xl shadow-xl">
            <Video className="h-12 w-12 text-white/20 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Production Entries</h4>
              <p className="text-xs text-[#B8C2CC] font-light max-w-sm mx-auto">
                No active production entries found matching this status filter.
              </p>
            </div>
            <Link
              href="/admin/productions/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="h-4 w-4" />
              Create Production Log
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productions.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl hover:border-[rgba(141,190,255,0.2)] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#8DBEFF] font-bold uppercase tracking-widest block">
                      {prod.type}
                    </span>
                    <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">{prod.title}</h3>
                    {prod.project?.title && (
                      <p className="text-xs text-white/50 font-light">Project: {prod.project.title}</p>
                    )}
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(prod.status)}`}>
                    {prod.status}
                  </span>
                </div>

                {/* Lifecycle Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white/70">Stage Completion Progress</span>
                    <span className="text-[#8DBEFF] font-mono">{prod.progress_percentage || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#8DBEFF] rounded-full transition-all duration-500"
                      style={{ width: `${prod.progress_percentage || 0}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block font-semibold">Director & Producer</span>
                    <p className="font-bold text-white truncate">{prod.director}</p>
                    <p className="text-white/60 text-[11px] truncate">{prod.producer}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block font-semibold">Location & Budget</span>
                    <p className="font-bold text-white truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#8DBEFF]" />
                      {prod.location}
                    </p>
                    <p className="text-emerald-400 font-mono font-bold text-[11px]">{prod.budget || "$0"}</p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <span className="text-white/40 text-[10px] font-mono">
                    Updated {new Date(prod.updated_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/productions/${prod.id}`}
                      className="px-3.5 py-1.5 rounded-xl border border-[#8DBEFF]/30 hover:border-[#8DBEFF] bg-[#8DBEFF]/10 text-[#8DBEFF] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Manage</span>
                    </Link>

                    <button
                      onClick={() => {
                        setTargetProd(prod);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
