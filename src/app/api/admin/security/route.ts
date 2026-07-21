import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sanitizeInput } from "@/lib/security";

export async function GET(request: Request) {
  try {
    // 1. Get Cookie & Verify Admin Session
    const cookies = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    
    const accessToken = getCookie("session_at");
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    // Verify admin role in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";
    if (role !== "admin" && user.email !== "theoldverse@gmail.com") {
      return NextResponse.json({ success: false, error: "Access Denied: Administrative role required." }, { status: 403 });
    }

    // 2. Query Data using supabaseAdmin (Bypassing RLS)
    const { data: logs, error: logsError } = await supabaseAdmin
      .from("security_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    const { data: blockedIps, error: blockError } = await supabaseAdmin
      .from("ip_blocks")
      .select("*")
      .order("created_at", { ascending: false });

    if (logsError || blockError) {
      return NextResponse.json({ success: false, error: "Database retrieval error." }, { status: 500 });
    }

    // Calculate aggregated statistics
    const totalBlocked = blockedIps?.length || 0;
    const totalAttacks = logs?.length || 0;
    const sqlAttacks = logs?.filter(l => l.attack_type === "SQL_INJECTION").length || 0;
    const xssAttacks = logs?.filter(l => l.attack_type === "XSS_ATTEMPT").length || 0;
    const honeypotHits = logs?.filter(l => l.attack_type === "HONEYPOT_ACCESS").length || 0;

    return NextResponse.json({
      success: true,
      logs,
      blockedIps,
      stats: {
        totalBlocked,
        totalAttacks,
        sqlAttacks,
        xssAttacks,
        honeypotHits
      }
    });

  } catch (err) {
    console.error("[Security Admin API GET] Error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Get Cookie & Verify Admin Session
    const cookies = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    
    const accessToken = getCookie("session_at");
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    // Verify admin role in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";
    if (role !== "admin" && user.email !== "theoldverse@gmail.com") {
      return NextResponse.json({ success: false, error: "Access Denied: Administrative role required." }, { status: 403 });
    }

    const rawBody = await request.json();
    const body = sanitizeInput(rawBody);
    const { action, ip, reason } = body;

    // 2. Perform admin security operations
    if (action === "block") {
      if (!ip) {
        return NextResponse.json({ success: false, error: "IP address is required." }, { status: 400 });
      }

      // Block for 1 year (permanent manual block)
      const blockedUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabaseAdmin
        .from("ip_blocks")
        .upsert({
          ip,
          blocked_until: blockedUntil,
          reason: reason || "Manually blacklisted by Administrator"
        });

      if (error) {
        return NextResponse.json({ success: false, error: "Failed to block IP." }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "unblock") {
      if (!ip) {
        return NextResponse.json({ success: false, error: "IP address is required." }, { status: 400 });
      }

      const { error } = await supabaseAdmin
        .from("ip_blocks")
        .delete()
        .eq("ip", ip);

      if (error) {
        return NextResponse.json({ success: false, error: "Failed to unblock IP." }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "clear-logs") {
      const { error } = await supabaseAdmin
        .from("security_logs")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all logs

      if (error) {
        return NextResponse.json({ success: false, error: "Failed to clear logs." }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });

  } catch (err) {
    console.error("[Security Admin API POST] Error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
