import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverDb } from "@/lib/serverDb";
import { signJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";
  
  try {
    // 1. Retrieve the Refresh Token from secure cookie
    const cookies = request.headers.get("cookie") || "";
    // Simple cookie parser helper
    const getCookie = (name: string) => {
      const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    
    const refreshCookie = getCookie("session_rt");
    if (!refreshCookie) {
      return NextResponse.json({ success: false, error: "Refresh token is missing" }, { status: 401 });
    }

    // 2. Lookup Session in Server Database
    const session = serverDb.getSession(refreshCookie);
    if (!session) {
      serverDb.addAuditLog(
        "REFRESH_FAIL_NO_SESSION",
        ip,
        userAgent,
        `Refresh token not found in database. Token hash prefix: ${refreshCookie.slice(0, 8)}`
      );
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    // 3. Expiration Check
    if (new Date(session.expiresAt) < new Date()) {
      serverDb.revokeSession(refreshCookie);
      serverDb.addAuditLog(
        "SESSION_EXPIRED",
        ip,
        userAgent,
        `Session expired for User ID: ${session.userId}`
      );
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    // 4. Token Reuse Detection (Replay Attack Prevention)
    if (session.rotated) {
      // SECURITY WARNING: This refresh token has been used already!
      // This indicates that either the user or an attacker is attempting to reuse an invalidated token.
      // Action: Revoke all active sessions for the user to prevent further hijacking.
      serverDb.revokeSessionsForUser(session.userId);
      serverDb.addAuditLog(
        "REFRESH_TOKEN_REUSE_DETECTED",
        ip,
        userAgent,
        `CRITICAL: Refresh token reuse detected for User ID: ${session.userId}. All sessions revoked!`
      );
      
      // Clear cookies on client
      const response = NextResponse.json(
        { success: false, error: "Security alert: session hijacked and revoked." },
        { status: 401 }
      );
      response.cookies.delete("session_at");
      response.cookies.delete("session_rt");
      return response;
    }

    // 5. Get User details
    const user = serverDb.getUserById(session.userId);
    if (!user) {
      serverDb.revokeSession(refreshCookie);
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
    }

    // 6. Refresh Token Rotation (RTR)
    const newSessionToken = crypto.randomBytes(32).toString("hex");
    const accessTokenPayload = {
      sub: user.id,
      email: user.emailOrPhone,
      isAdmin: user.isAdmin,
      isCreator: user.isCreator,
      name: user.name
    };

    // Mark current session as rotated
    serverDb.updateSession(session.id, { rotated: true, rotatedTo: newSessionToken });

    // Create a new session in database
    const refreshExpirySeconds = 7 * 24 * 3600;
    serverDb.createSession(user.id, newSessionToken, refreshExpirySeconds, ip, userAgent);

    // Generate new Access Token (JWT, 15m)
    const accessToken = signJwt(accessTokenPayload, 15 * 60);

    serverDb.addAuditLog(
      "SESSION_REFRESHED",
      ip,
      userAgent,
      `Session refreshed successfully for User ID: ${user.id} (Refresh Token Rotated)`
    );

    // 7. Update cookies
    const response = NextResponse.json({ success: true });
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("session_at", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60
    });

    response.cookies.set("session_rt", newSessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/api/auth",
      maxAge: refreshExpirySeconds
    });

    return response;

  } catch (error: any) {
    serverDb.addAuditLog(
      "REFRESH_ERROR",
      ip,
      userAgent,
      `Refresh token process exception: ${error.message}`
    );
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during session refresh." },
      { status: 500 }
    );
  }
}
