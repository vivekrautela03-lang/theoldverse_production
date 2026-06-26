"use client";

import React, { useState } from "react";
import { Mail, Phone, Send, Lock, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

// Custom SVG Icons to bypass legacy lucide-react limitations
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
    <div className="bg-[#080808] min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        
        {/* Header Block */}
        <div className="text-center py-4 max-w-4xl mx-auto space-y-3">
          <h1 className="font-grotesk text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
            GET IN TOUCH
          </h1>
          <div className="space-y-1">
            <p className="text-sm sm:text-base text-white/60 font-light">
              Have a project in mind or want to collaborate?
            </p>
            <p className="text-sm sm:text-base text-oldverse-accent font-medium">
              Let's create something unforgettable together.
            </p>
          </div>
          {/* Centered Orange Bar */}
          <div className="w-16 h-1 bg-oldverse-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 max-w-5xl mx-auto items-stretch">
          
          {/* Left Column: CONTACT DETAILS */}
          <div className="lg:col-span-5 flex">
            <div className="w-full bg-[#0f0f0f]/90 border border-white/5 p-8 sm:p-10 rounded-2xl flex flex-col justify-between space-y-8 shadow-xl">
              
              <div className="space-y-6">
                {/* Header with line */}
                <div>
                  <h3 className="font-grotesk text-sm font-bold text-white uppercase tracking-widest">
                    CONTACT DETAILS
                  </h3>
                  <div className="w-10 h-0.5 bg-oldverse-accent mt-2" />
                </div>
                
                {/* Contact List */}
                <ul className="space-y-6">
                  {/* Email */}
                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl text-oldverse-accent">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">Email</span>
                      <a href="mailto:theoldverse@gmail.com" className="text-sm font-medium text-white hover:text-oldverse-accent transition-colors">
                        theoldverse@gmail.com
                      </a>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl text-oldverse-accent">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">Phone</span>
                      <a href="tel:+919068850966" className="text-sm font-medium text-white hover:text-oldverse-accent transition-colors">
                        +91 9068850966
                      </a>
                    </div>
                  </li>

                  {/* Instagram */}
                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl text-oldverse-accent">
                      <InstagramIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">Instagram</span>
                      <a href="https://instagram.com/theoldverse_" target="_blank" rel="noreferrer" className="text-sm font-medium text-white hover:text-oldverse-accent transition-colors">
                        @theoldverse_
                      </a>
                    </div>
                  </li>

                  {/* YouTube */}
                  <li className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl text-oldverse-accent">
                      <YoutubeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5">YouTube</span>
                      <a href="https://youtube.com/@theoldverse_07" target="_blank" rel="noreferrer" className="text-sm font-medium text-white hover:text-oldverse-accent transition-colors">
                        @theoldverse_07
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Bottom Quote Box */}
              <div className="pt-6 border-t border-white/5 space-y-1">
                <div className="flex gap-1.5 items-start text-white/60">
                  <span className="text-2xl leading-none text-oldverse-accent font-serif select-none">“</span>
                  <p className="text-xs font-light leading-relaxed">
                    Great stories begin with a simple conversation.
                  </p>
                </div>
                <p className="text-xs font-semibold text-oldverse-accent pl-4">
                  Let's bring your vision to life.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="lg:col-span-7 flex">
            <div className="w-full bg-[#0f0f0f]/90 border border-white/5 p-8 sm:p-10 rounded-2xl flex flex-col justify-center shadow-xl">

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between h-full">
                  
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#161616] border border-white/5 text-xs text-white focus:outline-none focus:border-oldverse-accent/50 focus:bg-[#1b1b1b] transition-colors placeholder-white/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#161616] border border-white/5 text-xs text-white focus:outline-none focus:border-oldverse-accent/50 focus:bg-[#1b1b1b] transition-colors placeholder-white/20"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        disabled={isSubmitting}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#161616] border border-white/5 text-xs text-white focus:outline-none focus:border-oldverse-accent/50 focus:bg-[#1b1b1b] transition-colors cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 16px center', backgroundSize: '14px', backgroundRepeat: 'no-repeat' }}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Collaboration Proposal">Collaboration / Film Project</option>
                        <option value="Casting Application">Casting / Acting Application</option>
                        <option value="Crew / Technical Application">Crew Finder / Technical Role</option>
                        <option value="Press / Media Inquiry">Press & Media Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3.5 rounded-xl bg-[#161616] border border-white/5 text-xs text-white focus:outline-none focus:border-oldverse-accent/50 focus:bg-[#1b1b1b] transition-colors placeholder-white/20 resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="text-[11px] text-oldverse-error bg-oldverse-error/10 border border-oldverse-error/20 p-3 rounded-xl text-center">
                      ERROR: {submitError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-oldverse-accent hover:bg-oldverse-accent/95 active:scale-[0.99] text-black font-semibold text-xs rounded-xl uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_4px_20px_rgba(245,166,35,0.25)] disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "SENDING MESSAGE..." : "SEND MESSAGE"}
                  </button>

                  {/* Privacy Flag */}
                  <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 pt-2 select-none">
                    <Lock className="h-3 w-3" />
                    <span>We respect your privacy. Your information will never be shared.</span>
                  </div>

                </form>
              ) : (
                <div className="text-center space-y-6 py-6 animate-fade-in">
                  <div className="h-16 w-16 bg-oldverse-success/15 border border-oldverse-success/30 rounded-full flex items-center justify-center text-oldverse-success mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">
                      MESSAGE DISPATCHED
                    </h3>
                    <p className="text-xs text-white/60 font-light max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your inquiry regarding <span className="text-white font-semibold">{formData.subject}</span> has been processed.
                    </p>
                    {deliveryMode === "simulated" && (
                      <div className="text-[10px] text-oldverse-accent/60 bg-oldverse-accent/5 border border-oldverse-accent/10 py-2 px-3 inline-block rounded-xl max-w-xs mx-auto">
                        Dev mode: Check server log terminal.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-block px-6 py-3 border border-white/10 hover:border-oldverse-accent bg-white/5 hover:bg-oldverse-accent/10 text-white/70 hover:text-oldverse-accent font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer rounded-xl"
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
