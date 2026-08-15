import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_at")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Fetch user profile from database
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role || "customer";
    const status = profile?.status || "active";

    if (status !== "active" || !["owner", "admin", "editor"].includes(role)) {
      return NextResponse.json({ success: false, error: "Access Denied: Customer accounts or inactive accounts cannot access Admin Panel." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin",
        avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop",
        role: role,
        status: status,
        createdAt: profile?.created_at || user.created_at
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
