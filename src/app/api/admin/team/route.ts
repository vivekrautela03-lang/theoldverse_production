import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: team, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: true, team: [] });
    }

    return NextResponse.json({ success: true, team: team || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

    if (!name || !position || !bio || !avatar_url) {
      return NextResponse.json({ success: false, error: "Name, position, bio, and avatar URL are required" }, { status: 400 });
    }

    const { data: member, error } = await supabaseAdmin
      .from("team_members")
      .insert({
        name,
        position,
        bio,
        avatar_url,
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

    await supabaseAdmin.from("activity_logs").insert({
      action: "TEAM_MEMBER_ADDED",
      entity_type: "TeamMember",
      entity_id: member.id,
      details: `Team member "${name}" added (${position})`
    });

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
