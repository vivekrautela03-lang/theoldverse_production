"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        setDeliveryMode(result.mode || "standard");
        
        // Trigger confetti celebrating connection request
        confetti({
          particleCount: 100,
          spread: 70,
          colors: ["#F5A623", "#FFFFFF"]
        });
      } else {
        setSubmitError(result.error || "Failed to send message. Please try again.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "A network error occurred. Please check your connection.");
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
    setDeliveryMode(null);
  };

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        
        {/* Header Block with ASCII border representation */}
        <div className="text-center font-mono py-4 max-w-4xl mx-auto space-y-3 select-none">
          <div className="text-white/10 text-xs tracking-widest overflow-hidden whitespace-nowrap leading-none select-none">
            ----------------------------------------------------------------------------------------------------
          </div>
          <h1 className="font-grotesk text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-oldverse-text uppercase cinematic-glow">
            GET IN TOUCH
          </h1>
          <p className="font-grotesk text-xs sm:text-sm text-oldverse-secondary tracking-widest uppercase">
            Let's create stories together.
          </p>
          <div className="text-white/10 text-xs tracking-widest overflow-hidden whitespace-nowrap leading-none select-none">
            ----------------------------------------------------------------------------------------------------
          </div>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch pt-4 max-w-4xl mx-auto">
          
          {/* Left Column: CONTACT details (ASCII box styling) */}
          <div className="md:col-span-2 flex">
            <div className="relative w-full border border-white/15 bg-[#111]/30 p-6 flex flex-col space-y-6 rounded-none shadow-lg">
              {/* Retro Corners */}
              <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-oldverse-accent"></div>
              <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-oldverse-accent"></div>
              <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-oldverse-accent"></div>
              <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-oldverse-accent"></div>

              {/* Title Bar simulating ASCII layout */}
              <h3 className="font-mono text-xs font-bold text-oldverse-accent uppercase tracking-widest border-b border-white/10 pb-3 flex items-center gap-2 select-none">
                <span>┌</span>
                <span>CONTACT</span>
                <span className="flex-1 border-b border-dashed border-white/10 ml-2"></span>
                <span>┐</span>
              </h3>
              
              <ul className="space-y-6 text-xs font-mono flex-1 flex flex-col justify-around py-4">
                <li className="flex items-center gap-4 group">
                  <div className="h-9 w-9 flex items-center justify-center border border-white/10 bg-white/5 group-hover:border-oldverse-accent transition-colors">
                    <span className="text-base select-none">📧</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Email</span>
                    <a href="mailto:theoldverse@gmail.com" className="text-oldverse-text hover:text-oldverse-accent transition-colors break-all">theoldverse@gmail.com</a>
                  </div>
                </li>

                <li className="flex items-center gap-4 group">
                  <div className="h-9 w-9 flex items-center justify-center border border-white/10 bg-white/5 group-hover:border-oldverse-accent transition-colors">
                    <span className="text-base select-none">📞</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Phone</span>
                    <a href="tel:+919999988888" className="text-oldverse-text hover:text-oldverse-accent transition-colors">+91 99999-88888</a>
                  </div>
                </li>

                <li className="flex items-center gap-4 group">
                  <div className="h-9 w-9 flex items-center justify-center border border-white/10 bg-white/5 group-hover:border-oldverse-accent transition-colors">
                    <span className="text-base select-none">📷</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] font-bold tracking-wider mb-0.5">Instagram</span>
                    <a href="https://instagram.com/theoldverse_" target="_blank" rel="noreferrer" className="text-oldverse-text hover:text-oldverse-accent transition-colors">@theoldverse_</a>
                  </div>
                </li>

                <li className="flex items-center gap-4 group">
                  <div className="h-9 w-9 flex items-center justify-center border border-white/10 bg-white/5 group-hover:border-oldverse-accent transition-colors">
                    <span className="text-base select-none">▶</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] font-bold tracking-wider mb-0.5">YouTube</span>
                    <a href="https://youtube.com/@theoldverse_07" target="_blank" rel="noreferrer" className="text-oldverse-text hover:text-oldverse-accent transition-colors">@theoldverse_07</a>
                  </div>
                </li>
              </ul>
              
              <div className="font-mono text-[9px] text-white/20 select-none text-center">
                └──────────────────────────────┘
              </div>
            </div>
          </div>

          {/* Right Column: Form Panel (ASCII box styling) */}
          <div className="md:col-span-3 flex">
            <div className="relative w-full border border-white/15 bg-[#111]/30 p-6 sm:p-8 flex flex-col justify-center rounded-none shadow-lg">
              {/* Retro Corners */}
              <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-oldverse-accent"></div>
              <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-oldverse-accent"></div>
              <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-oldverse-accent"></div>
              <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-oldverse-accent"></div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between h-full">
                  
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-mono flex justify-between">
                        <span>Name</span>
                        <span className="text-oldverse-accent/60">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Name"
                        className="w-full px-4 py-3 rounded-none bg-oldverse-bg/50 border border-white/10 text-xs font-light text-oldverse-text focus:outline-none focus:border-oldverse-accent focus:bg-oldverse-bg transition-colors placeholder-white/20 font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-mono flex justify-between">
                        <span>Email</span>
                        <span className="text-oldverse-accent/60">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-none bg-oldverse-bg/50 border border-white/10 text-xs font-light text-oldverse-text focus:outline-none focus:border-oldverse-accent focus:bg-oldverse-bg transition-colors placeholder-white/20 font-mono"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-mono">
                      Subject Dropdown
                    </label>
                    <select
                      disabled={isSubmitting}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-none bg-oldverse-bg/50 border border-white/10 text-xs text-oldverse-text focus:outline-none focus:border-oldverse-accent focus:bg-oldverse-bg transition-colors font-mono cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23A5A5A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 16px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Collaboration Proposal">Collaboration / Film Project</option>
                      <option value="Casting Application">Casting / Acting Application</option>
                      <option value="Crew / Technical Application">Crew Finder / Technical Role</option>
                      <option value="Press / Media Inquiry">Press & Media Inquiry</option>
                    </select>
                  </div>

                  {/* Message Box */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-mono flex justify-between">
                      <span>Message</span>
                      <span className="text-oldverse-accent/60">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Message"
                      className="w-full px-4 py-3 rounded-none bg-oldverse-bg/50 border border-white/10 text-xs font-light text-oldverse-text focus:outline-none focus:border-oldverse-accent focus:bg-oldverse-bg transition-colors placeholder-white/20 font-mono resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="text-[11px] font-mono text-oldverse-error bg-oldverse-error/10 border border-oldverse-error/20 p-3 text-center">
                      ERROR: {submitError}
                    </div>
                  )}

                  {/* Bracketed Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 border border-oldverse-accent/30 hover:border-oldverse-accent bg-transparent hover:bg-oldverse-accent/5 text-oldverse-accent font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "[ SENDING MESSAGE... ]" : "[ SEND MESSAGE ]"}
                  </button>

                </form>
              ) : (
                <div className="text-center space-y-6 py-6 animate-fade-in font-mono">
                  <div className="h-16 w-16 bg-oldverse-success/15 border border-oldverse-success/30 rounded-none flex items-center justify-center text-oldverse-success mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-oldverse-text uppercase tracking-widest">
                      [ MESSAGE DISPATCHED ]
                    </h3>
                    <p className="text-xs text-oldverse-secondary font-light max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="text-oldverse-text font-semibold">{formData.name}</span>. Your inquiry regarding <span className="text-oldverse-text font-semibold">{formData.subject}</span> has been processed.
                    </p>
                    {deliveryMode === "simulated" && (
                      <div className="text-[10px] text-oldverse-accent/60 bg-oldverse-accent/5 border border-oldverse-accent/10 py-2 px-3 inline-block max-w-xs mx-auto">
                        Dev mode: Check server log terminal.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-block px-6 py-3 border border-white/10 hover:border-oldverse-accent bg-white/5 hover:bg-oldverse-accent/10 text-oldverse-secondary hover:text-oldverse-accent font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer rounded-none"
                  >
                    [ Send Another Message ]
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
