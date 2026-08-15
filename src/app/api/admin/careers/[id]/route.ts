import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const { data: job, error } = await supabaseAdmin
      .from("job_openings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !job) {
      return NextResponse.json({ success: false, error: "Job opening not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { data: updated, error } = await supabaseAdmin
      .from("job_openings")
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
      action: "JOB_OPENING_UPDATED",
      entity_type: "JobOpening",
      entity_id: id,
      details: `Job opening "${updated.title}" updated`
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("job_openings")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "JOB_OPENING_DELETED",
      entity_type: "JobOpening",
      entity_id: id,
      details: `Job opening ID ${id} deleted`
    });

    return NextResponse.json({ success: true, message: "Job opening deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
