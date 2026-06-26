"use client";

import React, { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2, PhoneCall } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Filmmaker",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }
    // Simulate API request success
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      role: "Filmmaker",
      message: ""
    });
    setIsSubmitted(false);
  };

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none">
            Get In Touch
          </h1>
          <p className="text-oldverse-accent font-grotesk text-xs sm:text-sm uppercase tracking-widest font-semibold">
            Let's Collaborate On Future Stages
          </p>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start pt-4">
          
          {/* Contact Details Panel */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-6">
              <h3 className="font-grotesk text-lg font-bold text-oldverse-text uppercase tracking-wide border-b border-white/5 pb-2">
                Connect Directly
              </h3>
              
              <div className="space-y-4 text-xs font-grotesk">
                
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-oldverse-accent flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-oldverse-text uppercase text-[10px] text-white/50">General Support</h4>
                    <p className="text-oldverse-secondary mt-0.5">theoldverse@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-oldverse-accent flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-oldverse-text uppercase text-[10px] text-white/50">Casting & Crew Operations</h4>
                    <p className="text-oldverse-secondary mt-0.5">casting@theoldverse.com</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <PhoneCall className="h-5 w-5 text-oldverse-accent flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-oldverse-text uppercase text-[10px] text-white/50">Direct Hotline</h4>
                    <p className="text-oldverse-secondary mt-0.5">+91 99999-88888</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-oldverse-accent flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-oldverse-text uppercase text-[10px] text-white/50">Creator Hub Hub office</h4>
                    <p className="text-oldverse-secondary mt-0.5 leading-relaxed">
                      Sector 62, Film City Complex,<br />
                      Noida, Uttar Pradesh 201301, India
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="glassmorphism p-6 rounded-2xl border border-white/5">
              <h4 className="font-grotesk text-sm font-bold text-oldverse-text uppercase tracking-wide mb-2">
                Screenplay Submissions
              </h4>
              <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                Writers interested in sharing screenplay pitch decks or co-production requests can submit them directly using the form below.
              </p>
            </div>

          </div>

          {/* Interactive Form Panel */}
          <div className="md:col-span-3">
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-white/5 min-h-[400px] flex flex-col justify-center">
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-grotesk">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Amarjeet Singh"
                        className="w-full px-4 py-2.5 rounded-lg bg-oldverse-card border border-white/10 text-xs font-light text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors placeholder-white/20 font-grotesk"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-grotesk">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. amar@gmail.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-oldverse-card border border-white/10 text-xs font-light text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors placeholder-white/20 font-grotesk"
                      />
                    </div>

                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-grotesk">
                      Role / Discipline
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-oldverse-card border border-white/10 text-xs text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors font-grotesk cursor-pointer"
                    >
                      <option value="Filmmaker">Independent Filmmaker</option>
                      <option value="Actor">Screen Actor / Performer</option>
                      <option value="Writer">Creative Writer / Screenwriter</option>
                      <option value="Viewer">Cinema Enthusiast / Viewer</option>
                      <option value="Other">Collaborative Partner</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-oldverse-secondary font-grotesk">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your inquiry, project proposal, or feedback..."
                      className="w-full px-4 py-2.5 rounded-lg bg-oldverse-card border border-white/10 text-xs font-light text-oldverse-text focus:outline-none focus:border-oldverse-accent transition-colors placeholder-white/20 font-grotesk resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-oldverse-accent hover:bg-oldverse-accent-secondary text-oldverse-bg font-grotesk font-bold text-xs tracking-wider uppercase shadow-lg shadow-oldverse-accent/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>

                </form>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="h-16 w-16 bg-oldverse-success/15 rounded-full flex items-center justify-center text-oldverse-success mx-auto shadow-inner">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-grotesk text-lg font-bold text-oldverse-text uppercase tracking-wide">
                      Message Dispatched
                    </h3>
                    <p className="text-xs text-oldverse-secondary font-light max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="font-semibold text-oldverse-text">{formData.name}</span>. Our team will inspect your message regarding <span className="font-semibold text-oldverse-text">{formData.role}</span> disciplines and follow up within 24 hours.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-block px-6 py-2 rounded-full border border-white/10 hover:border-oldverse-accent bg-white/3 hover:bg-oldverse-accent/15 text-oldverse-secondary hover:text-oldverse-accent font-grotesk font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
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
