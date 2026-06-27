"use client";

import React, { useState, useEffect } from "react";
import { Landmark, ShieldAlert, Users, Key, Database, RefreshCw, CheckCircle, Search, Lock, Mail, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  ip: string;
  userAgent: string;
  details: string;
}

interface UserRecord {
  id: string;
  name: string;
  emailOrPhone: string;
  isAdmin: boolean;
  isCreator: boolean;
  failedLogins: number;
  lockedUntil?: string;
}

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<"users" | "otp" | "logs">("users");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [otpTarget, setOtpTarget] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  
  // Step-Up Security state variables
  const [sudoRequired, setSudoRequired] = useState(true);
  const [sudoEmail, setSudoEmail] = useState("theoldverse@gmail.com");
  const [sudoPassword, setSudoPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [logQuery, setLogQuery] = useState("");
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    const response = await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get-users" })
    });
    if (response.status === 401) {
      setSudoRequired(true);
      return false;
    }
    const data = await response.json();
    if (data.success) {
      setUsers(data.users);
      return true;
    }
    return false;
  };

  const fetchLogs = async () => {
    const response = await fetch("/api/admin/logs");
    if (response.status === 401) {
      setSudoRequired(true);
      return false;
    }
    const data = await response.json();
    if (data.success) {
      setLogs(data.logs);
      return true;
    }
    return false;
  };

  const loadData = async () => {
    setLoading(true);
    const successUsers = await fetchUsers();
    const successLogs = await fetchLogs();
    if (successUsers && successLogs) {
      setSudoRequired(false);
    }
    setLoading(false);
  };

  // Sync dashboard data safely
  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      setLoading(true);
      const successUsers = await fetchUsers();
      const successLogs = await fetchLogs();
      if (isMounted) {
        if (successUsers && successLogs) {
          setSudoRequired(false);
        }
        setLoading(false);
      }
    };
    initialize();
    return () => { isMounted = false; };
  }, []);

  // Step-Up Actions
  const handleVerifySudoPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const response = await fetch("/api/admin/stepup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sudoEmail, password: sudoPassword })
      });
      const data = await response.json();
      if (data.success) {
        setSudoRequired(false);
        setSudoPassword("");
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ["#F5A623", "#FFFFFF"]
        });
        loadData();
      } else {
        setAuthError(data.error || "Invalid password.");
      }
    } catch {
      setAuthError("Network error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateRole = async (targetId: string, updates: { isAdmin?: boolean; isCreator?: boolean }) => {
    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-role", targetId, roleUpdates: updates })
      });
      if (response.status === 401) {
        setSudoRequired(true);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "User roles updated successfully." });
        fetchUsers();
        fetchLogs();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to update roles." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Network error occurred." });
    }
  };

  const handleGenerateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpTarget.trim()) return;

    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-otp", emailOrPhone: otpTarget })
      });
      if (response.status === 401) {
        setSudoRequired(true);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setGeneratedOtp(data.code);
        setActionMessage({ type: "success", text: `OTP generated for ${otpTarget}` });
        fetchLogs();
        confetti({
          particleCount: 50,
          spread: 40,
          colors: ["#F5A623", "#FFFFFF"]
        });
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to generate OTP." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Network error occurred." });
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.emailOrPhone.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredLogs = logs.filter(l => 
    l.event.toLowerCase().includes(logQuery.toLowerCase()) ||
    l.details.toLowerCase().includes(logQuery.toLowerCase()) ||
    l.ip.includes(logQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin"></div>
          <span className="text-xs text-oldverse-secondary tracking-widest font-grotesk uppercase">Loading Secure Console...</span>
        </div>
      </div>
    );
  }

  // --- Step-Up Authentication Locked Gatekeeper Screen ---
  if (sudoRequired) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center pt-24 px-4">
        <div className="max-w-md w-full bg-oldverse-card/40 border border-white/5 p-8 rounded-2xl backdrop-blur-md space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 bg-oldverse-accent/15 rounded-full flex items-center justify-center mx-auto border border-oldverse-accent/25">
              <Lock className="h-6 w-6 text-oldverse-accent" />
            </div>
            <h2 className="font-bebas text-3xl tracking-wider text-oldverse-text uppercase">Sudo Authorization</h2>
            <p className="text-[10px] text-oldverse-secondary font-light uppercase tracking-widest">
              Confirm Admin Password to Access Console
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-oldverse-error/5 border border-oldverse-error/20 text-oldverse-error text-xs rounded-lg text-center font-grotesk font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleVerifySudoPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-oldverse-secondary uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Admin Email
              </label>
              <input
                type="email"
                value={sudoEmail}
                onChange={(e) => setSudoEmail(e.target.value)}
                className="w-full text-xs p-3 bg-black/40 border border-white/10 rounded-xl text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors border-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-oldverse-secondary uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Confirm Admin Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={sudoPassword}
                onChange={(e) => setSudoPassword(e.target.value)}
                className="w-full text-xs p-3 bg-black/40 border border-white/10 rounded-xl text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-[#F5A623] hover:bg-[#F5A623]/85 text-xs text-black font-bebas font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? "Unlocking Console..." : (
                <>
                  Unlock Console <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Authorized Dashboard Panel View ---
  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <Landmark className="h-10 w-10 text-oldverse-accent animate-pulse" />
            <div>
              <h1 className="font-bebas text-4xl sm:text-5xl tracking-widest text-oldverse-text uppercase leading-none">
                System Administration Control
              </h1>
              <p className="text-xs text-oldverse-secondary font-light uppercase tracking-wider mt-1">
                Gated Environment &bull; Authorized Personnel Only
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-oldverse-accent/30 bg-white/3 hover:bg-white/5 rounded-lg text-xs font-grotesk font-semibold text-oldverse-text tracking-wide transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Dashboard Data
          </button>
        </div>

        {/* Global Notifications Area */}
        {actionMessage && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 animate-slide-down ${
            actionMessage.type === "success" 
              ? "bg-green-500/5 border-green-500/25 text-green-400" 
              : "bg-oldverse-error/5 border-oldverse-error/25 text-oldverse-error"
          }`}>
            {actionMessage.type === "success" ? <CheckCircle className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            <span className="text-xs font-grotesk font-medium">{actionMessage.text}</span>
            <button className="ml-auto text-xs opacity-60 hover:opacity-100" onClick={() => setActionMessage(null)}>×</button>
          </div>
        )}

        {/* Tabs System & Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Tabs Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === "users" 
                  ? "bg-oldverse-accent text-oldverse-bg font-black" 
                  : "bg-oldverse-card/50 border border-white/5 text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>User Directory</span>
            </button>
            <button
              onClick={() => setActiveTab("otp")}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === "otp" 
                  ? "bg-oldverse-accent text-oldverse-bg font-black" 
                  : "bg-oldverse-card/50 border border-white/5 text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <Key className="h-4.5 w-4.5" />
              <span>OTP Generator</span>
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-3 p-4 rounded-xl font-grotesk text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === "logs" 
                  ? "bg-oldverse-accent text-oldverse-bg font-black" 
                  : "bg-oldverse-card/50 border border-white/5 text-oldverse-secondary hover:text-oldverse-text hover:bg-white/5"
              }`}
            >
              <Database className="h-4.5 w-4.5" />
              <span>Security Audits</span>
            </button>
          </div>

          {/* Active Panel View */}
          <div className="lg:col-span-3 bg-oldverse-card/30 border border-white/5 rounded-2xl p-6 min-h-[400px]">
            
            {/* 1. User Directory Control Panel */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bebas text-2xl tracking-wider text-oldverse-text uppercase">User Directory</h3>
                    <p className="text-[10px] text-oldverse-secondary font-light">Promote team members to administrators or creators, or track locking statuses.</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-oldverse-secondary" />
                    <input
                      type="text"
                      placeholder="Filter directory..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full sm:w-60 bg-black/40 border border-white/10 rounded-lg text-xs text-oldverse-text placeholder-white/30 focus:outline-none focus:border-oldverse-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-white/5 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/5 text-oldverse-secondary uppercase font-grotesk tracking-widest text-[9px]">
                        <th className="p-4">Name</th>
                        <th className="p-4">Identifier</th>
                        <th className="p-4 text-center">Creator Role</th>
                        <th className="p-4 text-center">Admin Role</th>
                        <th className="p-4 text-right">Account Lock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-light">
                      {filteredUsers.map((u) => {
                        const isLocked = u.lockedUntil ? new Date(u.lockedUntil) > new Date() : false;
                        return (
                          <tr key={u.id} className="hover:bg-white/2 transition-colors">
                            <td className="p-4 font-bold text-oldverse-text">{u.name}</td>
                            <td className="p-4 text-oldverse-secondary font-mono">{u.emailOrPhone}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleUpdateRole(u.id, { isCreator: !u.isCreator })}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  u.isCreator 
                                    ? "bg-[#F5A623]/20 text-[#F5A623] hover:bg-[#F5A623]/30" 
                                    : "bg-white/5 text-white/50 hover:bg-white/10"
                                }`}
                              >
                                {u.isCreator ? "Active" : "Disabled"}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleUpdateRole(u.id, { isAdmin: !u.isAdmin })}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  u.isAdmin 
                                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                                    : "bg-white/5 text-white/50 hover:bg-white/10"
                                }`}
                              >
                                {u.isAdmin ? "Administrator" : "Disabled"}
                              </button>
                            </td>
                            <td className="p-4 text-right font-mono">
                              {isLocked ? (
                                <span className="text-oldverse-error font-bold uppercase text-[9px] bg-oldverse-error/15 px-2 py-0.5 rounded border border-oldverse-error/25 font-black">Locked</span>
                              ) : (
                                <span className="text-green-500 font-bold uppercase text-[9px] bg-green-500/15 px-2 py-0.5 rounded border border-green-500/25">Active</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-oldverse-secondary font-light">No matching users found in the database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. Emergency OTP Generator Control Panel */}
            {activeTab === "otp" && (
              <div className="space-y-6 max-w-xl animate-fade-in">
                <div>
                  <h3 className="font-bebas text-2xl tracking-wider text-oldverse-text uppercase">One-Time Passcode Generator</h3>
                  <p className="text-[10px] text-oldverse-secondary font-light">Generate secure bypass credentials for emergency operations or support tickets.</p>
                </div>

                <form onSubmit={handleGenerateOtp} className="space-y-4 pt-4 border-t border-white/5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-oldverse-secondary uppercase font-bold tracking-wider block">Target User Email or Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. theoldverse@gmail.com"
                      value={otpTarget}
                      onChange={(e) => setOtpTarget(e.target.value)}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F5A623] hover:bg-[#F5A623]/85 text-xs text-black font-bebas tracking-widest uppercase rounded-xl transition-all cursor-pointer font-bold"
                  >
                    Generate Passcode
                  </button>
                </form>

                {generatedOtp && (
                  <div className="bg-oldverse-accent/5 border border-oldverse-accent/25 rounded-xl p-5 space-y-3 animate-slide-down">
                    <span className="text-[10px] text-oldverse-accent uppercase tracking-widest font-bold block">One-Time Code Generated Successfully:</span>
                    <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/5">
                      <span className="font-mono text-3xl font-bold tracking-widest text-white">{generatedOtp}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedOtp);
                          setActionMessage({ type: "success", text: "OTP code copied to clipboard." });
                        }}
                        className="text-[10px] text-[#F5A623] font-bold uppercase tracking-wider hover:underline"
                      >
                        Copy Code
                      </button>
                    </div>
                    <p className="text-[9px] text-oldverse-secondary leading-normal font-light">
                      This OTP is now active in memory and is valid for a single verification session. It will be destroyed immediately upon successful verification.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Security Audit Logs Control Panel */}
            {activeTab === "logs" && (
              <div className="space-y-6 animate-fade-in font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bebas text-2xl tracking-wider text-oldverse-text uppercase">Security Audit Trails</h3>
                    <p className="text-[10px] text-oldverse-secondary font-light">Monitors real-time logs including lockout alerts, authentication failures, rate limit blocks, and administration adjustments.</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-oldverse-secondary" />
                    <input
                      type="text"
                      placeholder="Search log triggers..."
                      value={logQuery}
                      onChange={(e) => setLogQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full sm:w-60 bg-black/40 border border-white/10 rounded-lg text-xs text-oldverse-text placeholder-white/30 focus:outline-none focus:border-oldverse-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-white/5 rounded-xl max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/5 text-oldverse-secondary uppercase font-grotesk tracking-widest text-[9px] sticky top-0 backdrop-blur-md">
                        <th className="p-4">Time</th>
                        <th className="p-4">Trigger</th>
                        <th className="p-4">IP Address</th>
                        <th className="p-4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-light text-[10px]">
                      {filteredLogs.map((l) => {
                        const isAlert = l.event.includes("FAIL") || l.event.includes("BLOCKED") || l.event.includes("LOCKOUT") || l.event.includes("ERROR");
                        return (
                          <tr key={l.id} className={`hover:bg-white/2 transition-colors ${isAlert ? "text-red-400 bg-red-500/2 font-medium" : "text-white/80"}`}>
                            <td className="p-4 whitespace-nowrap text-oldverse-secondary">{new Date(l.timestamp).toLocaleTimeString()}</td>
                            <td className="p-4 font-bold whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                                isAlert 
                                  ? "bg-red-500/10 border-red-500/20 text-red-400" 
                                  : "bg-green-500/10 border-green-500/20 text-green-400"
                              }`}>
                                {l.event}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap text-oldverse-secondary">{l.ip}</td>
                            <td className="p-4 min-w-[250px] leading-relaxed text-left">{l.details}</td>
                          </tr>
                        );
                      })}
                      {filteredLogs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-oldverse-secondary font-light">No audit log records match filter query.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
