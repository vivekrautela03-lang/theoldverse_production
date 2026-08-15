"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContainer";
import { ArrowLeft, Save, Briefcase, RefreshCw } from "lucide-react";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    department: "Production",
    description: "",
    requirements: "",
    type: "Full-Time",
    location: "Dehradun",
    status: "open"
  });

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/admin/careers/${id}`);
      const data = await res.json();
      if (data.success && data.job) {
        const j = data.job;
        setFormData({
          title: j.title || "",
          department: j.department || "Production",
          description: j.description || "",
          requirements: (j.requirements || []).join(", "),
          type: j.type || "Full-Time",
          location: j.location || "Remote",
          status: j.status || "open"
        });
      } else {
        showToast("Job posting not found", "error");
        router.push("/admin/careers");
      }
    } catch {
      showToast("Failed to fetch job posting", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split(",").map((r) => r.trim()).filter(Boolean)
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Job posting "${formData.title}" updated!`, "success");
        router.push("/admin/careers");
      } else {
        showToast(data.error || "Failed to update job posting", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-16 text-center space-y-3 font-grotesk">
          <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
          <p className="text-xs text-[#B8C2CC]">Loading job editor...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 font-grotesk max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/careers"
              className="p-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                RECRUITMENT CONTROL
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
                Edit: {formData.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/careers"
              className="px-4 py-2.5 rounded-[12px] border border-white/10 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] cursor-pointer flex items-center gap-2"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-white uppercase tracking-wider block">Job Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-white uppercase tracking-wider block">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
              >
                <option value="Production">Production</option>
                <option value="Post-Production">Post-Production</option>
                <option value="Direction & Writing">Direction & Writing</option>
                <option value="Cinematography">Cinematography</option>
                <option value="Design & VFX">Design & VFX</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-white uppercase tracking-wider block">Employment Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
                <option value="Collaboration">Collaboration</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-white uppercase tracking-wider block">Posting Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-[#8DBEFF] focus:outline-none focus:border-[#8DBEFF]"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-white uppercase tracking-wider block">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-white uppercase tracking-wider block">Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-white/80 uppercase tracking-wider block">Key Requirements</label>
            <textarea
              rows={3}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
