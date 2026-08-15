import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    let query = supabaseAdmin
      .from("job_openings")
      .select("*")
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: jobs, error } = await query;

    if (error) {
      return NextResponse.json({ success: true, jobs: [] });
    }

    return NextResponse.json({ success: true, jobs: jobs || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, department, description, requirements, type, location, deadline, status } = body;

    if (!title || !department || !description) {
      return NextResponse.json({ success: false, error: "Title, department, and description are required" }, { status: 400 });
    }

    const { data: job, error } = await supabaseAdmin
      .from("job_openings")
      .insert({
        title,
        department,
        description,
        requirements: requirements || [],
        type: type || "Full-Time",
        location: location || "Remote",
        deadline: deadline || null,
        status: status || "open"
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "JOB_OPENING_CREATED",
      entity_type: "JobOpening",
      entity_id: job.id,
      details: `Job opening "${title}" created`
    });

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
