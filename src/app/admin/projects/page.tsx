"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  Film,
  Plus,
  Search,
  Filter,
  Star,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Check
} from "lucide-react";

export default function AdminProjectsPage() {
  const { showToast } = useToast();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetProject, setTargetProject] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (categoryFilter !== "all") query.set("category", categoryFilter);
      if (statusFilter !== "all") query.set("status", statusFilter);

      const res = await fetch(`/api/admin/projects?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch {
      showToast("Failed to fetch projects database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, categoryFilter, statusFilter]);

  const togglePublish = async (project: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !project.is_published }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Project "${project.title}" ${!project.is_published ? "Published" : "Unpublished"}`, "success");
        fetchProjects();
      }
    } catch {
      showToast("Failed to update publish state", "error");
    }
  };

  const toggleFeatured = async (project: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !project.is_featured }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Project "${project.title}" featured toggle updated`, "success");
        fetchProjects();
      }
    } catch {
      showToast("Failed to update featured state", "error");
    }
  };

  const handleDuplicate = async (project: any) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...project,
          id: undefined,
          title: `${project.title} (Copy)`,
          slug: `${project.slug}-copy-${Date.now().toString(36)}`,
          is_published: false
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Project "${project.title}" duplicated successfully`, "success");
        fetchProjects();
      }
    } catch {
      showToast("Failed to duplicate project", "error");
    }
  };

  const handleDelete = async () => {
    if (!targetProject) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${targetProject.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Project "${targetProject.title}" deleted`, "info");
        setDeleteModalOpen(false);
        setTargetProject(null);
        fetchProjects();
      } else {
        showToast(data.error || "Failed to delete project", "error");
      }
    } catch {
      showToast("An error occurred during project deletion", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Film Project"
        message={`Are you sure you want to permanently delete "${targetProject?.title}"? This action cannot be undone and will remove it from the public website.`}
        confirmLabel="Delete Project"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetProject(null);
        }}
      />

      <div className="space-y-6 font-grotesk">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Film & Series Projects Manager
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Create, edit, feature, and publish projects to TheOldverse public platform archive.
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Project</span>
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-96 flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-[#8DBEFF]" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
            >
              <option value="all">All Categories</option>
              <option value="Film">Film</option>
              <option value="Series">Series</option>
              <option value="Music">Music</option>
              <option value="Commercial">Commercial</option>
              <option value="Spotlight">Spotlight</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Production">In Production</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>

            <button
              onClick={fetchProjects}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Projects Grid / Table */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
              <p className="text-xs text-[#B8C2CC]">Loading projects database...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <Film className="h-12 w-12 text-white/20 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Projects Found</h4>
                <p className="text-xs text-[#B8C2CC] font-light max-w-sm mx-auto">
                  No project entries match your search criteria. Create a new project or reset your filters.
                </p>
              </div>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold text-xs uppercase tracking-wider"
              >
                <Plus className="h-4 w-4" />
                Add New Project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-grotesk">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest">
                  <tr>
                    <th className="py-4 px-5">Poster / Project</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-center">Featured</th>
                    <th className="py-4 px-4 text-center">Published</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={project.poster_url}
                            alt={project.title}
                            className="h-16 w-11 object-cover rounded-xl border border-white/10 shadow-md shrink-0"
                          />
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-white">{project.title}</h4>
                            <p className="text-[11px] text-[#B8C2CC] font-light line-clamp-1 max-w-xs sm:max-w-md">
                              {project.short_description}
                            </p>
                            <span className="text-[9px] font-mono text-[#8DBEFF]/80 block">
                              /{project.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-white/80">{project.category}</td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white">
                          {project.status}
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleFeatured(project)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            project.is_featured
                              ? "bg-[#8DBEFF]/15 border-[#8DBEFF]/40 text-[#8DBEFF]"
                              : "border-white/10 text-white/30 hover:text-white"
                          }`}
                          title={project.is_featured ? "Featured on Hero / Homepage" : "Click to feature"}
                        >
                          <Star className={`h-4 w-4 ${project.is_featured ? "fill-[#8DBEFF]" : ""}`} />
                        </button>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePublish(project)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            project.is_published
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                              : "bg-white/5 border border-white/10 text-white/40"
                          }`}
                        >
                          {project.is_published ? "Live" : "Draft"}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleDuplicate(project)}
                          className="p-2 rounded-xl border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors cursor-pointer"
                          title="Duplicate Project"
                        >
                          <Copy className="h-4 w-4" />
                        </button>

                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-2 inline-block rounded-xl border border-[#8DBEFF]/30 hover:border-[#8DBEFF] bg-[#8DBEFF]/10 text-[#8DBEFF] transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => {
                            setTargetProject(project);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-red-500/20 hover:border-red-500/50 bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                          title="Delete Project"
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
