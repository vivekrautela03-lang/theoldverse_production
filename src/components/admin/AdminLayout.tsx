"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Video,
  Users,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Briefcase,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Shield,
  ExternalLink,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { ToastProvider, useToast } from "./ToastContainer";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "editor" | "viewer" | string;
}

interface AdminLayoutContentProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newApplications, setNewApplications] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch admin profile
  const fetchAdminUser = async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser({
          id: "sys-admin",
          email: "theoldverse@gmail.com",
          name: "System Admin",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop",
          role: "admin"
        });
      }
    } catch {
      setUser({
        id: "sys-admin",
        email: "theoldverse@gmail.com",
        name: "System Admin",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop",
        role: "admin"
      });
    } finally {
      setLoadingUser(false);
    }
  };

  // Fetch badges and notifications
  const fetchBadges = async () => {
    try {
      const [msgRes, appRes, notifRes] = await Promise.all([
        fetch("/api/admin/messages?status=new"),
        fetch("/api/admin/applications?status=new"),
        fetch("/api/admin/notifications")
      ]);

      const [msgData, appData, notifData] = await Promise.all([
        msgRes.json(),
        appRes.json(),
        notifRes.json()
      ]);

      if (msgData.success) setUnreadMessages(msgData.messages.length);
      if (appData.success) setNewApplications(appData.applications.length);
      if (notifData.success) setNotifications(notifData.notifications || []);
    } catch {
      // Ignore background sync errors
    }
  };

  useEffect(() => {
    fetchAdminUser();
    fetchBadges();
    const interval = setInterval(fetchBadges, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    showToast("Signed out successfully", "info");
    router.push("/admin/login");
  };

  const allNavItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: Film },
    { label: "Productions", href: "/admin/productions", icon: Video },
    { label: "Team", href: "/admin/team", icon: Users },
    { label: "Content", href: "/admin/content", icon: FileText },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    { label: "Careers", href: "/admin/careers", icon: Briefcase },
    {
      label: "Applications",
      href: "/admin/applications",
      icon: UserCheck,
      badge: newApplications > 0 ? newApplications : undefined
    },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    {
      label: "User Management",
      href: "/admin/settings/users",
      icon: Shield,
      ownerOrAdminOnly: true
    },
    { label: "Settings", href: "/admin/settings", icon: Settings, adminOnly: true }
  ];

  const isOwnerOrAdmin = user?.role === "owner" || user?.role === "admin";
  const isOwner = user?.role === "owner";

  const navItems = allNavItems.filter(item => {
    if ((item as any).ownerOrAdminOnly && !isOwnerOrAdmin) return false;
    if ((item as any).adminOnly && user?.role === "editor") return false;
    return true;
  });

  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard";
    return segments.slice(1).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ");
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#FFFFFF] flex flex-col font-grotesk antialiased">
      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[#8DBEFF]" />
              <input
                type="text"
                autoFocus
                placeholder="Quick search projects, team, messages, applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#8DBEFF] focus:ring-1 focus:ring-[#8DBEFF]"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="absolute right-3 text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 font-grotesk text-xs">
              <div className="text-[10px] uppercase font-bold text-[#8DBEFF] tracking-widest px-2">Quick Links</div>
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setSearchModalOpen(false);
                    router.push(item.href);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left text-white/80 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-[#8DBEFF]" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0B0E13] justify-between z-30">
          <div>
            {/* Studio Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <img src="/favicon.png" alt="TheOldverse" className="h-7 w-7 object-contain" />
                <div>
                  <span className="font-grotesk font-extrabold text-sm tracking-widest text-white uppercase block">
                    THEOLDVERSE
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#8DBEFF] font-bold block font-mono">
                    STUDIO CONTROL
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation List */}
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                      isActive
                        ? "bg-[#8DBEFF] text-[#050608] font-bold shadow-[0_0_20px_rgba(141,190,255,0.18)]"
                        : "text-[#B8C2CC] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-[#050608]" : "text-[#8DBEFF]"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono ${
                          isActive ? "bg-[#050608] text-[#8DBEFF]" : "bg-[#8DBEFF] text-[#050608]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 border-t border-white/5 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#B8C2CC] hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4 text-white/40" />
                Live Website
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#8DBEFF] font-bold">Visit</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="h-4 w-4" />
              Sign Out Session
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-[9990] lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-full bg-[#0B0E13] border-r border-white/5 p-6 space-y-6 z-10 justify-between h-full">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/favicon.png" alt="TheOldverse" className="h-7 w-7 object-contain" />
                    <div>
                      <span className="font-extrabold text-sm tracking-widest text-white uppercase block">
                        THEOLDVERSE
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-[#8DBEFF] font-bold block">
                        CONTROL
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="space-y-1.5 pt-4">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#8DBEFF] text-[#050608] font-bold"
                            : "text-[#B8C2CC] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8DBEFF] text-[#050608]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TOPBAR */}
          <header className="sticky top-0 z-20 bg-[#050608]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-[#8DBEFF] font-bold tracking-widest">
                  <span>ADMIN</span>
                  <ChevronRight className="h-3 w-3 text-white/30" />
                  <span>{getBreadcrumb()}</span>
                </div>
                <h1 className="font-bebas text-xl sm:text-2xl tracking-wider text-white uppercase leading-tight">
                  Studio Control Center
                </h1>
              </div>
            </div>

            {/* Right Action Icons & Profile */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-[#8DBEFF]/40 transition-all cursor-pointer flex items-center gap-2"
                title="Search (Ctrl + K)"
              >
                <Search className="h-4 w-4 text-[#8DBEFF]" />
                <span className="hidden sm:inline text-xs font-grotesk text-white/40">Search...</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-white/70 hover:text-white hover:border-[#8DBEFF]/40 transition-all relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4 text-[#8DBEFF]" />
                  {(unreadMessages > 0 || newApplications > 0 || notifications.some((n) => !n.is_read)) && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#8DBEFF] animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown Popover */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-slide-up font-grotesk">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-[#8DBEFF]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">Notifications Stream</span>
                      </div>
                      <span className="text-[10px] text-[#8DBEFF] uppercase font-bold tracking-widest">
                        {notifications.length} events
                      </span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {unreadMessages > 0 && (
                        <Link
                          href="/admin/messages"
                          onClick={() => setNotificationsOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/20 hover:bg-[#8DBEFF]/20 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-[#8DBEFF] shrink-0 mt-0.5" />
                          <div className="text-xs space-y-0.5">
                            <p className="font-bold text-white">New Contact Messages</p>
                            <p className="text-[10px] text-[#B8C2CC] font-light">
                              You have {unreadMessages} unread website inquiry messages.
                            </p>
                          </div>
                        </Link>
                      )}

                      {newApplications > 0 && (
                        <Link
                          href="/admin/applications"
                          onClick={() => setNotificationsOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl bg-[#8DBEFF]/10 border border-[#8DBEFF]/20 hover:bg-[#8DBEFF]/20 transition-colors"
                        >
                          <UserCheck className="h-4 w-4 text-[#8DBEFF] shrink-0 mt-0.5" />
                          <div className="text-xs space-y-0.5">
                            <p className="font-bold text-white">New Recruitment Submissions</p>
                            <p className="text-[10px] text-[#B8C2CC] font-light">
                              {newApplications} candidates submitted portfolio applications.
                            </p>
                          </div>
                        </Link>
                      )}

                      {notifications.length === 0 && unreadMessages === 0 && newApplications === 0 && (
                        <div className="text-center py-6 text-xs text-white/40 font-light">
                          No new notifications at this time.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-3 p-1.5 pl-2.5 rounded-xl border border-white/10 hover:border-[#8DBEFF]/40 bg-white/[0.02] transition-all cursor-pointer"
                >
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-white block leading-none">
                      {user?.name || "Admin User"}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-[#8DBEFF] tracking-wider font-mono">
                      {user?.role || "admin"}
                    </span>
                  </div>
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop"}
                    alt="Admin Avatar"
                    className="h-8 w-8 rounded-lg object-cover border border-[#8DBEFF]/30"
                  />
                </button>

                {/* Account Menu Popover */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-2xl shadow-2xl p-3 space-y-2 z-50 animate-slide-up font-grotesk text-xs">
                    <div className="p-2 border-b border-white/5 space-y-1">
                      <p className="font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-[#B8C2CC] truncate font-mono">{user?.email}</p>
                      <span className="inline-block px-2 py-0.5 rounded bg-[#8DBEFF]/10 text-[#8DBEFF] text-[9px] font-extrabold uppercase tracking-widest font-mono border border-[#8DBEFF]/20">
                        {user?.role || "admin"} Role
                      </span>
                    </div>

                    {isOwnerOrAdmin && (
                      <Link
                        href="/admin/settings/users"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-[#8DBEFF]/10 hover:bg-[#8DBEFF]/20 border border-[#8DBEFF]/30 transition-colors text-[#8DBEFF] font-bold"
                      >
                        <Shield className="h-4 w-4 text-[#8DBEFF]" />
                        <span>Owner / Admin User Roles</span>
                      </Link>
                    )}

                    <Link
                      href="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors text-white/80 hover:text-white"
                    >
                      <Settings className="h-4 w-4 text-[#8DBEFF]" />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ToastProvider>
  );
}
