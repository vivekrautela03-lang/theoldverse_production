"use client";

import React, { useState } from "react";
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
  RefreshCw,
  Eye
} from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    category: "Film",
    status: "Completed",
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&fit=crop",
    trailer_url: "",
    gallery_urls: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&fit=crop"
    ],
    release_date: "2026",
    instagram_url: "",
    youtube_url: "",
    is_featured: false,
    is_published: true
  });

  const [credits, setCredits] = useState<{ role: string; name: string }[]>([
    { role: "Director", name: "TheOldverse Crew" },
    { role: "Producer", name: "TheOldverse Studio" }
  ]);

  const [saving, setSaving] = useState(false);
  const [galleryInput, setGalleryInput] = useState("");

  const handleTitleChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug
    }));
  };

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
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          credits: credits.filter((c) => c.role && c.name)
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Project "${formData.title}" created successfully!`, "success");
        router.push("/admin/projects");
      } else {
        showToast(data.error || "Failed to create project", "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

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
                Create New Film / Show Entry
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
              <span>Save & Publish</span>
            </button>
          </div>
        </div>

        {/* TWO-COLUMN FORM LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: MAIN METADATA & DESCRIPTIONS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Project Overview
              </h3>

              <div className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">
                    Project Title <span className="text-[#8DBEFF]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. WASTELAND (2026)"
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-white/70 uppercase tracking-wider block">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="wasteland-2026"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-[#8DBEFF] focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">
                    Short Synopsis / Tagline <span className="text-[#8DBEFF]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="A dystopian thriller exploring humanity after the fall of modern cities..."
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-white/80 uppercase tracking-wider block">
                    Full Description / Director's Note
                  </label>
                  <textarea
                    rows={5}
                    value={formData.full_description}
                    onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                    placeholder="Detailed narrative summary, background story, production details..."
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
            </div>

            {/* CREDITS SECTION */}
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
                      placeholder="Role (e.g. Director, Lead Actor)"
                      value={cred.role}
                      onChange={(e) => updateCredit(idx, "role", e.target.value)}
                      className="w-1/3 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                    <input
                      type="text"
                      placeholder="Name (e.g. Vivek Rautela)"
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

            {/* MEDIA GALLERY SECTION */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Project Image Gallery
              </h3>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
                />
                <button
                  type="button"
                  onClick={addGalleryUrl}
                  className="px-4 py-2.5 bg-[#8DBEFF] text-[#050608] font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  Add Image
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.gallery_urls.map((url, idx) => (
                  <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryUrl(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COL: CATEGORY, POSTER & PUBLISH PREVIEWS */}
          <div className="space-y-6">
            {/* Status & Options */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl font-grotesk text-xs">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Publishing Settings
              </h3>

              {/* Category */}
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

              {/* Status */}
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

              {/* Release Date */}
              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Release Date / Year</label>
                <input
                  type="text"
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              {/* Feature & Publish Toggles */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Featured Project (Hero Display)</span>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#8DBEFF]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-white">Publish Live on Website</span>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#8DBEFF]"
                  />
                </label>
              </div>
            </div>

            {/* Poster & Banner Previews */}
            <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl font-grotesk text-xs">
              <h3 className="font-bebas text-xl tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Poster & Banner Media
              </h3>

              {/* Poster URL */}
              <div className="space-y-2">
                <label className="font-semibold text-white uppercase tracking-wider block">
                  Poster Image URL <span className="text-[#8DBEFF]">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.poster_url}
                  onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
                />
                <div className="w-full aspect-[2/3] max-w-[160px] mx-auto rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg">
                  <img src={formData.poster_url} alt="Poster preview" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Banner URL */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="font-semibold text-white uppercase tracking-wider block">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
                />
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg">
                  <img src={formData.banner_url || formData.poster_url} alt="Banner preview" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Video Trailer URL */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <label className="font-semibold text-white uppercase tracking-wider block">Trailer Video URL</label>
                <input
                  type="url"
                  value={formData.trailer_url}
                  onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
