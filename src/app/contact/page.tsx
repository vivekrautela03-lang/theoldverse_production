"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, Send, Lock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState({
    email: "theoldverse@gmail.com",
    phone: "+91 90688 50966",
    location: "Dehradun, Uttarakhand, India",
    instagram: "@theoldverse_",
    instagramUrl: "https://instagram.com/theoldverse_",
    youtube: "@The_oldverse",
    youtubeUrl: "https://youtube.com/@The_oldverse"
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content?section=contact")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content) {
          setContactInfo((prev) => ({
            ...prev,
            ...data.content
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setSuccessMsg(result.message || "Thanks for reaching out. We'll get back to you soon.");
        
        // Reset form fields after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "General Inquiry",
          message: ""
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 90,
          spread: 70,
          colors: ["#8DBEFF", "#FFFFFF"]
        });
      } else {
        setSubmitError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "General Inquiry",
      message: ""
    });
    setIsSubmitted(false);
    setSubmitError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="bg-[#050608] min-h-screen pt-28 pb-16 font-grotesk text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        
        {/* Header Block */}
        <div className="text-center py-4 max-w-4xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#8DBEFF] block">
            THEOLDVERSE PRODUCTIONS
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wider text-white uppercase leading-none">
            GET IN TOUCH WITH OUR STUDIO
          </h1>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-[#B8C2CC] font-light">
              Have a film project, casting application, or brand collaboration in mind?
            </p>
            <p className="text-xs sm:text-sm text-[#8DBEFF] font-medium">
              Let's create something extraordinary together.
            </p>
          </div>
          <div className="w-16 h-1 bg-[#8DBEFF] mx-auto mt-4 rounded-full" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 max-w-5xl mx-auto items-stretch">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 flex">
            <div className="w-full bg-[#0B0E13] border border-white/5 p-8 sm:p-10 rounded-2xl flex flex-col justify-between space-y-8 shadow-xl">
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bebas text-lg tracking-widest text-white uppercase">
                    STUDIO CONTACT DETAILS
                  </h3>
                  <div className="w-10 h-0.5 bg-[#8DBEFF] mt-2" />
                </div>
                
                <ul className="space-y-6 text-xs">
                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-xl text-[#8DBEFF]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">Email</span>
                      <a href={`mailto:${contactInfo.email}`} className="text-xs font-semibold text-white hover:text-[#8DBEFF] transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-xl text-[#8DBEFF]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">Phone</span>
                      <a href={`tel:${contactInfo.phone}`} className="text-xs font-semibold text-white hover:text-[#8DBEFF] transition-colors">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-xl text-[#8DBEFF]">
                      <InstagramIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">Instagram</span>
                      <a href={contactInfo.instagramUrl || "https://instagram.com/theoldverse_"} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white hover:text-[#8DBEFF] transition-colors">
                        {contactInfo.instagram}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-xl text-[#8DBEFF]">
                      <YoutubeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">YouTube</span>
                      <a href={contactInfo.youtubeUrl || "https://youtube.com/@The_oldverse"} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white hover:text-[#8DBEFF] transition-colors">
                        {contactInfo.youtube}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-1">
                <p className="text-xs font-light text-[#B8C2CC] italic">
                  “Great stories begin with a simple conversation.”
                </p>
                <p className="text-xs font-bold text-[#8DBEFF]">
                  {contactInfo.location}
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="lg:col-span-7 flex">
            <div className="w-full bg-[#0B0E13] border border-white/5 p-8 sm:p-10 rounded-2xl flex flex-col justify-center shadow-xl">

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between h-full text-xs">
                  
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                        Your Name <span className="text-[#8DBEFF]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vivek Rautela"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8DBEFF] transition-colors placeholder-white/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                        Email Address <span className="text-[#8DBEFF]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8DBEFF] transition-colors placeholder-white/20"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                      Inquiry Subject
                    </label>
                    <select
                      disabled={isSubmitting}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8DBEFF] transition-colors cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Collaboration Proposal">Film & Web Series Production</option>
                      <option value="Commercial Project">Commercial & Brand Film</option>
                      <option value="Casting Application">Casting & Acting Application</option>
                      <option value="Crew Finder">Technical & Crew Opportunity</option>
                      <option value="Press / Media">Press & Media Inquiry</option>
                    </select>
                  </div>

                  {/* Message Box */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                      Your Message <span className="text-[#8DBEFF]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project or inquiry details..."
                      className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#8DBEFF] transition-colors placeholder-white/20 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Error Alert State */}
                  {submitError && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in text-xs text-red-400 font-semibold">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#8DBEFF] hover:bg-[#CFE8FF] active:scale-[0.99] text-[#050608] font-extrabold text-xs rounded-xl uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(141,190,255,0.18)] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>SENDING MESSAGE...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 pt-1 select-none">
                    <Lock className="h-3 w-3 text-[#8DBEFF]" />
                    <span>Protected by End-to-End Encryption & Supabase RLS.</span>
                  </div>

                </form>
              ) : (
                /* Success State */
                <div className="text-center space-y-6 py-6 animate-fade-in text-xs">
                  <div className="h-16 w-16 bg-[#8DBEFF]/15 border border-[#8DBEFF]/30 rounded-full flex items-center justify-center text-[#8DBEFF] mx-auto shadow-xl">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-bebas text-3xl tracking-wider text-white uppercase">
                      MESSAGE DISPATCHED
                    </h3>
                    <p className="text-xs text-[#B8C2CC] font-light max-w-sm mx-auto leading-relaxed">
                      {successMsg || "Thanks for reaching out. We'll get back to you soon."}
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-block px-6 py-3 border border-[#8DBEFF]/30 hover:border-[#8DBEFF] bg-[#8DBEFF]/10 hover:bg-[#8DBEFF]/20 text-[#8DBEFF] font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer rounded-xl"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
