import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    let query = supabaseAdmin
      .from("productions")
      .select("*, project:projects(title)")
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: productions, error } = await query;

    if (error) {
      return NextResponse.json({ success: true, productions: [] });
    }

    return NextResponse.json({ success: true, productions: productions || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      project_id,
      type,
      director,
      producer,
      crew,
      actors,
      start_date,
      end_date,
      location,
      status,
      progress_percentage,
      budget,
      notes,
      files
    } = body;

    if (!title || !director || !producer || !location) {
      return NextResponse.json({ success: false, error: "Title, director, producer, and location are required fields" }, { status: 400 });
    }

    const { data: newProduction, error } = await supabaseAdmin
      .from("productions")
      .insert({
        title,
        project_id: project_id || null,
        type: type || "Short Film",
        director,
        producer,
        crew: crew || [],
        actors: actors || [],
        start_date: start_date || null,
        end_date: end_date || null,
        location,
        status: status || "Planning",
        progress_percentage: progress_percentage || 0,
        budget: budget || "$0",
        notes: notes || "",
        files: files || []
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Log Activity
    await supabaseAdmin.from("activity_logs").insert({
      action: "PRODUCTION_CREATED",
      entity_type: "Production",
      entity_id: newProduction.id,
      details: `Production "${title}" created`
    });

    return NextResponse.json({ success: true, production: newProduction });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
