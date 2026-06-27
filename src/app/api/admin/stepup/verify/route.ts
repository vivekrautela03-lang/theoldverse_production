import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";
import { signJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  try {
    const body = await request.json();
    const { email, otpCode } = body;
    const targetEmail = (email || "").trim().toLowerCase();
    const inputCode = (otpCode || "").trim();

    if (targetEmail !== "theoldverse@gmail.com") {
      return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });
    }

    const globalContext = global as typeof globalThis & { otpStore?: Map<string, string> };
    const otpStore = globalContext.otpStore;
    if (!otpStore) {
      return NextResponse.json({ success: false, error: "No active verification requests." }, { status: 400 });
    }

    const correctCode = otpStore.get(`admin_stepup_${targetEmail}`);
    if (!correctCode || correctCode !== inputCode) {
      serverDb.addAuditLog(
        "ADMIN_STEPUP_FAIL_OTP",
        ip,
        userAgent,
        `Incorrect step-up OTP entered for administrator: ${targetEmail}`
      );
      return NextResponse.json({ success: false, error: "Invalid verification code." }, { status: 400 });
    }

    // Clear verification state immediately
    otpStore.delete(`admin_stepup_${targetEmail}`);

    const adminUser = serverDb.getUser(targetEmail);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });
    }

    // Sign sudo access token (valid for 30 minutes)
    const sudoPayload = {
      sub: adminUser.id,
      email: adminUser.emailOrPhone,
      sudo: true
    };
    const sudoToken = signJwt(sudoPayload, 30 * 60);

    serverDb.addAuditLog(
      "ADMIN_STEPUP_SUCCESS",
      ip,
      userAgent,
      `Step-up verified: Administrator ${targetEmail} granted sudo session.`
    );

    const response = NextResponse.json({ success: true });
    const isProduction = process.env.NODE_ENV === "production";

    // Set cookie valid for 30 minutes
    response.cookies.set("admin_session", sudoToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60
    });

    return response;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: `Verification failed: ${errorMsg}` }, { status: 500 });
  }
}
