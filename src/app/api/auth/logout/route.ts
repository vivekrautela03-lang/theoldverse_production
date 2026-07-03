import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ success: true, message: "Logged out successfully." });
    
    // Clear cookies by setting maxAge = 0
    response.cookies.set("session_at", "", { path: "/", maxAge: 0 });
    response.cookies.set("session_rt", "", { path: "/api/auth", maxAge: 0 });
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during logout: " + error.message },
      { status: 500 }
    );
  }
}
