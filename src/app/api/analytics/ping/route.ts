import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { path, title } = await request.json();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

    if (!path) return NextResponse.json({ success: true });

    // Ignore admin routes from customer telemetry
    if (path.startsWith("/admin")) {
      return NextResponse.json({ success: true });
    }

    await supabaseAdmin.from("activity_logs").insert({
      user_name: "Public Visitor",
      action: "PAGE_VIEW",
      entity_type: "Page",
      entity_id: path,
      details: JSON.stringify({ title: title || path, ip, userAgent })
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
