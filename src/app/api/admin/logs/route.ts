import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    
    const accessToken = getCookie("session_at");
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    // Verify admin role in database profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";
    if (role !== "admin" && user.email !== "theoldverse@gmail.com") {
      return NextResponse.json({ success: false, error: "Access Denied: Administrative role required." }, { status: 403 });
    }

    const logs = await serverDb.getAuditLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Failed to load logs: ${errorMsg}` },
      { status: 500 }
    );
  }
}
