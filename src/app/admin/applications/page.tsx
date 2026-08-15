"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  UserCheck,
  Search,
  ExternalLink,
  Mail,
  Phone,
  FileText,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2
} from "lucide-react";

export default function AdminApplicationsPage() {
  const { showToast } = useToast();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetApp, setTargetApp] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (statusFilter !== "all") query.set("status", statusFilter);

      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch {
      showToast("Failed to fetch applicant submissions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, statusFilter]);

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Candidate status updated to "${newStatus}"`, "success");
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        fetchApplications();
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!targetApp) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications/${targetApp.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Application record deleted", "info");
        setDeleteModalOpen(false);
        if (selectedApp && selectedApp.id === targetApp.id) {
          setSelectedApp(null);
        }
        setTargetApp(null);
        fetchApplications();
      } else {
        showToast(data.error || "Failed to delete application", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      "new": "bg-[#8DBEFF]/15 border-[#8DBEFF]/30 text-[#8DBEFF]",
      "reviewing": "bg-amber-500/15 border-amber-500/30 text-amber-400",
      "shortlisted": "bg-purple-500/15 border-purple-500/30 text-purple-400",
      "interview": "bg-blue-500/15 border-blue-500/30 text-blue-400",
      "selected": "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      "rejected": "bg-red-500/15 border-red-500/30 text-red-400"
    };
    return badges[status] || "bg-white/5 border-white/10 text-white";
  };

  return (
    <AdminLayout>
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Candidate Application"
        message={`Are you sure you want to remove application for "${targetApp?.applicant_name}"?`}
        confirmLabel="Delete Record"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetApp(null);
        }}
      />

      {/* Candidate Modal Reader */}
      {selectedApp && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-grotesk">
          <div className="w-full max-w-2xl bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(selectedApp.status || "new")}`}>
                  {selectedApp.status || "new"}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  Applied {new Date(selectedApp.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bebas text-3xl tracking-wider text-white uppercase">{selectedApp.applicant_name}</h3>
              <p className="text-xs font-bold text-[#8DBEFF] uppercase tracking-wider">
                Position: {selectedApp.position}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block">Email Address</span>
                  <a href={`mailto:${selectedApp.applicant_email}`} className="font-bold text-white hover:text-[#8DBEFF]">
                    {selectedApp.applicant_email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block">Phone Number</span>
                  <p className="font-bold text-white font-mono">{selectedApp.applicant_phone || "Not provided"}</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {selectedApp.portfolio_url && (
                  <a
                    href={selectedApp.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/30 text-[#8DBEFF] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#8DBEFF]/20"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View Portfolio</span>
                  </a>
                )}

                {selectedApp.resume_url && (
                  <a
                    href={selectedApp.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-purple-500/20"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View Resume / CV</span>
                  </a>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-white uppercase tracking-wider block">Cover Letter / Proposal</span>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-white/90 leading-relaxed font-light whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedApp.cover_letter || "No cover letter provided."}
                </div>
              </div>
            </div>

            {/* Pipeline status buttons */}
            <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest block">Update Pipeline Stage</span>
              <div className="flex flex-wrap gap-2">
                {["reviewing", "shortlisted", "interview", "selected", "rejected"].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(selectedApp.id, st)}
                    className={`px-3 py-1.5 rounded-xl uppercase font-bold tracking-wider transition-all cursor-pointer ${
                      selectedApp.status === st
                        ? "bg-[#8DBEFF] text-[#050608]"
                        : "bg-white/5 border border-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main View */}
      <div className="space-y-6 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Recruitment Candidate Pipeline
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Manage incoming job applicant submissions, review portfolios, and update recruitment stages.
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-[#8DBEFF]" />
            <input
              type="text"
              placeholder="Search candidate name, email, or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {["all", "new", "reviewing", "shortlisted", "interview", "selected", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#8DBEFF] text-[#050608]"
                    : "bg-white/3 border border-white/5 text-[#B8C2CC] hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}

            <button
              onClick={fetchApplications}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer ml-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Applicants Grid / Table */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
              <p className="text-xs text-[#B8C2CC]">Loading applicant pipeline...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <UserCheck className="h-12 w-12 text-white/20 mx-auto" />
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Candidate Applications</h4>
              <p className="text-xs text-[#B8C2CC] font-light">No candidate submissions match your current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-grotesk">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest">
                  <tr>
                    <th className="py-4 px-5">Candidate</th>
                    <th className="py-4 px-4">Position</th>
                    <th className="py-4 px-4">Applied Date</th>
                    <th className="py-4 px-4">Pipeline Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5">
                        <div>
                          <span className="font-bold text-white block">{app.applicant_name}</span>
                          <span className="text-[11px] text-white/50 font-mono">{app.applicant_email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-[#8DBEFF]">{app.position}</td>

                      <td className="py-4 px-4 text-white/40 font-mono text-[11px]">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getStatusBadge(app.status || "new")}`}>
                          {app.status || "new"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetApp(app);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-white/40 hover:text-red-400 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
