import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "all";
    const category = searchParams.get("category") || "all";

    let query = supabaseAdmin
      .from("media_files")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (type !== "all") {
      query = query.eq("file_type", type);
    }

    if (category !== "all") {
      query = query.eq("category", category);
    }

    const { data: media, error } = await query;

    if (error) {
      return NextResponse.json({ success: true, media: [] });
    }

    return NextResponse.json({ success: true, media: media || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, storage_path, file_url, file_type, category, size_bytes } = body;

    if (!name || !file_url) {
      return NextResponse.json({ success: false, error: "File name and file URL are required" }, { status: 400 });
    }

    const { data: mediaFile, error } = await supabaseAdmin
      .from("media_files")
      .insert({
        name,
        storage_path: storage_path || "",
        file_url,
        file_type: file_type || "image",
        category: category || "General",
        size_bytes: size_bytes || 0
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "MEDIA_UPLOADED",
      entity_type: "MediaFile",
      entity_id: mediaFile.id,
      details: `Media file "${name}" uploaded`
    });

    return NextResponse.json({ success: true, media: mediaFile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
