"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { useToast } from "@/components/admin/ToastContainer";
import {
  Users,
  Shield,
  ShieldAlert,
  Crown,
  Trash2,
  RefreshCw,
  X,
  UserPlus,
  Lock,
  UserCheck,
  UserX
} from "lucide-react";

export default function AdminUsersManagementPage() {
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState<any>(null);
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

  const fetchUsersAndSelf = async () => {
    setLoading(true);
    try {
      const [meRes, usersRes] = await Promise.all([
        fetch("/api/admin/auth/me"),
        fetch("/api/admin/users")
      ]);
      const meData = await meRes.json();
      const usersData = await usersRes.json();

      if (meData.success) setCurrentUser(meData.user);
      if (usersData.success) setUsers(usersData.users || []);
    } catch {
      showToast("Failed to fetch user accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndSelf();
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
        showToast(`User "${newUser.email}" created with role "${newUser.role}"!`, "success");
        setModalOpen(false);
        setNewUser({ full_name: "", email: "", password: "", role: "editor" });
        fetchUsersAndSelf();
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
        fetchUsersAndSelf();
      } else {
        showToast(data.error || "Failed to update role", "error");
      }
    } catch {
      showToast("Failed to update role", "error");
    }
  };

  const toggleStatus = async (user: any) => {
    const nextStatus = user.status === "disabled" ? "active" : "disabled";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User access ${nextStatus === "active" ? "Enabled" : "Disabled"}`, "info");
        fetchUsersAndSelf();
      } else {
        showToast(data.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Failed to update status", "error");
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
        fetchUsersAndSelf();
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
      "owner": "bg-amber-500/15 border-amber-500/40 text-amber-400 font-extrabold",
      "admin": "bg-red-500/15 border-red-500/30 text-red-400 font-bold",
      "editor": "bg-[#8DBEFF]/15 border-[#8DBEFF]/30 text-[#8DBEFF] font-bold",
      "customer": "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
    };
    return badges[role] || "bg-white/5 border-white/10 text-white";
  };

  const isCurrentOwner = currentUser?.role === "owner";

  return (
    <AdminLayout>
      <AdminConfirmModal
        isOpen={deleteModalOpen}
        title="Remove User Account"
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
                ROLE AUTHORIZATION
              </span>
              <h3 className="font-bebas text-2xl tracking-wider text-white uppercase mt-0.5">
                Create Admin or Editor User
              </h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Associate Producer"
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
                  placeholder="staff@theoldverse.com"
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
                <label className="font-semibold text-white uppercase tracking-wider block">Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                >
                  <option value="editor">Editor (Projects, Media & CMS)</option>
                  <option value="admin">Admin (Staff & Content Manager)</option>
                  {isCurrentOwner && <option value="owner">Owner (Full System Authority)</option>}
                  <option value="customer">Customer (No Admin Access)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                {creating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                <span>Register User Account</span>
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
              User Access & Role Authorization
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Role Hierarchy: <span className="text-amber-400 font-bold">Owner</span> (Full System Control) &gt; <span className="text-red-400 font-bold">Admin</span> &gt; <span className="text-[#8DBEFF] font-bold">Editor</span> &gt; <span className="text-emerald-400 font-bold">Customer</span> (Public User).
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Admin / Editor User</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
              <p className="text-xs text-[#B8C2CC]">Loading authorization profiles...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Users className="h-12 w-12 text-white/20 mx-auto" />
              <h4 className="font-bebas text-2xl tracking-wider text-white uppercase">No Profiles Registered</h4>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-grotesk">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest">
                  <tr>
                    <th className="py-4 px-5">User Profile</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Registered Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => {
                    const isOwnerProfile = u.role === "owner";
                    const isProtected = isOwnerProfile && !isCurrentOwner;

                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop"}
                              alt={u.full_name}
                              className="h-9 w-9 rounded-xl object-cover border border-white/10"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white block">{u.full_name || "User"}</span>
                                {isOwnerProfile && (
                                  <span title="Studio Owner">
                                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-white/50 font-mono">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {isProtected ? (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border bg-amber-500/15 border-amber-500/40 text-amber-400 flex items-center gap-1.5 w-fit">
                              <Crown className="h-3 w-3" />
                              OWNER (LOCKED)
                            </span>
                          ) : (
                            <select
                              value={u.role || "customer"}
                              disabled={isProtected}
                              onChange={(e) => updateRole(u.id, e.target.value)}
                              className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider border bg-black/40 ${getRoleBadge(u.role || "customer")}`}
                            >
                              {isCurrentOwner && <option value="owner">Owner</option>}
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                              <option value="customer">Customer</option>
                            </select>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <button
                            disabled={isProtected}
                            onClick={() => toggleStatus(u)}
                            className={`px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border cursor-pointer ${
                              u.status === "disabled"
                                ? "bg-red-500/15 border-red-500/30 text-red-400"
                                : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                            }`}
                          >
                            {u.status === "disabled" ? "Disabled" : "Active"}
                          </button>
                        </td>

                        <td className="py-4 px-4 text-white/40 font-mono text-[11px]">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>

                        <td className="py-4 px-5 text-right">
                          {isProtected ? (
                            <span className="p-2 text-white/20 cursor-not-allowed inline-block" title="Owner cannot be removed by non-owner admins">
                              <Lock className="h-4 w-4" />
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setTargetUser(u);
                                setDeleteModalOpen(true);
                              }}
                              className="p-2 text-white/40 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
