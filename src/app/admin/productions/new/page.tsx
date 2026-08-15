"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContainer";
import { ArrowLeft, Save, Plus, Trash2, Video, RefreshCw } from "lucide-react";

export default function NewProductionPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    type: "Short Film",
    director: "TheOldverse Director",
    producer: "TheOldverse Producer",
    location: "Studio Stage 1 / Dehradun",
    status: "Planning",
    progress_percentage: 15,
    budget: "$15,000",
    start_date: "",
    end_date: "",
    notes: ""
  });

  const [crew, setCrew] = useState<{ role: string; name: string }[]>([
    { role: "Cinematographer", name: "" },
    { role: "Editor", name: "" }
  ]);

  const [actorsInput, setActorsInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addCrew = () => setCrew((prev) => [...prev, { role: "Crew Position", name: "" }]);
  const updateCrew = (idx: number, field: "role" | "name", val: string) => {
    setCrew((prev) => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };
  const removeCrew = (idx: number) => setCrew((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.director || !formData.producer || !formData.location) {
      showToast("Title, Director, Producer, and Location are required fields", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/productions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          crew: crew.filter((c) => c.role && c.name),
          actors: actorsInput.split(",").map((a) => a.trim()).filter(Boolean)
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Production "${formData.title}" created successfully!`, "success");
        router.push("/admin/productions");
      } else {
        showToast(data.error || "Failed to create production entry", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/productions"
              className="p-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                PRODUCTION TRACKER
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
                Create Production Log
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/productions"
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
              <span>Save Production Log</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Production Overview
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Production Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. MONSOON MEMOIRS - SEASON 1"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">Director</label>
                    <input
                      type="text"
                      required
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">Producer</label>
                    <input
                      type="text"
                      required
                      value={formData.producer}
                      onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">Shooting Location</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">Allocated Budget</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="$25,000"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white/80 uppercase tracking-wider block">Cast / Actors (comma separated)</label>
                  <input
                    type="text"
                    value={actorsInput}
                    onChange={(e) => setActorsInput(e.target.value)}
                    placeholder="Actor 1, Actor 2, Lead Actor 3"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white/80 uppercase tracking-wider block">Internal Production Notes</label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Equipment requirements, shooting schedule notes, casting criteria..."
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="font-bebas text-xl tracking-wider text-white uppercase">Crew Roster</h3>
                <button
                  type="button"
                  onClick={addCrew}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#8DBEFF] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Crew Member
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {crew.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Role (e.g. Sound Engineer)"
                      value={c.role}
                      onChange={(e) => updateCrew(idx, "role", e.target.value)}
                      className="w-1/3 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={c.name}
                      onChange={(e) => updateCrew(idx, "name", e.target.value)}
                      className="w-2/3 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                    <button type="button" onClick={() => removeCrew(idx)} className="p-2 text-white/40 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl font-grotesk text-xs">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Lifecycle & Stage
              </h3>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Production Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                >
                  <option value="Short Film">Short Film</option>
                  <option value="Feature Film">Feature Film</option>
                  <option value="Web Series">Web Series</option>
                  <option value="Music Video">Music Video</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Stage Phase</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                >
                  <option value="Planning">Planning</option>
                  <option value="Pre-production">Pre-production</option>
                  <option value="Production">Production (Shooting)</option>
                  <option value="Post-production">Post-production (Editing)</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <label className="font-semibold text-white uppercase tracking-wider block">Stage Progress %</label>
                  <span className="font-mono text-[#8DBEFF] font-bold">{formData.progress_percentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress_percentage}
                  onChange={(e) => setFormData({ ...formData, progress_percentage: Number(e.target.value) })}
                  className="w-full accent-[#8DBEFF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
