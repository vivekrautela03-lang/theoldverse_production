import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { defaultStudioTeam } from "@/app/api/team/route";

export async function GET() {
  try {
    const { data: team, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !team || team.length === 0) {
      return NextResponse.json({ success: true, team: defaultStudioTeam, source: "default" });
    }

    // Format DB fields for Admin UI
    const formattedTeam = team.map((m) => ({
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
      is_visible: m.is_visible ?? true
    }));

    // Merge default roster if missing
    const dbNames = new Set(formattedTeam.map(t => t.name.toLowerCase()));
    const missingDefaults = defaultStudioTeam.filter(d => !dbNames.has(d.name.toLowerCase()));
    const combinedTeam = [...formattedTeam, ...missingDefaults];

    return NextResponse.json({ success: true, team: combinedTeam });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, team: defaultStudioTeam }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      position,
      bio,
      avatar_url,
      instagram_url,
      linkedin_url,
      email,
      display_order,
      is_visible
    } = body;

    if (!name || !position || !bio) {
      return NextResponse.json({ success: false, error: "Name, position, and bio are required" }, { status: 400 });
    }

    const { data: member, error } = await supabaseAdmin
      .from("team_members")
      .insert({
        name,
        position,
        bio,
        avatar_url: avatar_url || "",
        instagram_url: instagram_url || "",
        linkedin_url: linkedin_url || "",
        email: email || "",
        display_order: display_order || 0,
        is_visible: is_visible ?? true
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
