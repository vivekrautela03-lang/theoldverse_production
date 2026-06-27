import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { serverDb } from "@/lib/serverDb";
import { verifyTotp } from "@/lib/authCrypto";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

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

    const user = serverDb.getUserById(payload.sub);
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ success: false, error: "2FA has not been setup yet." }, { status: 400 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ success: false, error: "Verification code is required." }, { status: 400 });
    }

    // Verify TOTP code
    const isTokenValid = verifyTotp(user.twoFactorSecret, code);
    if (!isTokenValid) {
      serverDb.addAuditLog(
        "2FA_VERIFICATION_FAILED",
        ip,
        userAgent,
        `2FA setup verification failed for user ID: ${user.id}`
      );
      return NextResponse.json({ success: false, error: "Invalid verification code. Please try again." }, { status: 400 });
    }

    // Enable 2FA permanently
    serverDb.updateUser(user.id, {
      twoFactorEnabled: true
    });

    serverDb.addAuditLog(
      "2FA_ENABLED",
      ip,
      userAgent,
      `2FA enabled successfully for user ID: ${user.id}`
    );

    return NextResponse.json({
      success: true,
      message: "Two-Factor Authentication (2FA) has been successfully enabled on your account!"
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
