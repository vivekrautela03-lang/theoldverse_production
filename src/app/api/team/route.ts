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
          full_name: "Vivek Rautela",
          role: "Founder · Writer · Director · Producer",
          avatar_url: "/images/founders/vivek-rautela-founder-theoldverse-productions.webp",
          bio: "Founder of TheOldverse Productions. Director, producer, and scriptwriter focused on building powerful cinematic stories.",
          instagram_url: "https://instagram.com/psf_vivek",
          profile_link: "/founders/vivek-rautela"
        },
        {
          id: "shivanshi-rauthan",
          full_name: "Shivanshi Rauthan",
          role: "Co-Founder · Director · Producer · Creative Lead",
          avatar_url: "",
          bio: "Co-Founder of TheOldverse Productions leading visual direction and creative production across films and digital media.",
          profile_link: "/founders/shivanshi-rauthan"
        }
      ];
      return NextResponse.json({ success: true, team: defaultRoster, source: "fallback" });
    }

    return NextResponse.json({ success: true, team: teamMembers, source: "database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
