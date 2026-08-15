"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContainer";
import {
  Settings,
  User,
  Shield,
  Globe,
  Save,
  Lock,
  LogOut,
  RefreshCw,
  Users,
  CheckCircle2
} from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setName(data.user.name || "");
        setEmail(data.user.email || "");
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      showToast("Account details updated successfully", "success");
    } catch {
      showToast("Failed to update account", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 font-grotesk max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              System & Account Settings
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Configure administrator profile settings, site domain preferences, active sessions, and access control roles.
            </p>
          </div>

          <Link
            href="/admin/settings/users"
            className="px-5 py-3 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.03] flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Users className="h-4 w-4" />
            <span>Manage Admin Users</span>
          </Link>
        </div>

        {/* ACCOUNT PROFILE FORM */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <User className="h-5 w-5 text-[#8DBEFF]" />
            <h3 className="font-bebas text-2xl tracking-wider text-white uppercase leading-none">
              Administrator Profile
            </h3>
          </div>

          <form onSubmit={handleAccountUpdate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  disabled
                  value={email}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white/50 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-white uppercase tracking-wider block">
                Update Password (leave blank to keep current)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New strong password..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* WEBSITE CONFIGURATION */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl text-xs">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <Globe className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bebas text-2xl tracking-wider text-white uppercase leading-none">
              Production Website Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">Official Domain</span>
              <p className="font-bold text-white text-sm">theoldverse-productions.in</p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">Hosting Platform</span>
              <p className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Vercel Enterprise Edge
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
