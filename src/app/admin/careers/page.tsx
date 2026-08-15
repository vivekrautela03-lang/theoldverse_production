"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import { Briefcase, Plus, Edit, Trash2, RefreshCw } from "lucide-react";

export default function AdminCareersPage() {
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetJob, setTargetJob] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== "all" ? `/api/admin/careers?status=${statusFilter}` : "/api/admin/careers";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch {
      showToast("Failed to fetch job openings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleDelete = async () => {
    if (!targetJob) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/careers/${targetJob.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Job posting "${targetJob.title}" removed`, "info");
        setDeleteModalOpen(false);
        setTargetJob(null);
        fetchJobs();
      } else {
        showToast(data.error || "Failed to delete job posting", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Job Posting"
        message={`Are you sure you want to delete the job opening for "${targetJob?.title}"?`}
        confirmLabel="Delete Posting"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetJob(null);
        }}
      />

      <div className="space-y-6 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Job & Internship Openings
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Publish recruitment opportunities, internships, and freelance roles to attract top creative talent.
            </p>
          </div>

          <Link
            href="/admin/careers/new"
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Opening</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between bg-[#0B0E13] border border-white/5 rounded-2xl p-4 shadow-xl text-xs">
          <div className="flex items-center gap-2">
            {["all", "open", "closed", "draft"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#8DBEFF] text-[#050608]"
                    : "bg-white/3 border border-white/5 text-[#B8C2CC] hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchJobs}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="p-12 text-center space-y-3 bg-[#0B0E13] border border-white/5 rounded-2xl">
            <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
            <p className="text-xs text-[#B8C2CC]">Loading job openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center space-y-4 bg-[#0B0E13] border border-white/5 rounded-2xl shadow-xl">
            <Briefcase className="h-12 w-12 text-white/20 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Job Openings Found</h4>
              <p className="text-xs text-[#B8C2CC] font-light max-w-sm mx-auto">
                No active postings match your current filter. Create a new posting below.
              </p>
            </div>
            <Link
              href="/admin/careers/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="h-4 w-4" />
              Post Job Opening
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl hover:border-[rgba(141,190,255,0.2)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#8DBEFF] font-bold uppercase tracking-widest block">
                        {job.department} &bull; {job.type}
                      </span>
                      <h3 className="font-bebas text-2xl tracking-wider text-white uppercase mt-0.5">{job.title}</h3>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                      job.status === "open"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#B8C2CC] font-light leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <span className="text-white/40 text-[10px] font-mono">Location: {job.location}</span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/careers/${job.id}`}
                      className="p-2 rounded-xl border border-[#8DBEFF]/30 hover:border-[#8DBEFF] bg-[#8DBEFF]/10 text-[#8DBEFF] transition-colors"
                      title="Edit Job Opening"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => {
                        setTargetJob(job);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Job Opening"
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
