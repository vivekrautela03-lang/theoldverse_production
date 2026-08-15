"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  Image as ImageIcon,
  Film,
  FileText,
  Upload,
  Search,
  Copy,
  Trash2,
  Eye,
  Check,
  RefreshCw,
  ExternalLink,
  Plus,
  X
} from "lucide-react";

export default function AdminMediaLibraryPage() {
  const { showToast } = useToast();

  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<any | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetMedia, setTargetMedia] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Upload Form state
  const [uploadData, setUploadData] = useState({
    name: "",
    file_url: "",
    file_type: "image",
    category: "Projects"
  });
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (typeFilter !== "all") query.set("type", typeFilter);
      if (categoryFilter !== "all") query.set("category", categoryFilter);

      const res = await fetch(`/api/admin/media?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMedia(data.media || []);
      }
    } catch {
      showToast("Failed to fetch media catalog", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search, typeFilter, categoryFilter]);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast("Direct URL copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.name || !uploadData.file_url) {
      showToast("File name and URL are required", "warning");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Media item "${uploadData.name}" added to library!`, "success");
        setUploadModalOpen(false);
        setUploadData({ name: "", file_url: "", file_type: "image", category: "Projects" });
        fetchMedia();
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch {
      showToast("An error occurred during upload", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetMedia) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${targetMedia.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`File "${targetMedia.name}" removed`, "info");
        setDeleteModalOpen(false);
        setTargetMedia(null);
        fetchMedia();
      } else {
        showToast(data.error || "Failed to delete file", "error");
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
        title="Delete Media File"
        message={`Are you sure you want to remove "${targetMedia?.name}" from your media catalog?`}
        confirmLabel="Delete File"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetMedia(null);
        }}
      />

      {/* High Res Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-grotesk">
          <div className="w-full max-w-3xl bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-3xl p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                {previewMedia.category} &bull; {previewMedia.file_type}
              </span>
              <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">{previewMedia.name}</h3>
            </div>

            <div className="w-full max-h-[60vh] overflow-hidden rounded-2xl border border-white/10 bg-black flex items-center justify-center">
              {previewMedia.file_type === "video" ? (
                <video src={previewMedia.file_url} controls className="max-h-[55vh] w-auto" />
              ) : (
                <img src={previewMedia.file_url} alt={previewMedia.name} className="max-h-[55vh] object-contain" />
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-white/40 font-mono text-[10px] truncate max-w-md">
                {previewMedia.file_url}
              </span>
              <button
                onClick={() => copyUrl(previewMedia.file_url, previewMedia.id)}
                className="px-4 py-2 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-grotesk">
          <div className="w-full max-w-md bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-3xl p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                SUPABASE STORAGE CATALOG
              </span>
              <h3 className="font-bebas text-2xl tracking-wider text-white uppercase mt-0.5">
                Register Media Asset
              </h3>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero-Banner-4K.png"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Direct File URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://commondatastorage.googleapis.com/..."
                  value={uploadData.file_url}
                  onChange={(e) => setUploadData({ ...uploadData, file_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">File Type</label>
                  <select
                    value={uploadData.file_type}
                    onChange={(e) => setUploadData({ ...uploadData, file_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Document / PDF</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Category</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  >
                    <option value="Projects">Projects</option>
                    <option value="Posters">Posters</option>
                    <option value="Trailers">Trailers</option>
                    <option value="Team">Team</option>
                    <option value="Website">Website</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>Save to Media Catalog</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main View */}
      <div className="space-y-6 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Media Asset Library
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Supabase Storage asset grid for film posters, trailers, banners, branding assets, and PDF documents.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Media Asset</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-[#8DBEFF]" />
            <input
              type="text"
              placeholder="Search filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
            >
              <option value="all">All File Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
            >
              <option value="all">All Categories</option>
              <option value="Projects">Projects</option>
              <option value="Posters">Posters</option>
              <option value="Trailers">Trailers</option>
              <option value="Team">Team</option>
              <option value="Website">Website</option>
              <option value="Branding">Branding</option>
            </select>

            <button
              onClick={fetchMedia}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-[#0B0E13] border border-white/5 rounded-2xl">
            <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
            <p className="text-xs text-[#B8C2CC]">Loading media library...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="p-16 text-center space-y-4 bg-[#0B0E13] border border-white/5 rounded-2xl shadow-xl">
            <ImageIcon className="h-12 w-12 text-white/20 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Media Assets Found</h4>
              <p className="text-xs text-[#B8C2CC] font-light max-w-sm mx-auto">
                No files match your current filters. Click below to add files to the media catalog.
              </p>
            </div>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold text-xs uppercase tracking-wider"
            >
              <Plus className="h-4 w-4" />
              Upload Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:border-[rgba(141,190,255,0.3)] transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                  {item.file_type === "video" ? (
                    <video src={item.file_url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.file_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewMedia(item)}
                      className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/40 transition-colors"
                      title="Preview File"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => copyUrl(item.file_url, item.id)}
                      className="p-2 rounded-xl bg-[#8DBEFF] text-[#050608] hover:bg-[#CFE8FF] transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setTargetMedia(item);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info Card Footer */}
                <div className="p-3 space-y-1 bg-[#0B0E13]">
                  <span className="text-[9px] uppercase font-mono font-bold text-[#8DBEFF] tracking-wider block">
                    {item.category || "General"}
                  </span>
                  <h4 className="font-bold text-xs text-white truncate" title={item.name}>
                    {item.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
