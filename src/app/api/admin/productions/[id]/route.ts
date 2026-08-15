import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const { data: production, error } = await supabaseAdmin
      .from("productions")
      .select("*, project:projects(title)")
      .eq("id", id)
      .single();

    if (error || !production) {
      return NextResponse.json({ success: false, error: "Production not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, production });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { data: updated, error } = await supabaseAdmin
      .from("productions")
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
      action: "PRODUCTION_UPDATED",
      entity_type: "Production",
      entity_id: id,
      details: `Production "${updated.title}" updated`
    });

    return NextResponse.json({ success: true, production: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("productions")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "PRODUCTION_DELETED",
      entity_type: "Production",
      entity_id: id,
      details: `Production ID ${id} deleted`
    });

    return NextResponse.json({ success: true, message: "Production deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
