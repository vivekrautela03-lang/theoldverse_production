import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const { data: member, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !member) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { data: updated, error } = await supabaseAdmin
      .from("team_members")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "TEAM_MEMBER_UPDATED",
      entity_type: "TeamMember",
      entity_id: id,
      details: `Team member "${updated.name}" updated`
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "TEAM_MEMBER_DELETED",
      entity_type: "TeamMember",
      entity_id: id,
      details: `Team member ID ${id} deleted`
    });

    return NextResponse.json({ success: true, message: "Team member deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
