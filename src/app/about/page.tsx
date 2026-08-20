"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Film, Quote, Sparkles, Heart, Camera, Scissors, ArrowRight, User } from "lucide-react";

const DefaultAvatar = () => (
  <div className="h-full w-full bg-white/5 flex items-center justify-center text-white/40">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  </div>
);

export default function AboutPage() {
  const [aboutCms, setAboutCms] = useState<any>({
    title: "About The OldVerse",
    subtitle: "Every Story Deserves A Stage",
    storyText: "The OldVerse is an independent film production studio driven by creativity, passion, and the belief that every story deserves to be told. We create films, commercials, digital content, and cinematic experiences that inspire, connect, and leave a lasting impression. Every project is approached with dedication, originality, and a commitment to storytelling that goes beyond the screen.",
    philosophy1: "Every frame tells a story.",
    philosophy2: "Cinema begins where imagination meets reality.",
    philosophy3: "Stories live forever when they're told with heart."
  });

  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch CMS About Content from Admin Panel backend
    fetch("/api/content?section=about")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content) {
          setAboutCms((prev: any) => ({
            ...prev,
            ...data.content
          }));
        }
      })
      .catch(() => {});

    // 2. Fetch Team Members from Admin Panel database
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.team) && data.team.length > 0) {
          setTeamMembers(data.team);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-oldverse-bg min-h-screen pt-28 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. Header Block */}
        <div className="text-center space-y-4">
          <h1 className="font-bebas text-5xl sm:text-7xl text-oldverse-text tracking-wider uppercase leading-none cinematic-glow">
            {aboutCms.title || "About The OldVerse"}
          </h1>
          <p className="text-oldverse-accent font-grotesk text-xs sm:text-sm uppercase tracking-widest font-semibold">
            {aboutCms.subtitle || "Every Story Deserves A Stage"}
          </p>
          <div className="h-1 w-20 bg-oldverse-accent mx-auto rounded-full mt-4" />
        </div>

        {/* 2. Our Story Section */}
        <div className="glassmorphism p-6 sm:p-10 rounded-2xl border border-white/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Film className="h-32 w-32 text-white" />
          </div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase border-b border-white/5 pb-2">
            Our Story
          </h2>
          <p className="text-oldverse-text text-sm sm:text-base font-light leading-relaxed max-w-4xl">
            {aboutCms.storyText}
          </p>
        </div>

        {/* 3. Our Philosophy Section */}
        <div className="space-y-6">
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase text-center">
            Our Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glassmorphism-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4 relative">
              <Quote className="h-6 w-6 text-oldverse-accent opacity-50 absolute top-4 left-4" />
              <p className="font-grotesk text-sm font-medium text-oldverse-text italic leading-relaxed pt-2">
                "{aboutCms.philosophy1 || "Every frame tells a story."}"
              </p>
            </div>
            
            <div className="glassmorphism-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4 relative">
              <Quote className="h-6 w-6 text-oldverse-accent opacity-50 absolute top-4 left-4" />
              <p className="font-grotesk text-sm font-medium text-oldverse-text italic leading-relaxed pt-2">
                "{aboutCms.philosophy2 || "Cinema begins where imagination meets reality."}"
              </p>
            </div>

            <div className="glassmorphism-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4 relative">
              <Quote className="h-6 w-6 text-oldverse-accent opacity-50 absolute top-4 left-4" />
              <p className="font-grotesk text-sm font-medium text-oldverse-text italic leading-relaxed pt-2">
                "{aboutCms.philosophy3 || "Stories live forever when they're told with heart."}"
              </p>
            </div>
          </div>
        </div>

        {/* 4. Meet the Founders Section */}
        <div className="space-y-8">
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase text-center">
            Meet the Founders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder 1: Shivanshi */}
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0 bg-oldverse-card">
                <DefaultAvatar />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-grotesk text-xl font-bold text-oldverse-text">
                    <Link href="/founders/shivanshi-rauthan" className="hover:text-[#8DBEFF] transition-colors">
                      Shivanshi Rauthan
                    </Link>
                  </h3>
                  <p className="text-xs text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk">
                    Co-Founder • Director • Producer • Creative Lead
                  </p>
                </div>
                <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                  As the co-founder of TheOldverse Productions, Shivanshi Rauthan leads the creative vision behind every project. Her passion for filmmaking, storytelling, and visual direction ensures that each production reflects originality, emotion, and artistic excellence.
                </p>
                <Link
                  href="/founders/shivanshi-rauthan"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8DBEFF] font-bold uppercase tracking-wider hover:underline pt-1"
                >
                  <span>View Official Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Founder 2: Vivek */}
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0 bg-oldverse-card">
                <img
                  src="/images/founders/vivek-rautela-founder-theoldverse-productions.webp"
                  alt="Vivek Rautela, Founder, Writer, Director and Producer of TheOldverse Productions"
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-grotesk text-xl font-bold text-oldverse-text">
                    <Link href="/founders/vivek-rautela" className="hover:text-[#8DBEFF] transition-colors">
                      Vivek Rautela
                    </Link>
                  </h3>
                  <p className="text-xs text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk">
                    Founder • Writer • Director • Producer
                  </p>
                </div>
                <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                  Vivek Rautela is the Founder of TheOldverse Productions and the creative mind behind its stories. As a director, producer, and writer, he focuses on building powerful narratives that connect with audiences and transform ideas into unforgettable cinematic experiences.
                </p>
                <Link
                  href="/founders/vivek-rautela"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8DBEFF] font-bold uppercase tracking-wider hover:underline pt-1"
                >
                  <span>View Official Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Team & Visionaries Roster (Dynamic from Admin Panel Database) */}
        <div className="space-y-8">
          <h2 className="font-bebas text-3xl sm:text-4xl text-oldverse-text tracking-wider uppercase text-center">
            Meet Our Studio Team & Visionaries
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="glassmorphism-card p-5 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-oldverse-card flex-shrink-0">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <DefaultAvatar />
                    )}
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-grotesk text-sm font-bold text-oldverse-text">
                        {member.profile_link ? (
                          <Link href={member.profile_link} className="hover:text-[#8DBEFF]">
                            {member.full_name}
                          </Link>
                        ) : (
                          member.full_name
                        )}
                      </h3>
                      <p className="text-[10px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk mb-2">
                        {member.role}
                      </p>
                      <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                        {member.bio || "Creative team member at TheOldverse Productions."}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Fallback static visionaries */
              <>
                <div className="glassmorphism-card p-5 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-oldverse-card flex-shrink-0">
                    <DefaultAvatar />
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-grotesk text-sm font-bold text-oldverse-text">
                        <Link href="/founders/shivanshi-rauthan" className="hover:text-[#8DBEFF]">
                          Shivanshi Rauthan
                        </Link>
                      </h3>
                      <p className="text-[10px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk mb-2">
                        Co-Founder • Director • Creative Lead
                      </p>
                      <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                        Leading the creative direction of TheOldverse, Shivanshi transforms ideas into visually compelling and emotionally engaging cinematic experiences.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glassmorphism-card p-5 rounded-xl border border-white/5 flex flex-col items-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-oldverse-card flex-shrink-0">
                    <img
                      src="/images/founders/vivek-rautela-founder-theoldverse-productions.webp"
                      alt="Vivek Rautela, Founder, Writer, Director and Producer of TheOldverse Productions"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-grotesk text-sm font-bold text-oldverse-text">
                        <Link href="/founders/vivek-rautela" className="hover:text-[#8DBEFF]">
                          Vivek Rautela
                        </Link>
                      </h3>
                      <p className="text-[10px] text-oldverse-accent font-semibold uppercase tracking-wider font-grotesk mb-2">
                        Founder • Writer • Director • Producer
                      </p>
                      <p className="text-xs text-oldverse-secondary font-light leading-relaxed">
                        Vivek develops original stories, screenplays, and directs projects with a vision to create films that leave a lasting impact.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
