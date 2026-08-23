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

    // Filter out removed placeholder names
    const removedNames = new Set(["elena rostova", "marcus vance", "sarah chen", "vikram malhotra"]);
    const cleanedDbTeam = formattedDbTeam.filter(t => !removedNames.has(t.name.toLowerCase()));

    // Merge default roster with cleaned DB members
    const dbNames = new Set(cleanedDbTeam.map(t => t.name.toLowerCase()));
    const missingDefaults = defaultStudioTeam.filter(d => !dbNames.has(d.name.toLowerCase()));

    const combinedTeam = [...cleanedDbTeam, ...missingDefaults];

    return NextResponse.json({ success: true, team: combinedTeam, source: "database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, team: defaultStudioTeam }, { status: 500 });
  }
}
