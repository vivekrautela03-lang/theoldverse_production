import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverDb } from "@/lib/serverDb";
import { verifyPassword, verifyTotp } from "@/lib/authCrypto";
import { signJwt } from "@/lib/jwt";

function getClientFingerprint(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  let os = "unknown_os";
  if (ua.includes("windows")) os = "win";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "mac";
  else if (ua.includes("linux")) os = "linux";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "ios";
  else if (ua.includes("android")) os = "android";
  
  let browser = "unknown_browser";
  if (ua.includes("firefox")) browser = "firefox";
  else if (ua.includes("chrome")) browser = "chrome";
  else if (ua.includes("safari")) browser = "safari";
  else if (ua.includes("edge")) browser = "edge";
  
  return `${os}_${browser}`;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";
  
  try {
    // 1. IP Rate Limiting: 10 login requests per minute per IP
    const rateLimit = serverDb.checkRateLimit(`login_rate_${ip}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      serverDb.addAuditLog(
        "LOGIN_BLOCKED_RATE",
        ip,
        userAgent,
        `Login rate limit hit for IP: ${ip}. Locked until ${rateLimit.resetAt}`
      );
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const emailOrPhone = body.emailOrPhone?.trim();
    const password = body.password;
    const totpToken = body.totpToken?.trim();

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { success: false, error: "Email/phone and password are required fields." },
        { status: 400 }
      );
    }

    // 2. Retrieve User
    const user = serverDb.getUser(emailOrPhone);
    if (!user) {
      // Return generic error to prevent user enumeration
      serverDb.addAuditLog("LOGIN_FAIL_NO_USER", ip, userAgent, `Login failed for non-existent identifier: ${emailOrPhone}`);
      return NextResponse.json(
        { success: false, error: "Invalid email/phone or password." },
        { status: 400 }
      );
    }

    // 3. Brute-Force Protection / Lockout Check
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      serverDb.addAuditLog(
        "LOGIN_FAIL_LOCKED",
        ip,
        userAgent,
        `Login rejected for locked account: ${emailOrPhone}`
      );
      const remainingTime = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          success: false,
          error: `This account is temporarily locked due to too many failed attempts. Try again in ${remainingTime} minute(s).`
        },
        { status: 403 }
      );
    }

    // 4. Verify Password
    const passwordMatch = verifyPassword(password, user.salt, user.passwordHash);
    if (!passwordMatch) {
      // Increment failed logins
      const attempts = user.failedLogins + 1;
      const updates: { failedLogins: number; lockedUntil?: string } = { failedLogins: attempts };
      let message = "Invalid email/phone or password.";
      
      if (attempts >= 5) {
        // Lock out account for 15 minutes
        const lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        updates.lockedUntil = lockedUntil;
        serverDb.addAuditLog(
          "ACCOUNT_LOCKOUT",
          ip,
          userAgent,
          `Account locked due to brute-force: ${emailOrPhone} until ${lockedUntil}`
        );
        message = "Account locked temporarily due to too many failed attempts. Please try again in 15 minutes.";
      } else {
        serverDb.addAuditLog(
          "LOGIN_FAIL_PWD",
          ip,
          userAgent,
          `Failed password attempt (${attempts}/5) for account: ${emailOrPhone}`
        );
      }

      serverDb.updateUser(user.id, updates);
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    // 5. 2FA Check
    if (user.twoFactorEnabled) {
      if (!totpToken) {
        serverDb.addAuditLog(
          "LOGIN_2FA_REQUIRED",
          ip,
          userAgent,
          `Password verified, 2FA code required for: ${emailOrPhone}`
        );
        return NextResponse.json({
          success: true,
          requires2FA: true,
          userId: user.id,
          message: "Please enter your 2-Factor Authentication code."
        });
      }

      // Verify 2FA token
      const is2faValid = verifyTotp(user.twoFactorSecret!, totpToken);
      if (!is2faValid) {
        serverDb.addAuditLog(
          "LOGIN_FAIL_2FA",
          ip,
          userAgent,
          `Invalid 2FA code supplied for: ${emailOrPhone}`
        );
        return NextResponse.json({ success: false, error: "Invalid 2FA code." }, { status: 400 });
      }
    }

    // 6. Reset Lockout Counter & Log Successful Auth
    serverDb.updateUser(user.id, {
      failedLogins: 0,
      lockedUntil: undefined
    });

    // 7. Session Creation & Token Generation
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const fingerprint = getClientFingerprint(userAgent);
    const accessTokenPayload = {
      sub: user.id,
      email: user.emailOrPhone,
      isAdmin: user.isAdmin,
      isCreator: user.isCreator,
      name: user.name,
      fp: fingerprint
    };

    // Sign Access Token (JWT, expires in 15m)
    const accessToken = signJwt(accessTokenPayload, 15 * 60);

    // Save Session in Server Database (expires in 7d)
    const refreshExpirySeconds = 7 * 24 * 3600;
    serverDb.createSession(user.id, sessionToken, refreshExpirySeconds, ip, userAgent);

    serverDb.addAuditLog(
      "LOGIN_SUCCESS",
      ip,
      userAgent,
      `User logged in successfully. ID: ${user.id}, 2FA Active: ${user.twoFactorEnabled}`
    );

    // 8. Secure HttpOnly Cookies
    const response = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.emailOrPhone,
        isAdmin: user.isAdmin,
        isCreator: user.isCreator
      }
    });

    const isProduction = process.env.NODE_ENV === "production";
    
    // Set Access Token cookie (Lax SameSite, path-scoped to all routes)
    response.cookies.set("session_at", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 // 15 mins
    });

    // Set Refresh Token cookie (Strict SameSite, path-scoped only to token refresh endpoint for CSRF prevention)
    response.cookies.set("session_rt", sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/api/auth",
      maxAge: refreshExpirySeconds // 7 days
    });

    return response;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    serverDb.addAuditLog(
      "LOGIN_ERROR",
      ip,
      userAgent,
      `Login process exception: ${errorMsg}`
    );
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
