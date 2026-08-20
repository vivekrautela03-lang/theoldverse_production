"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Edit3,
  Save,
  Plus,
  Trash2,
  X,
  Eye,
  Sparkles,
  Film,
  Users,
  FileText,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  RefreshCw,
  LayoutDashboard,
  Shield,
  ArrowLeft,
  Video,
  Quote,
  Star
} from "lucide-react";
import { ToastProvider, useToast } from "@/components/admin/ToastContainer";

function LiveEditorContent() {
  const { showToast } = useToast();

  const [editMode, setEditMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Live Data States
  const [cmsContent, setCmsContent] = useState<any>({
    homepage: {
      heroTitle: "CINEMATIC STORIES BEYOND BOUNDARIES",
      heroSubtitle: "An independent film production studio creating original films, commercials, and digital content.",
      ctaText: "EXPLORE CATALOG",
      ctaLink: "/projects"
    },
    about: {
      title: "About The OldVerse",
      subtitle: "Every Story Deserves A Stage",
      storyText: "The OldVerse is an independent film production studio driven by creativity, passion, and the belief that every story deserves to be told. We create films, commercials, digital content, and cinematic experiences that inspire, connect, and leave a lasting impression.",
      philosophy1: "Every frame tells a story.",
      philosophy2: "Cinema begins where imagination meets reality.",
      philosophy3: "Stories live forever when they're told with heart."
    },
    contact: {
      email: "theoldverse@gmail.com",
      phone: "+91 90688 50966",
      location: "Dehradun, Uttarakhand, India",
      instagram: "@theoldverse_",
      instagramUrl: "https://instagram.com/theoldverse_",
      youtube: "@The_oldverse",
      youtubeUrl: "https://youtube.com/@The_oldverse"
    }
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Modals
  const [activeModal, setActiveModal] = useState<"none" | "hero" | "about" | "contact" | "addProject" | "editProject" | "addTeam" | "editTeam">("none");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Forms
  const [projectForm, setProjectForm] = useState({
    title: "",
    short_description: "",
    full_description: "",
    category: "Film",
    poster_url: "",
    banner_url: "",
    trailer_url: "",
    release_date: "2026",
    is_featured: false,
    is_published: true
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    position: "",
    bio: "",
    avatar_url: "",
    instagram_url: "",
    linkedin_url: "",
    is_visible: true
  });

  // Fetch all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cmsRes, projectsRes, teamRes] = await Promise.all([
        fetch("/api/admin/content"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/team")
      ]);

      const [cmsData, projectsData, teamData] = await Promise.all([
        cmsRes.json(),
        projectsRes.json(),
        teamRes.json()
      ]);

      if (cmsData.success && cmsData.content) {
        setCmsContent((prev: any) => ({
          homepage: { ...prev.homepage, ...cmsData.content.homepage },
          about: { ...prev.about, ...cmsData.content.about },
          contact: { ...prev.contact, ...cmsData.content.contact }
        }));
      }

      if (projectsData.success) setProjects(projectsData.projects || []);
      if (teamData.success) setTeamMembers(teamData.team || []);
    } catch {
      showToast("Failed to load live studio content", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Save CMS section
  const handleSaveCmsSection = async (sectionKey: "homepage" | "about" | "contact") => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionKey,
          content: cmsContent[sectionKey]
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Saved ${sectionKey.toUpperCase()} section to live website!`, "success");
        setActiveModal("none");
      } else {
        showToast(data.error || "Failed to save CMS section", "error");
      }
    } catch {
      showToast("Network error saving CMS section", "error");
    } finally {
      setSaving(false);
    }
  };

  // Add / Edit Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEditing = activeModal === "editProject" && editingItem?.id;
      const url = isEditing ? `/api/admin/projects/${editingItem.id}` : "/api/admin/projects";
      const method = isEditing ? "PUT" : "POST";

      const slug = projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          slug: editingItem?.slug || `${slug}-${Date.now().toString().slice(-4)}`
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEditing ? "Project updated live!" : "New project added to website!", "success");
        setActiveModal("none");
        loadAllData();
      } else {
        showToast(data.error || "Failed to save project", "error");
      }
    } catch {
      showToast("Network error saving project", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the live website?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Project "${title}" deleted`, "info");
        loadAllData();
      }
    } catch {
      showToast("Failed to delete project", "error");
    }
  };

  // Add / Edit Team Member
  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEditing = activeModal === "editTeam" && editingItem?.id;
      const url = isEditing ? `/api/admin/team/${editingItem.id}` : "/api/admin/team";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEditing ? "Team member updated!" : "New team member added to website!", "success");
        setActiveModal("none");
        loadAllData();
      } else {
        showToast(data.error || "Failed to save team member", "error");
      }
    } catch {
      showToast("Network error saving team member", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete Team Member
  const handleDeleteTeamMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the live website?`)) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Team member "${name}" removed`, "info");
        loadAllData();
      }
    } catch {
      showToast("Failed to delete team member", "error");
    }
  };

  return (
    <div className="bg-[#050608] min-h-screen text-white font-grotesk selection:bg-[#8DBEFF] selection:text-[#050608]">
      {/* STICKY LIVE VISUAL EDIT TOOLBAR */}
      <header className="sticky top-0 z-[9999] bg-[#0B0E13]/95 backdrop-blur-md border-b border-[#8DBEFF]/30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#8DBEFF]/15 border border-[#8DBEFF]/40 flex items-center justify-center text-[#8DBEFF]">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#8DBEFF] font-bold uppercase tracking-widest">
                VISUAL LIVE EDITOR
              </span>
              <span className="px-2 py-0.5 rounded bg-[#8DBEFF]/20 text-[#8DBEFF] text-[9px] font-mono font-extrabold uppercase border border-[#8DBEFF]/30">
                {editMode ? "EDITING MODE ON" : "PREVIEW MODE"}
              </span>
            </div>
            <h1 className="font-bebas text-xl sm:text-2xl text-white tracking-wider uppercase leading-none">
              TheOldverse Live Site Studio
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
              editMode
                ? "bg-[#8DBEFF] text-[#050608] border-[#8DBEFF] shadow-[0_0_20px_rgba(141,190,255,0.2)]"
                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
            }`}
          >
            {editMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{editMode ? "Visual Editing Active" : "Preview Site"}</span>
          </button>

          <button
            onClick={() => {
              setProjectForm({
                title: "",
                short_description: "",
                full_description: "",
                category: "Film",
                poster_url: "",
                banner_url: "",
                trailer_url: "",
                release_date: "2026",
                is_featured: false,
                is_published: true
              });
              setActiveModal("addProject");
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#8DBEFF] text-white hover:text-[#050608] border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </button>

          <button
            onClick={() => {
              setTeamForm({
                name: "",
                position: "",
                bio: "",
                avatar_url: "",
                instagram_url: "",
                linkedin_url: "",
                is_visible: true
              });
              setActiveModal("addTeam");
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#8DBEFF] text-white hover:text-[#050608] border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Users className="h-4 w-4" />
            <span>Add Team</span>
          </button>

          <Link
            href="/admin/dashboard"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 flex items-center gap-1.5"
          >
            <LayoutDashboard className="h-4 w-4 text-[#8DBEFF]" />
            <span>Dashboard</span>
          </Link>
        </div>
      </header>

      {/* MODALS */}
      {/* 1. Edit Hero Banner CMS Modal */}
      {activeModal === "hero" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#0B0E13] border border-[#8DBEFF]/30 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button onClick={() => setActiveModal("none")} className="absolute top-5 right-5 text-white/40 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">VISUAL CMS EDITOR</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase mt-0.5">Edit Homepage Hero Banner</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveCmsSection("homepage"); }} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Hero Headline Title</label>
                <input
                  type="text"
                  value={cmsContent.homepage.heroTitle || ""}
                  onChange={(e) => setCmsContent({ ...cmsContent, homepage: { ...cmsContent.homepage, heroTitle: e.target.value } })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Subheadline Description</label>
                <textarea
                  rows={3}
                  value={cmsContent.homepage.heroSubtitle || ""}
                  onChange={(e) => setCmsContent({ ...cmsContent, homepage: { ...cmsContent.homepage, heroSubtitle: e.target.value } })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider block">CTA Button Label</label>
                  <input
                    type="text"
                    value={cmsContent.homepage.ctaText || ""}
                    onChange={(e) => setCmsContent({ ...cmsContent, homepage: { ...cmsContent.homepage, ctaText: e.target.value } })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider block">CTA Button Link</label>
                  <input
                    type="text"
                    value={cmsContent.homepage.ctaLink || ""}
                    onChange={(e) => setCmsContent({ ...cmsContent, homepage: { ...cmsContent.homepage, ctaLink: e.target.value } })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Live Hero Headline</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit About CMS Modal */}
      {activeModal === "about" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#0B0E13] border border-[#8DBEFF]/30 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button onClick={() => setActiveModal("none")} className="absolute top-5 right-5 text-white/40 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">VISUAL CMS EDITOR</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase mt-0.5">Edit About Story & Philosophy</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveCmsSection("about"); }} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Studio Story Paragraph</label>
                <textarea
                  rows={4}
                  value={cmsContent.about.storyText || ""}
                  onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, storyText: e.target.value } })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF] resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Philosophy Quote 1</label>
                <input
                  type="text"
                  value={cmsContent.about.philosophy1 || ""}
                  onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, philosophy1: e.target.value } })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Philosophy Quote 2</label>
                <input
                  type="text"
                  value={cmsContent.about.philosophy2 || ""}
                  onChange={(e) => setCmsContent({ ...cmsContent, about: { ...cmsContent.about, philosophy2: e.target.value } })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Live About Story</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add / Edit Project Modal */}
      {(activeModal === "addProject" || activeModal === "editProject") && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#0B0E13] border border-[#8DBEFF]/30 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal("none")} className="absolute top-5 right-5 text-white/40 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">FILM CATALOG CMS</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase mt-0.5">
                {activeModal === "editProject" ? "Edit Film Project" : "Add New Project to Website"}
              </h3>
            </div>
            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Echoes of Dehradun"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider block">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                  >
                    <option value="Film">Film / Movie</option>
                    <option value="Short Film">Short Film</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Originals">TheOldverse Originals</option>
                    <option value="Commercial">Commercial / Brand</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-white uppercase tracking-wider block">Release Year</label>
                  <input
                    type="text"
                    value={projectForm.release_date}
                    onChange={(e) => setProjectForm({ ...projectForm, release_date: e.target.value })}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Short Synopsis *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Brief synopsis shown on project cards..."
                  value={projectForm.short_description}
                  onChange={(e) => setProjectForm({ ...projectForm, short_description: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF] resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Poster Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={projectForm.poster_url}
                  onChange={(e) => setProjectForm({ ...projectForm, poster_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Trailer / Video Stream URL</label>
                <input
                  type="url"
                  placeholder="https://commondatastorage.googleapis.com/..."
                  value={projectForm.trailer_url}
                  onChange={(e) => setProjectForm({ ...projectForm, trailer_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.is_featured}
                    onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                    className="rounded bg-black border-white/20 text-[#8DBEFF]"
                  />
                  <span className="text-xs font-bold text-white">Feature on Hero Carousel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.is_published}
                    onChange={(e) => setProjectForm({ ...projectForm, is_published: e.target.checked })}
                    className="rounded bg-black border-white/20 text-[#8DBEFF]"
                  />
                  <span className="text-xs font-bold text-white">Published Live</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{activeModal === "editProject" ? "Save Live Project" : "Add Project to Website"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Team Member Modal */}
      {(activeModal === "addTeam" || activeModal === "editTeam") && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-[#0B0E13] border border-[#8DBEFF]/30 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal("none")} className="absolute top-5 right-5 text-white/40 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">TEAM ROSTER CMS</span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase mt-0.5">
                {activeModal === "editTeam" ? "Edit Team Member" : "Add Team Member to Website"}
              </h3>
            </div>
            <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Role / Position *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Cinematographer"
                  value={teamForm.position}
                  onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Short Biography *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Brief summary of creative role and work..."
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF] resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white uppercase tracking-wider block">Avatar / Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={teamForm.avatar_url}
                  onChange={(e) => setTeamForm({ ...teamForm, avatar_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#8DBEFF]"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{activeModal === "editTeam" ? "Save Live Member" : "Add Team Member to Website"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIVE VISUAL WEBSITE PREVIEW LAYOUT WITH INLINE EDIT CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 relative">

        {/* SECTION 1: LIVE HERO BANNER */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0B0E13] p-8 sm:p-14 shadow-2xl space-y-6 group">
          {editMode && (
            <button
              onClick={() => setActiveModal("hero")}
              className="absolute top-6 right-6 px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer z-20"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Hero Section</span>
            </button>
          )}

          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8DBEFF] uppercase block">
              THEOLDVERSE PRODUCTIONS • OFFICIAL ARCHIVE
            </span>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white tracking-wider uppercase leading-none">
              {cmsContent.homepage.heroTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#B8C2CC] font-light leading-relaxed">
              {cmsContent.homepage.heroSubtitle}
            </p>
            <div className="pt-2">
              <span className="inline-block px-6 py-3 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider">
                {cmsContent.homepage.ctaText}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE FILM PROJECTS CATALOG */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                LIVE FILM CATALOG & PRODUCTIONS
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider uppercase">
                Featured Projects ({projects.length})
              </h2>
            </div>

            {editMode && (
              <button
                onClick={() => {
                  setProjectForm({
                    title: "",
                    short_description: "",
                    full_description: "",
                    category: "Film",
                    poster_url: "",
                    banner_url: "",
                    trailer_url: "",
                    release_date: "2026",
                    is_featured: false,
                    is_published: true
                  });
                  setActiveModal("addProject");
                }}
                className="px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project to Site</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0B0E13] border border-white/10 rounded-2xl overflow-hidden space-y-4 p-5 hover:border-[#8DBEFF]/40 transition-all relative group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/5">
                    <img
                      src={proj.poster_url || proj.banner_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&fit=crop"}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-[9px] font-mono font-extrabold uppercase bg-black/80 text-[#8DBEFF] border border-white/10">
                      {proj.category || "Film"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-white">{proj.title}</h3>
                    <p className="text-xs text-[#B8C2CC] font-light line-clamp-2 mt-1">
                      {proj.short_description || proj.full_description}
                    </p>
                  </div>
                </div>

                {editMode && (
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        setEditingItem(proj);
                        setProjectForm({
                          title: proj.title || "",
                          short_description: proj.short_description || "",
                          full_description: proj.full_description || "",
                          category: proj.category || "Film",
                          poster_url: proj.poster_url || "",
                          banner_url: proj.banner_url || "",
                          trailer_url: proj.trailer_url || "",
                          release_date: proj.release_date || "2026",
                          is_featured: proj.is_featured || false,
                          is_published: proj.is_published ?? true
                        });
                        setActiveModal("editProject");
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-[#8DBEFF] text-white hover:text-[#050608] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id, proj.title)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: LIVE ABOUT STORY & PHILOSOPHY */}
        <section className="bg-[#0B0E13] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 relative group">
          {editMode && (
            <button
              onClick={() => setActiveModal("about")}
              className="absolute top-6 right-6 px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer z-20"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit About Story</span>
            </button>
          )}

          <div className="space-y-4 max-w-4xl">
            <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
              STUDIO PHILOSOPHY & STORY
            </span>
            <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider uppercase">
              Our Story & Philosophy
            </h2>
            <p className="text-sm text-[#B8C2CC] font-light leading-relaxed">
              {cmsContent.about.storyText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <Quote className="h-5 w-5 text-[#8DBEFF]" />
              <p className="text-xs italic text-white">"{cmsContent.about.philosophy1}"</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <Quote className="h-5 w-5 text-[#8DBEFF]" />
              <p className="text-xs italic text-white">"{cmsContent.about.philosophy2}"</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: LIVE TEAM MEMBERS ROSTER */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                TEAM & VISIONARIES ROSTER
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider uppercase">
                Studio Team ({teamMembers.length})
              </h2>
            </div>

            {editMode && (
              <button
                onClick={() => {
                  setTeamForm({
                    name: "",
                    position: "",
                    bio: "",
                    avatar_url: "",
                    instagram_url: "",
                    linkedin_url: "",
                    is_visible: true
                  });
                  setActiveModal("addTeam");
                }}
                className="px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Team Member</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#0B0E13] border border-white/10 rounded-2xl p-5 text-center space-y-4 hover:border-[#8DBEFF]/40 transition-all relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 mx-auto bg-black/40">
                    <img
                      src={member.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop"}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{member.name || member.full_name}</h3>
                    <span className="text-[10px] text-[#8DBEFF] font-semibold uppercase tracking-wider font-mono block">
                      {member.position || member.role}
                    </span>
                    <p className="text-xs text-[#B8C2CC] font-light mt-2 line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {editMode && (
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        setEditingItem(member);
                        setTeamForm({
                          name: member.name || member.full_name || "",
                          position: member.position || member.role || "",
                          bio: member.bio || "",
                          avatar_url: member.avatar_url || "",
                          instagram_url: member.instagram_url || "",
                          linkedin_url: member.linkedin_url || "",
                          is_visible: member.is_visible ?? true
                        });
                        setActiveModal("editTeam");
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-[#8DBEFF] text-white hover:text-[#050608] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTeamMember(member.id, member.name || member.full_name)}
                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
                      title="Delete Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LiveEditorPage() {
  return (
    <ToastProvider>
      <LiveEditorContent />
    </ToastProvider>
  );
}
