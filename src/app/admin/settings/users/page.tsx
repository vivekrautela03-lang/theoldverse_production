"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  Users,
  Plus,
  Shield,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  UserPlus
} from "lucide-react";

export default function AdminUsersManagementPage() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "editor"
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch {
      showToast("Failed to fetch admin users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) {
      showToast("Email and password are required", "warning");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Admin user "${newUser.email}" created!`, "success");
        setModalOpen(false);
        setNewUser({ full_name: "", email: "", password: "", role: "editor" });
        fetchUsers();
      } else {
        showToast(data.error || "Failed to create user", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setCreating(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("User role updated successfully", "success");
        fetchUsers();
      }
    } catch {
      showToast("Failed to update role", "error");
    }
  };

  const handleDelete = async () => {
    if (!targetUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User "${targetUser.email}" removed`, "info");
        setDeleteModalOpen(false);
        setTargetUser(null);
        fetchUsers();
      } else {
        showToast(data.error || "Failed to remove user", "error");
      }
    } catch {
      showToast("An error occurred during removal", "error");
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      "admin": "bg-red-500/15 border-red-500/30 text-red-400",
      "editor": "bg-[#8DBEFF]/15 border-[#8DBEFF]/30 text-[#8DBEFF]",
      "viewer": "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
    };
    return badges[role] || "bg-white/5 border-white/10 text-white";
  };

  return (
    <AdminLayout>
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Remove Administrator User"
        message={`Are you sure you want to remove user "${targetUser?.email}"? They will lose access to the Admin Panel.`}
        confirmLabel="Remove User"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTargetUser(null);
        }}
      />

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-grotesk">
          <div className="w-full max-w-md bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-3xl p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                ACCESS CONTROL
              </span>
              <h3 className="font-bebas text-2xl tracking-wider text-white uppercase mt-0.5">
                Add Administrator Account
              </h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Production Manager"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="editor@theoldverse.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Initial Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">System Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                >
                  <option value="editor">Editor (Projects, CMS, Media)</option>
                  <option value="admin">Admin (Full Control)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                {creating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                <span>Create User Account</span>
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
              Admin Users & Access Control (RBAC)
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Manage accounts and permission levels: Administrator (Full access), Editor (Content manager), Viewer (Read-only).
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Admin User</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
              <p className="text-xs text-[#B8C2CC]">Loading user accounts...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Users className="h-12 w-12 text-white/20 mx-auto" />
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Users Found</h4>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-grotesk">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest">
                  <tr>
                    <th className="py-4 px-5">User</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4">Joined Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop"}
                            alt={u.full_name}
                            className="h-9 w-9 rounded-xl object-cover border border-white/10"
                          />
                          <div>
                            <span className="font-bold text-white block">{u.full_name || "Admin"}</span>
                            <span className="text-[11px] text-white/50 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={u.role || "user"}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border bg-black/40 ${getRoleBadge(u.role || "user")}`}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                          <option value="user">User</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-white/40 font-mono text-[11px]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => {
                            setTargetUser(u);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-white/40 hover:text-red-400 rounded-xl transition-colors"
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
