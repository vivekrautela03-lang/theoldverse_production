import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: teamMembers, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !teamMembers || teamMembers.length === 0) {
      // Fallback default founders roster
      const defaultRoster = [
        {
          id: "vivek-rautela",
          name: "Vivek Rautela",
          full_name: "Vivek Rautela",
          position: "Founder · Writer · Director · Producer",
          role: "Founder · Writer · Director · Producer",
          avatar_url: "/images/founders/vivek-rautela-founder-theoldverse-productions.webp",
          bio: "Founder of TheOldverse Productions. Director, producer, and scriptwriter focused on building powerful cinematic stories.",
          instagram_url: "https://instagram.com/psf_vivek",
          profile_link: "/founders/vivek-rautela"
        },
        {
          id: "shivanshi-rauthan",
          name: "Shivanshi Rauthan",
          full_name: "Shivanshi Rauthan",
          position: "Co-Founder · Director · Producer · Creative Lead",
          role: "Co-Founder · Director · Producer · Creative Lead",
          avatar_url: "",
          bio: "Co-Founder of TheOldverse Productions leading visual direction and creative production across films and digital media.",
          profile_link: "/founders/shivanshi-rauthan"
        }
      ];
      return NextResponse.json({ success: true, team: defaultRoster, source: "fallback" });
    }

    // Format DB fields to fit all frontend component conventions
    const formattedTeam = teamMembers.map((m) => ({
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

    return NextResponse.json({ success: true, team: formattedTeam, source: "database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
