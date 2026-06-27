import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";
import { signJwt } from "@/lib/jwt";
import { verifyPassword } from "@/lib/authCrypto";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  try {
    const body = await request.json();
    const { email, password } = body;
    const targetEmail = (email || "").trim().toLowerCase();

    if (targetEmail !== "theoldverse@gmail.com") {
      serverDb.addAuditLog("ADMIN_STEPUP_FAIL_EMAIL", ip, userAgent, `Step-up blocked: Invalid admin email supplied: ${targetEmail}`);
      return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });
    }

    const adminUser = serverDb.getUser(targetEmail);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });
    }

    const isPasswordValid = verifyPassword(password, adminUser.salt, adminUser.passwordHash);
    if (!isPasswordValid) {
      serverDb.addAuditLog(
        "ADMIN_STEPUP_FAIL_PWD",
        ip,
        userAgent,
        `Incorrect step-up password entered for administrator: ${targetEmail}`
      );
      return NextResponse.json({ success: false, error: "Invalid password." }, { status: 400 });
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
