import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    
    const accessToken = getCookie("session_at");
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify token using native Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return NextResponse.json({ success: false, error: "Token invalid or expired" }, { status: 401 });
    }

    // Fetch user profile from public.profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: profile?.full_name || user.email?.split("@")[0] || "User",
        email: user.email,
        isAdmin: role === "admin" || user.email === "theoldverse@gmail.com",
        isCreator: role === "creator" || role === "admin" || user.email === "theoldverse@gmail.com" || user.email === "pioneer@oldverse.com"
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
