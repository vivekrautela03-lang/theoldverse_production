import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: contentRows, error } = await supabaseAdmin
      .from("website_content")
      .select("*");

    if (error) {
      return NextResponse.json({ success: true, content: {} });
    }

    const contentMap: Record<string, any> = {};
    if (contentRows) {
      contentRows.forEach((row) => {
        contentMap[row.section] = row.content;
      });
    }

    return NextResponse.json({ success: true, content: contentMap });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { section, content } = await request.json();

    if (!section || !content) {
      return NextResponse.json({ success: false, error: "Section and content payload are required" }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("website_content")
      .upsert({
        section,
        content,
        updated_at: new Date().toISOString()
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "CMS_CONTENT_UPDATED",
      entity_type: "CMSSection",
      entity_id: section,
      details: `Website content section "${section}" updated`
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
