import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { serverDb } from "@/lib/serverDb";
import { generateTotpSecret } from "@/lib/authCrypto";

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
    if (!payload) {
      return NextResponse.json({ success: false, error: "Token invalid or expired" }, { status: 401 });
    }

    const user = serverDb.getUserById(payload.sub);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
    }

    // Generate TOTP Secret
    const { secret, otpauthUrl } = generateTotpSecret(user.emailOrPhone);

    // Save temporary secret (do not enable 2FA yet until verified)
    serverDb.updateUser(user.id, {
      twoFactorSecret: secret // Store in secret field temporarily
    });

    serverDb.addAuditLog(
      "2FA_SETUP_INITIATED",
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      request.headers.get("user-agent") || "",
      `2FA setup initiated for user ID: ${user.id}`
    );

    return NextResponse.json({
      success: true,
      secret,
      otpauthUrl,
      message: "Scan the QR code or enter the secret key in your Google Authenticator app."
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
