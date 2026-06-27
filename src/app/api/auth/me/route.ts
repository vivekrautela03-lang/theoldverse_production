import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(accessToken);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Token invalid or expired" }, { status: 401 });
    }

    // Double check that user still exists
    const user = serverDb.getUserById(payload.sub);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.emailOrPhone,
        isAdmin: user.isAdmin,
        isCreator: user.isCreator,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
