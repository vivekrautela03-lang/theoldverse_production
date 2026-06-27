import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";
  
  try {
    const cookies = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    
    const refreshToken = getCookie("session_rt");
    if (refreshToken) {
      // Revoke session in database
      const session = serverDb.getSession(refreshToken);
      if (session) {
        serverDb.revokeSession(refreshToken);
        serverDb.addAuditLog(
          "LOGOUT",
          ip,
          userAgent,
          `User ID ${session.userId} logged out successfully.`
        );
      }
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully." });
    
    // Clear cookies by setting maxAge = 0
    response.cookies.set("session_at", "", { path: "/", maxAge: 0 });
    response.cookies.set("session_rt", "", { path: "/api/auth", maxAge: 0 });
    
    return response;

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during logout." },
      { status: 500 }
    );
  }
}
