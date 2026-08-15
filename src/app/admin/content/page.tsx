"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/components/admin/ToastContainer";
import {
  FileText,
  Save,
  Globe,
  Home,
  Info,
  Briefcase,
  Mail,
  Share2,
  RefreshCw,
  Plus,
  Trash2
} from "lucide-react";

export default function AdminContentCMSPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"homepage" | "about" | "services" | "contact" | "socials">("homepage");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [content, setContent] = useState<any>({
    homepage: {
      heroTitle: "CINEMATIC INDEPENDENT FILMS & ORIGINAL PRODUCTIONS",
      heroSubtitle: "Crafting atmospheric cinema, original web series, music videos, and digital narratives from Dehradun to global screens.",
      heroMediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      ctaText: "EXPLORE ARCHIVES",
      ctaLink: "/projects"
    },
    about: {
      heading: "ABOUT THEOLDVERSE PRODUCTIONS",
      description: "TheOldverse Productions is an independent film studio dedicated to visual authenticity, character-driven narratives, and cutting-edge digital production.",
      vision: "To pioneer a new era of independent Indian cinema with uncompromising aesthetic quality and global resonance.",
      mission: "Nurturing creative talent, technical mastery, and courageous storytelling that moves audience imagination.",
      studioImages: [
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&fit=crop"
      ]
    },
    services: [
      { id: "1", title: "Film & Series Production", description: "End-to-end production from script development, casting, shooting, to color grading." },
      { id: "2", title: "Commercials & Brand Films", description: "Cinematic commercial films and visual campaigns tailored for high-end brands." },
      { id: "3", title: "Music Videos & Audio Visuals", description: "Atmospheric, stylised visual treatments for independent musicians and artists." }
    ],
    contact: {
      email: "theoldverse@gmail.com",
      phone: "+91 90688 50966",
      location: "Dehradun, Uttarakhand, India",
      workingHours: "Mon - Sat: 10:00 AM - 7:00 PM IST"
    },
    socials: {
      instagram: "https://instagram.com/theoldverse_",
      youtube: "https://youtube.com/@The_oldverse",
      linkedin: "https://linkedin.com/company/theoldverse",
      twitter: "https://twitter.com/theoldverse"
    }
  });

  const fetchCMSContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.success && data.content && Object.keys(data.content).length > 0) {
        setContent((prev: any) => ({
          ...prev,
          ...data.content
        }));
      }
    } catch {
      showToast("Using default CMS content payload", "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSContent();
  }, []);

  const saveSection = async (sectionKey: string, payload: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionKey, content: payload }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`CMS Section "${sectionKey.toUpperCase()}" updated live!`, "success");
      } else {
        showToast(data.error || "Failed to update CMS section", "error");
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    const newSvc = {
      id: Date.now().toString(),
      title: "New Creative Service",
      description: "Service details and capabilities summary..."
    };
    const updatedServices = [...(content.services || []), newSvc];
    setContent({ ...content, services: updatedServices });
  };

  const removeService = (id: string) => {
    const updatedServices = (content.services || []).filter((s: any) => s.id !== id);
    setContent({ ...content, services: updatedServices });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-grotesk">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white uppercase leading-none">
              Website CMS Content Manager
            </h2>
            <p className="text-xs text-[#B8C2CC] font-light mt-1">
              Edit public website copy, hero banners, about statements, services, contact info, and social media channels without code modifications.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5 pb-3">
          {[
            { id: "homepage", label: "Homepage Hero", icon: Home },
            { id: "about", label: "About Us", icon: Info },
            { id: "services", label: "Services", icon: Briefcase },
            { id: "contact", label: "Contact Details", icon: Mail },
            { id: "socials", label: "Social Media", icon: Share2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#8DBEFF] text-[#050608] font-bold shadow-[0_0_20px_rgba(141,190,255,0.18)]"
                    : "bg-[#0B0E13] border border-white/5 text-[#B8C2CC] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CMS SECTION EDITORS */}
        <div className="bg-[#0B0E13] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl">
          {/* TAB 1: HOMEPAGE */}
          {activeTab === "homepage" && (
            <div className="space-y-6 animate-fade-in text-xs font-grotesk">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">Homepage Hero Configuration</h3>
                <button
                  type="button"
                  onClick={() => saveSection("homepage", content.homepage)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Update Hero Live</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Hero Headline</label>
                  <input
                    type="text"
                    value={content.homepage?.heroTitle || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homepage: { ...content.homepage, heroTitle: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Hero Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={content.homepage?.heroSubtitle || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homepage: { ...content.homepage, heroSubtitle: e.target.value }
                      })
                    }
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">CTA Button Text</label>
                    <input
                      type="text"
                      value={content.homepage?.ctaText || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          homepage: { ...content.homepage, ctaText: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">CTA Target Link</label>
                    <input
                      type="text"
                      value={content.homepage?.ctaLink || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          homepage: { ...content.homepage, ctaLink: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Hero Video / Image Media URL</label>
                  <input
                    type="url"
                    value={content.homepage?.heroMediaUrl || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        homepage: { ...content.homepage, heroMediaUrl: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in text-xs font-grotesk">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">About Studio Content</h3>
                <button
                  type="button"
                  onClick={() => saveSection("about", content.about)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Update About Page</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Heading</label>
                  <input
                    type="text"
                    value={content.about?.heading || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, heading: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Studio Bio / Description</label>
                  <textarea
                    rows={4}
                    value={content.about?.description || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, description: e.target.value }
                      })
                    }
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Studio Vision</label>
                  <textarea
                    rows={3}
                    value={content.about?.vision || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, vision: e.target.value }
                      })
                    }
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Studio Mission</label>
                  <textarea
                    rows={3}
                    value={content.about?.mission || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, mission: e.target.value }
                      })
                    }
                    className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-fade-in text-xs font-grotesk">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">Studio Services Catalog</h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={addService}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[#8DBEFF] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Service
                  </button>
                  <button
                    type="button"
                    onClick={() => saveSection("services", content.services)}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>Save Services</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {(content.services || []).map((svc: any, idx: number) => (
                  <div key={svc.id || idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={svc.title}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[idx].title = e.target.value;
                          setContent({ ...content, services: updated });
                        }}
                        className="w-3/4 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#8DBEFF]"
                      />
                      <button
                        type="button"
                        onClick={() => removeService(svc.id)}
                        className="p-2 text-white/40 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={svc.description}
                      onChange={(e) => {
                        const updated = [...content.services];
                        updated[idx].description = e.target.value;
                        setContent({ ...content, services: updated });
                      }}
                      className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === "contact" && (
            <div className="space-y-6 animate-fade-in text-xs font-grotesk">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">Contact Information</h3>
                <button
                  type="button"
                  onClick={() => saveSection("contact", content.contact)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Contact Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Official Email</label>
                  <input
                    type="email"
                    value={content.contact?.email || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    value={content.contact?.phone || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phone: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white uppercase tracking-wider block">Studio Location</label>
                <input
                  type="text"
                  value={content.contact?.location || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, location: e.target.value }
                    })
                  }
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SOCIALS */}
          {activeTab === "socials" && (
            <div className="space-y-6 animate-fade-in text-xs font-grotesk">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">Social Media Channels</h3>
                <button
                  type="button"
                  onClick={() => saveSection("socials", content.socials)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Social Links</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">Instagram URL</label>
                  <input
                    type="url"
                    value={content.socials?.instagram || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        socials: { ...content.socials, instagram: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">YouTube URL</label>
                  <input
                    type="url"
                    value={content.socials?.youtube || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        socials: { ...content.socials, youtube: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-white uppercase tracking-wider block">LinkedIn URL</label>
                  <input
                    type="url"
                    value={content.socials?.linkedin || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        socials: { ...content.socials, linkedin: e.target.value }
                      })
                    }
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
