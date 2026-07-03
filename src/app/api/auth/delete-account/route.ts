import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(request: Request) {
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

    const payload = verifyJwt(accessToken);
    if (!payload || !payload.sub) {
      return NextResponse.json({ success: false, error: "Session invalid or expired" }, { status: 401 });
    }

    const userId = payload.sub;

    // Securely delete user using Supabase Admin Client
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, message: "Account deleted successfully." });
    response.cookies.set("session_at", "", { path: "/", maxAge: 0 });
    response.cookies.set("session_rt", "", { path: "/api/auth", maxAge: 0 });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during account deletion: " + error.message },
      { status: 500 }
    );
  }
}
