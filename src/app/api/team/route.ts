import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const defaultStudioTeam = [
  {
    id: "vivek-rautela",
    name: "Vivek Rautela",
    full_name: "Vivek Rautela",
    position: "Founder · Writer · Director · Producer",
    role: "Founder · Writer · Director · Producer",
    avatar_url: "/images/founders/vivek-rautela-founder-theoldverse-productions.webp",
    bio: "Founder of TheOldverse Productions. Director, producer, and scriptwriter focused on building powerful cinematic stories.",
    instagram_url: "https://instagram.com/psf_vivek",
    linkedin_url: "",
    email: "theoldverse@gmail.com",
    profile_link: "/founders/vivek-rautela",
    display_order: 1,
    is_visible: true
  },
  {
    id: "shivanshi-rauthan",
    name: "Shivanshi Rauthan",
    full_name: "Shivanshi Rauthan",
    position: "Co-Founder · Director · Producer · Creative Lead",
    role: "Co-Founder · Director · Producer · Creative Lead",
    avatar_url: "",
    bio: "Co-Founder of TheOldverse Productions leading visual direction and creative production across films and digital media.",
    instagram_url: "https://instagram.com/theoldverse_",
    linkedin_url: "",
    email: "theoldverse@gmail.com",
    profile_link: "/founders/shivanshi-rauthan",
    display_order: 2,
    is_visible: true
  },
  {
    id: "shivansh-mourya",
    name: "Shivansh Mourya",
    full_name: "Shivansh Mourya",
    position: "Director & Creative Producer",
    role: "Director & Creative Producer",
    avatar_url: "",
    bio: "Director and creative producer at TheOldverse Productions focusing on narrative film development and visual production.",
    instagram_url: "https://instagram.com/theoldverse_",
    linkedin_url: "",
    email: "theoldverse@gmail.com",
    profile_link: "/founders/shivansh-mourya",
    display_order: 3,
    is_visible: true
  },
  {
    id: "ujjawal-gurung",
    name: "Ujjawal Gurung",
    full_name: "Ujjawal Gurung",
    position: "Cinematographer & Post-Production Lead",
    role: "Cinematographer & Post-Production Lead",
    avatar_url: "",
    bio: "Lead cinematographer and post-production specialist at TheOldverse Productions crafting high-impact visual aesthetics.",
    instagram_url: "https://instagram.com/theoldverse_",
    linkedin_url: "",
    email: "theoldverse@gmail.com",
    profile_link: "/founders/ujjawal-gurung",
    display_order: 4,
    is_visible: true
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    full_name: "Elena Rostova",
    position: "Cinematic Storyteller & Senior Director",
    role: "Cinematic Storyteller & Senior Director",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop",
    bio: "Specializing in deeply intimate character studies, dramatic shorts, and rich visual symbolism.",
    instagram_url: "https://instagram.com",
    linkedin_url: "",
    email: "elena@theoldverse.com",
    profile_link: "/creator/creator-1",
    display_order: 5,
    is_visible: true
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    full_name: "Marcus Vance",
    position: "Action Director & Visual Effects Lead",
    role: "Action Director & Visual Effects Lead",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
    bio: "Combining practical stunt work with visual effects to build immersive cyberpunk and futuristic narrative worlds.",
    instagram_url: "https://instagram.com",
    linkedin_url: "",
    email: "marcus@theoldverse.com",
    profile_link: "/creator/creator-2",
    display_order: 6,
    is_visible: true
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    full_name: "Sarah Chen",
    position: "Travel Documentarian & Street Photographer",
    role: "Travel Documentarian & Street Photographer",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop",
    bio: "Documenting raw street culture, unscripted human stories, and high-contrast photography across 60+ countries.",
    instagram_url: "https://instagram.com",
    linkedin_url: "",
    email: "sarah@theoldverse.com",
    profile_link: "/creator/creator-3",
    display_order: 7,
    is_visible: true
  },
  {
    id: "vikram-malhotra",
    name: "Vikram Malhotra",
    full_name: "Vikram Malhotra",
    position: "Documentarian & Sound Scaper",
    role: "Documentarian & Sound Scaper",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
    bio: "Creating immersive auditory and visual experiences exploring nature, industry, and ambient soundscapes.",
    instagram_url: "https://instagram.com",
    linkedin_url: "",
    email: "vikram@theoldverse.com",
    profile_link: "/creator/creator-4",
    display_order: 8,
    is_visible: true
  }
];

export async function GET() {
  try {
    const { data: teamMembers, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !teamMembers || teamMembers.length === 0) {
      return NextResponse.json({ success: true, team: defaultStudioTeam, source: "fallback" });
    }

    // Format DB fields to fit all frontend component conventions
    const formattedDbTeam = teamMembers.map((m) => ({
      id: m.id,
      name: m.name || m.full_name || "Team Member",
      full_name: m.name || m.full_name || "Team Member",
      position: m.position || m.role || "Team Member",
      role: m.position || m.role || "Team Member",
      bio: m.bio || "",
      avatar_url: m.avatar_url || "",
      instagram_url: m.instagram_url || "",
      linkedin_url: m.linkedin_url || "",
      email: m.email || "",
      display_order: m.display_order ?? 0,
      is_visible: m.is_visible ?? true,
      profile_link: m.instagram_url || m.linkedin_url || ""
    }));

    // Merge default roster with DB members to guarantee Shivansh Mourya, Ujjawal Gurung, Vivek, and Shivanshi are always active
    const dbNames = new Set(formattedDbTeam.map(t => t.name.toLowerCase()));
    const missingDefaults = defaultStudioTeam.filter(d => !dbNames.has(d.name.toLowerCase()));

    const combinedTeam = [...formattedDbTeam, ...missingDefaults];

    return NextResponse.json({ success: true, team: combinedTeam, source: "database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, team: defaultStudioTeam }, { status: 500 });
  }
}
