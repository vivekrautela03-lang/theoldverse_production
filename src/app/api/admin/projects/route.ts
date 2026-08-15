import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";

    let query = supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    if (category !== "all") {
      query = query.eq("category", category);
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.warn("[Admin Projects API] Table fallback to mock structure if missing:", error.message);
      return NextResponse.json({ success: true, projects: [] });
    }

    return NextResponse.json({ success: true, projects: projects || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      short_description,
      full_description,
      category,
      status,
      poster_url,
      banner_url,
      trailer_url,
      gallery_urls,
      release_date,
      instagram_url,
      youtube_url,
      credits,
      is_featured,
      is_published
    } = body;

    if (!title || !short_description || !poster_url) {
      return NextResponse.json({ success: false, error: "Title, short description, and poster URL are required" }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString(36);

    const { data: newProject, error } = await supabaseAdmin
      .from("projects")
      .insert({
        title,
        slug: generatedSlug,
        short_description,
        full_description: full_description || short_description,
        category: category || "Film",
        status: status || "Completed",
        poster_url,
        banner_url: banner_url || poster_url,
        trailer_url: trailer_url || "",
        gallery_urls: gallery_urls || [],
        release_date: release_date || "2026",
        instagram_url: instagram_url || "",
        youtube_url: youtube_url || "",
        credits: credits || [],
        is_featured: is_featured ?? false,
        is_published: is_published ?? true
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Log Activity
    await supabaseAdmin.from("activity_logs").insert({
      action: "PROJECT_CREATED",
      entity_type: "Project",
      entity_id: newProject.id,
      details: `Project "${title}" created`
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
