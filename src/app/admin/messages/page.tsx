"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Mail,
  Trash2,
  RefreshCw,
  X,
  Archive,
  Clock
} from "lucide-react";

export default function AdminMessagesPage() {
  const { showToast } = useToast();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetMessage, setTargetMessage] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (statusFilter !== "all") query.set("status", statusFilter);

      const res = await fetch(`/api/admin/messages?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch {
      showToast("Failed to fetch contact inquiries", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search, statusFilter]);

  const updateStatus = async (msgId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${msgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Message status updated to "${newStatus}"`, "success");
        if (selectedMessage && selectedMessage.id === msgId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
        fetchMessages();
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!targetMessage) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${targetMessage.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Inquiry message deleted", "info");
        setDeleteModalOpen(false);
        if (selectedMessage && selectedMessage.id === targetMessage.id) {
          setSelectedMessage(null);
        }
        setTargetMessage(null);
        fetchMessages();
      } else {
        showToast(data.error || "Failed to delete message", "error");
      }
    } catch {
      showToast("An error occurred during deletion", "error");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      "new": "bg-[#8DBEFF]/15 border-[#8DBEFF]/30 text-[#8DBEFF]",
      "read": "bg-blue-500/15 border-blue-500/30 text-blue-400",
      "contacted": "bg-[#8DBEFF]/15 border-[#8DBEFF]/30 text-[#8DBEFF]",
      "resolved": "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      "archived": "bg-white/5 border-white/10 text-white/40"
    };
    return badges[status] || "bg-white/5 border-white/10 text-white";
  };

  return (
    <AdminLayout>
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Inquiry Message"
        message={`Are you sure you want to delete the message from "${targetMessage?.name}"?`}
        confirmLabel="Delete Message"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetMessage(null);
        }}
      />

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-grotesk">
          <div className="w-full max-w-xl bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(selectedMessage.status || "new")}`}>
                  {selectedMessage.status || "new"}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
              </div>
              <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">{selectedMessage.subject}</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{selectedMessage.name}</p>
                  <p className="text-white/60 font-mono text-[11px]">{selectedMessage.email}</p>
                </div>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="px-3.5 py-2 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-white/90 leading-relaxed font-light whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(selectedMessage.id, "contacted")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8DBEFF] border border-[#8DBEFF]/20 font-semibold"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => updateStatus(selectedMessage.id, "resolved")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                >
                  Mark Resolved
                </button>
              </div>

              <button
                onClick={() => {
                  setTargetMessage(selectedMessage);
                  setDeleteModalOpen(true);
                }}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View */}
      <div className="space-y-6 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Client & Contact Inquiries
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Review and manage incoming message inquiries submitted via the website contact form.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-[#8DBEFF]" />
            <input
              type="text"
              placeholder="Search sender, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#8DBEFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {["all", "new", "read", "contacted", "resolved", "archived"].map((st) => (
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
              onClick={fetchMessages}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer ml-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Messages List Table */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
              <p className="text-xs text-[#B8C2CC]">Loading contact messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <MessageSquare className="h-12 w-12 text-white/20 mx-auto" />
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Contact Messages</h4>
              <p className="text-xs text-[#B8C2CC] font-light">No inquiry submissions found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-grotesk">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest">
                  <tr>
                    <th className="py-4 px-5">Sender</th>
                    <th className="py-4 px-4">Subject</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === "new") updateStatus(msg.id, "read");
                      }}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5">
                        <div>
                          <span className="font-bold text-white block">{msg.name}</span>
                          <span className="text-[11px] text-white/50 font-mono">{msg.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-white block">{msg.subject}</span>
                        <p className="text-[11px] text-[#B8C2CC] line-clamp-1 max-w-sm font-light">
                          {msg.message}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-white/40 font-mono text-[11px] whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getStatusBadge(msg.status || "new")}`}>
                          {msg.status || "new"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetMessage(msg);
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
