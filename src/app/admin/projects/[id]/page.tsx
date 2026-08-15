"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContainer";
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Film,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    category: "Film",
    status: "Completed",
    poster_url: "",
    banner_url: "",
    trailer_url: "",
    gallery_urls: [] as string[],
    release_date: "2026",
    instagram_url: "",
    youtube_url: "",
    is_featured: false,
    is_published: true
  });

  const [credits, setCredits] = useState<{ role: string; name: string }[]>([]);
  const [galleryInput, setGalleryInput] = useState("");

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`);
      const data = await res.json();
      if (data.success && data.project) {
        const p = data.project;
        setFormData({
          title: p.title || "",
          slug: p.slug || "",
          short_description: p.short_description || "",
          full_description: p.full_description || "",
          category: p.category || "Film",
          status: p.status || "Completed",
          poster_url: p.poster_url || "",
          banner_url: p.banner_url || "",
          trailer_url: p.trailer_url || "",
          gallery_urls: p.gallery_urls || [],
          release_date: p.release_date || "2026",
          instagram_url: p.instagram_url || "",
          youtube_url: p.youtube_url || "",
          is_featured: p.is_featured || false,
          is_published: p.is_published ?? true
        });
        setCredits(p.credits || [{ role: "Director", name: "TheOldverse Crew" }]);
      } else {
        showToast("Project not found", "error");
        router.push("/admin/projects");
      }
    } catch {
      showToast("Failed to fetch project details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const addCredit = () => {
    setCredits((prev) => [...prev, { role: "Cast / Crew", name: "" }]);
  };

  const updateCredit = (idx: number, field: "role" | "name", val: string) => {
    setCredits((prev) => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };

  const removeCredit = (idx: number) => {
    setCredits((prev) => prev.filter((_, i) => i !== idx));
  };

  const addGalleryUrl = () => {
    if (!galleryInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery_urls: [...prev.gallery_urls, galleryInput.trim()]
    }));
    setGalleryInput("");
  };

  const removeGalleryUrl = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description || !formData.poster_url) {
      showToast("Please fill in title, short description, and poster URL", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          credits: credits.filter((c) => c.role && c.name)
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Project "${formData.title}" updated successfully!`, "success");
        router.push("/admin/projects");
      } else {
        showToast(data.error || "Failed to update project", "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-16 text-center space-y-3 font-grotesk">
          <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
          <p className="text-xs text-[#B8C2CC]">Loading project editor...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 font-grotesk">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects"
              className="p-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                PROJECT EDITOR
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
                Edit: {formData.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects"
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

        {/* FORM CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Project Details
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white/70 uppercase tracking-wider block">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-[#8DBEFF] focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Short Synopsis</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white/80 uppercase tracking-wider block">Full Description</label>
                  <textarea
                    rows={5}
                    value={formData.full_description}
                    onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
            </div>

            {/* Credits */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="font-bebas text-xl tracking-wider text-white uppercase">Cast & Crew Credits</h3>
                <button
                  type="button"
                  onClick={addCredit}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#8DBEFF] text-xs font-semibold text-[#8DBEFF] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Credit
                </button>
              </div>

              <div className="space-y-3">
                {credits.map((cred, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Role"
                      value={cred.role}
                      onChange={(e) => updateCredit(idx, "role", e.target.value)}
                      className="w-1/3 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={cred.name}
                      onChange={(e) => updateCredit(idx, "name", e.target.value)}
                      className="w-2/3 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                    <button
                      type="button"
                      onClick={() => removeCredit(idx)}
                      className="p-2 text-white/40 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div className="space-y-6">
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl font-grotesk text-xs">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Publishing Settings
              </h3>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                >
                  <option value="Film">Film</option>
                  <option value="Series">Series</option>
                  <option value="Music">Music</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Spotlight">Spotlight</option>
                  <option value="Original">Original</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Production Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Production">In Production</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Featured Project</span>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#8DBEFF]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Publish Live</span>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#8DBEFF]"
                  />
                </label>
              </div>
            </div>

            {/* Poster Preview */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl font-grotesk text-xs">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Poster Preview
              </h3>
              <input
                type="url"
                value={formData.poster_url}
                onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
              />
              <div className="w-full aspect-[2/3] max-w-[160px] mx-auto rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg">
                <img src={formData.poster_url} alt="Poster" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
