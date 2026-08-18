import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    let query = supabaseAdmin.from("website_content").select("*");

    if (section) {
      query = query.eq("section", section);
    }

    const { data: dbContent, error } = await query;

    if (error || !dbContent) {
      return NextResponse.json({ success: true, content: {} });
    }

    const contentMap: Record<string, any> = {};
    dbContent.forEach((row) => {
      contentMap[row.section] = row.content;
    });

    if (section) {
      return NextResponse.json({
        success: true,
        section,
        content: contentMap[section] || null
      });
    }

    return NextResponse.json({
      success: true,
      content: contentMap
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
