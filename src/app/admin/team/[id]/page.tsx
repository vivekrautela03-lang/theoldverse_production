"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContainer";
import { ArrowLeft, Save, Users, RefreshCw } from "lucide-react";

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "Creative Director",
    bio: "",
    avatar_url: "",
    instagram_url: "",
    linkedin_url: "",
    email: "",
    display_order: 0,
    is_visible: true
  });

  const fetchMemberDetails = async () => {
    try {
      const res = await fetch(`/api/admin/team/${id}`);
      const data = await res.json();
      if (data.success && data.member) {
        const m = data.member;
        setFormData({
          name: m.name || "",
          position: m.position || "Creative Director",
          bio: m.bio || "",
          avatar_url: m.avatar_url || "",
          instagram_url: m.instagram_url || "",
          linkedin_url: m.linkedin_url || "",
          email: m.email || "",
          display_order: m.display_order || 0,
          is_visible: m.is_visible ?? true
        });
      } else {
        showToast("Team member not found", "error");
        router.push("/admin/team");
      }
    } catch {
      showToast("Failed to fetch member details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Team member "${formData.name}" updated!`, "success");
        router.push("/admin/team");
      } else {
        showToast(data.error || "Failed to update member", "error");
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
          <p className="text-xs text-[#B8C2CC]">Loading team member editor...</p>
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
              href="/admin/team"
              className="p-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                TEAM MANAGEMENT
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
                Edit: {formData.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/team"
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

        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-white uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#8DBEFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-white uppercase tracking-wider block">Position / Role</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#8DBEFF]"
              >
                <option value="Director">Director</option>
                <option value="Producer">Producer</option>
                <option value="Creative Director">Creative Director</option>
                <option value="Cinematographer">Cinematographer</option>
                <option value="Editor">Editor</option>
                <option value="Writer">Writer</option>
                <option value="Designer">Designer</option>
                <option value="Actor">Actor</option>
                <option value="Camera Team">Camera Team</option>
                <option value="Production Team">Production Team</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-white uppercase tracking-wider block">Biography</label>
            <textarea
              rows={4}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-white uppercase tracking-wider block">Profile Photo URL</label>
              <input
                type="url"
                required
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
              />
              <div className="h-24 w-24 rounded-2xl overflow-hidden border border-white/10 bg-black mt-2">
                <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-white/70 uppercase tracking-wider block">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white/70 uppercase tracking-wider block">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white/70 uppercase tracking-wider block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#8DBEFF]"
              />
              <span className="font-bold text-white">Visible on Public About Page</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-white/60">Display Order Index:</span>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-16 px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-center"
              />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
