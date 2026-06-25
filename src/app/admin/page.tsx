"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Landmark, Users, Video, DollarSign, Check, X, ShieldAlert, Sparkles, AlertCircle, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";
import { getStoreData, mutateStore } from "@/lib/supabaseStore";
import { MediaItem, Creator } from "@/lib/mockData";

export default function AdminDashboard() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isClient, setIsClient] = useState(false);

  const loadAdminData = () => {
    setMediaItems(getStoreData.media());
    setCreators(getStoreData.creators());
  };

  useEffect(() => {
    setIsClient(true);
    loadAdminData();

    window.addEventListener("oldverse_store_update", loadAdminData);
    return () => window.removeEventListener("oldverse_store_update", loadAdminData);
  }, []);

  // Filter queues
  const pendingApprovals = mediaItems.filter(item => item.isApproved === false || (item as any).isApproved === undefined);
  const verificationRequests = creators.filter(c => (c as any).verificationRequested === true);

  const handleApproveShow = (id: string, title: string) => {
    mutateStore.approveMedia(id);
    
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ["#34D399", "#F5A623"]
    });

    alert(`"${title}" approved and published to the homepage catalog!`);
  };

  const handleDeclineShow = (id: string, title: string) => {
    if (confirm(`Decline and delete "${title}"?`)) {
      mutateStore.declineMedia(id);
    }
  };

  const handleApproveVerification = (id: string, name: string) => {
    mutateStore.approveVerification(id);
    
    confetti({
      particleCount: 50,
      colors: ["#F5A623", "#FFFFFF"]
    });

    alert(`"${name}" is now a verified creator!`);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-oldverse-bg flex items-center justify-center">
        <div className="h-12 w-12 border-t-2 border-b-2 border-oldverse-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-oldverse-bg min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-grotesk text-oldverse-secondary">
        
        {/* Header */}
        <div className="pb-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-3xl sm:text-5xl text-oldverse-text tracking-wider uppercase leading-none">
              Control Panel
            </h1>
            <p className="text-oldverse-secondary text-xs tracking-wide uppercase mt-1">
              Ecosystem operations, verification boards, and content vetting
            </p>
          </div>
          
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-xs text-red-400 font-semibold">
            <Landmark className="h-3.5 w-3.5" />
            <span>Root Admin Status</span>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-oldverse-secondary">
              <span className="text-[10px] uppercase font-bold tracking-wider">Subscribed Viewers</span>
              <Users className="h-4 w-4" />
            </div>
            <p className="font-bebas text-3xl text-oldverse-text">14,242</p>
            <span className="text-[10px] text-oldverse-accent font-semibold">Active accounts</span>
          </div>

          <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-oldverse-secondary">
              <span className="text-[10px] uppercase font-bold tracking-wider">Filmmakers</span>
              <Video className="h-4 w-4" />
            </div>
            <p className="font-bebas text-3xl text-oldverse-text">{creators.length}</p>
            <span className="text-[10px] text-oldverse-accent font-semibold">{creators.filter(c => c.isVerified).length} Verified</span>
          </div>

          <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-oldverse-secondary">
              <span className="text-[10px] uppercase font-bold tracking-wider">Pending Approvals</span>
              <ShieldAlert className="h-4 w-4" />
            </div>
            <p className="font-bebas text-3xl text-oldverse-accent">{pendingApprovals.length}</p>
            <span className="text-[10px] text-oldverse-secondary font-light">Requires manual review</span>
          </div>

          <div className="bg-oldverse-card border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-oldverse-secondary">
              <span className="text-[10px] uppercase font-bold tracking-wider">Gross platform revenue</span>
              <DollarSign className="h-4 w-4" />
            </div>
            <p className="font-bebas text-3xl text-oldverse-text">$124.5K</p>
            <span className="text-[10px] text-oldverse-accent font-semibold">70% creator allocation</span>
          </div>
        </div>

        {/* Dashboard Queues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main approvals queue (Pending media) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="font-grotesk text-sm font-bold uppercase tracking-wider text-oldverse-text flex items-center gap-2">
                  <Video className="h-4.5 w-4.5 text-oldverse-accent" />
                  Show Upload Approvals ({pendingApprovals.length})
                </h3>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {pendingApprovals.map((show) => (
                  <div
                    key={show.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-white/5 bg-white/2 hover:border-white/10 transition-colors"
                  >
                    <img
                      src={show.posterUrl}
                      alt={show.title}
                      className="h-20 w-16 object-cover rounded border border-white/5 self-start sm:self-center"
                    />
                    <div className="flex-grow space-y-2 min-w-0">
                      <div>
                        <h4 className="font-grotesk text-sm font-bold text-oldverse-text truncate">{show.title}</h4>
                        <p className="text-[10px] uppercase font-grotesk font-semibold text-oldverse-accent">
                          Format: {show.type} | Genre: {show.category}
                        </p>
                        <p className="text-[10px] text-oldverse-secondary">Uploaded by {show.creatorName}</p>
                      </div>
                      <p className="text-xs font-light text-oldverse-secondary line-clamp-2 leading-relaxed">
                        {show.description}
                      </p>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 flex-none pt-2 sm:pt-0">
                      <button
                        onClick={() => handleApproveShow(show.id, show.title)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeclineShow(show.id, show.title)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-oldverse-error hover:bg-oldverse-error/10 text-xs font-bold text-oldverse-secondary hover:text-oldverse-text transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}

                {pendingApprovals.length === 0 && (
                  <div className="text-center py-16 text-xs text-oldverse-secondary/40 font-light space-y-2">
                    <Check className="h-8 w-8 text-oldverse-success mx-auto" />
                    <p>All creator uploads approved. System catalog is clean.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Queues (Verification Requests) */}
          <div className="space-y-6">
            
            {/* Verification approvals */}
            <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <Landmark className="h-4.5 w-4.5 text-oldverse-accent" />
                <h3 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
                  Creator Verifications ({verificationRequests.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar text-xs">
                {verificationRequests.map((creator) => (
                  <div
                    key={creator.id}
                    className="p-3 rounded-lg border border-white/5 bg-white/2 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="h-8 w-8 rounded-full object-cover border border-white/5"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-oldverse-text truncate">{creator.name}</h4>
                        <span className="text-[10px] text-oldverse-secondary">@{creator.username}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleApproveVerification(creator.id, creator.name)}
                      className="px-2.5 py-1 rounded bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      Verify Badge
                    </button>
                  </div>
                ))}

                {verificationRequests.length === 0 && (
                  <p className="text-[10px] text-oldverse-secondary/40 text-center py-6 font-light">No verification tickets pending.</p>
                )}
              </div>
            </div>

            {/* System notifications publisher */}
            <div className="bg-oldverse-card border border-white/5 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <MessageSquare className="h-4.5 w-4.5 text-oldverse-accent" />
                <h3 className="font-grotesk text-xs uppercase tracking-widest font-bold text-oldverse-text">
                  Publish System Notice
                </h3>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert("System notice dispatched to global notifications drawer!"); }} className="space-y-3 text-xs">
                <textarea
                  required
                  rows={3}
                  placeholder="Announce site-wide updates, server maintenance schedules, or film festival registrations..."
                  className="w-full pl-3 pr-3 py-2 bg-oldverse-surface border border-white/10 rounded-lg text-oldverse-text placeholder-white/35 focus:outline-none"
                />
                
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                >
                  Publish Notice
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
