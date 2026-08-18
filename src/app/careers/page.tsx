"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Clock, Send, CheckCircle2, RefreshCw, X, FileText, User, Mail, Phone, Globe } from "lucide-react";

export default function PublicCareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    portfolio_url: "",
    instagram_url: "",
    cover_letter: ""
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/careers");
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApplyClick = (job: any) => {
    setSelectedJob(job);
    setSubmitted(false);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicant_name || !formData.applicant_email || !formData.cover_letter) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: selectedJob?.id || null,
          position: selectedJob?.title || "General Casting / Production Application",
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({
          applicant_name: "",
          applicant_email: "",
          applicant_phone: "",
          portfolio_url: "",
          instagram_url: "",
          cover_letter: ""
        });
      } else {
        setErrorMsg(data.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-20 font-grotesk text-white">
      {/* Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0B0E13] border border-[rgba(141,190,255,0.2)] rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-[#8DBEFF] uppercase font-bold tracking-widest block">
                    CAREER / CASTING APPLICATION
                  </span>
                  <h3 className="font-bebas text-2xl sm:text-3xl tracking-wider text-white uppercase mt-0.5">
                    Apply for {selectedJob?.title}
                  </h3>
                  <p className="text-xs text-[#B8C2CC] font-light">
                    Submit your portfolio details for evaluation by TheOldverse production team.
                  </p>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.applicant_name}
                      onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-white uppercase tracking-wider block">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={formData.applicant_email}
                        onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-white uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.applicant_phone}
                        onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-white uppercase tracking-wider block">Portfolio / Reel URL</label>
                      <input
                        type="url"
                        placeholder="https://vimeo.com/..."
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-white uppercase tracking-wider block">Instagram Handle</label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-white uppercase tracking-wider block">Cover Letter / Experience Notes *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your background, equipment expertise, or acting experience..."
                      value={formData.cover_letter}
                      onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8DBEFF] resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-[14px] bg-[#8DBEFF] hover:bg-[#CFE8FF] text-[#050608] font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_25px_rgba(141,190,255,0.18)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span>Submit Candidate Application</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center space-y-6 py-6 animate-fade-in text-xs">
                <div className="h-16 w-16 bg-[#8DBEFF]/15 border border-[#8DBEFF]/30 rounded-full flex items-center justify-center text-[#8DBEFF] mx-auto shadow-xl">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bebas text-2xl tracking-wider text-white uppercase">
                    APPLICATION SUBMITTED
                  </h3>
                  <p className="text-xs text-[#B8C2CC] font-light max-w-sm mx-auto leading-relaxed">
                    Thank you. Your submission has been delivered directly to TheOldverse Production Team.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-[#8DBEFF] bg-white/5 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        {/* Header Block */}
        <div className="text-center py-4 max-w-4xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#8DBEFF] block">
            JOIN THEOLDVERSE PRODUCTIONS
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wider text-white uppercase leading-none">
            CAREERS, CASTING & CREW ROLES
          </h1>
          <p className="text-xs sm:text-sm text-[#B8C2CC] font-light">
            We are always seeking passionate actors, cinematographers, scriptwriters, and post-production artists.
          </p>
          <div className="w-16 h-1 bg-[#8DBEFF] mx-auto mt-4 rounded-full" />
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wider uppercase border-b border-white/5 pb-2">
            Open Positions & Collaboration Opportunities
          </h2>

          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-[#8DBEFF] animate-spin mx-auto" />
              <p className="text-xs text-[#B8C2CC]">Loading openings from studio database...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 bg-[#0B0E13] border border-white/5 rounded-2xl text-center space-y-3">
              <Briefcase className="h-10 w-10 text-white/20 mx-auto" />
              <p className="text-sm font-bold text-white">No Specific Openings Right Now</p>
              <p className="text-xs text-[#B8C2CC]">
                You can still submit a general portfolio application to be considered for upcoming projects.
              </p>
              <button
                onClick={() => handleApplyClick({ title: "General Talent & Crew Application" })}
                className="mt-3 px-5 py-2.5 rounded-xl bg-[#8DBEFF] text-[#050608] font-bold text-xs uppercase tracking-wider"
              >
                Submit General Application
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#0B0E13] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-[#8DBEFF]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#8DBEFF] uppercase tracking-wider block">
                          {job.department}
                        </span>
                        <h3 className="font-bold text-lg text-white mt-0.5">{job.title}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/10 text-white">
                        {job.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#B8C2CC]">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#8DBEFF]" />
                        {job.location}
                      </span>
                    </div>

                    <p className="text-xs text-[#B8C2CC] font-light leading-relaxed">
                      {job.description}
                    </p>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="space-y-1 pt-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
                          Key Requirements:
                        </span>
                        <ul className="list-disc list-inside text-xs text-[#B8C2CC] space-y-0.5 font-light">
                          {job.requirements.map((req: string, idx: number) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="w-full py-3 rounded-xl bg-[#8DBEFF]/10 hover:bg-[#8DBEFF] text-[#8DBEFF] hover:text-[#050608] border border-[#8DBEFF]/30 font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Apply for Position</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
