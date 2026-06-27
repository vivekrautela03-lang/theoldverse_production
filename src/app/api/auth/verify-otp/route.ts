/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverDb } from "@/lib/serverDb";
import { signJwt } from "@/lib/jwt";
import { hashPassword } from "@/lib/authCrypto";

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
    // Rate Limiting: 10 OTP verifications per minute per IP
    const rateLimit = serverDb.checkRateLimit(`verify_otp_rate_${ip}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      serverDb.addAuditLog("OTP_VERIFY_BLOCKED", ip, userAgent, `OTP verification rate limit hit for IP: ${ip}`);
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const { emailOrPhone, otpCode } = await request.json();
    const input = emailOrPhone?.trim();
    const code = otpCode?.trim();

    if (!input || !code) {
      return NextResponse.json({ success: false, error: "Input and OTP are required" }, { status: 400 });
    }

    const otpStore = (global as any).otpStore;
    if (!otpStore) {
      return NextResponse.json({ success: false, error: "No OTP requests found" }, { status: 400 });
    }

    const correctCode = otpStore.get(input);

    if (correctCode && correctCode === code) {
      // Clear OTP immediately after successful verification to prevent replay
      otpStore.delete(input);

      // 1. Get or Create User in Server DB
      let user = serverDb.getUser(input);
      if (!user) {
        // Automatically create account for passwordless sign-up
        const isEmail = input.includes("@");
        const defaultName = isEmail ? input.split("@")[0] : `User +91${input.slice(-4)}`;
        
        // Generate a random dummy password since it's passwordless
        const dummyPassword = crypto.randomBytes(32).toString("hex");
        const { salt, hash } = hashPassword(dummyPassword);
        
        // Flag as creator if includes specific keywords
        const isCreator = input.toLowerCase().includes("creator") || input.includes("pioneer");
        
        user = serverDb.createUser(
          defaultName,
          input,
          hash,
          salt,
          false, // isAdmin
          isCreator
        );
        
        serverDb.addAuditLog(
          "OTP_SIGNUP_SUCCESS",
          ip,
          userAgent,
          `Dynamically registered user via OTP: ID: ${user.id}, Identifier: ${input}`
        );
      } else {
        serverDb.addAuditLog(
          "OTP_LOGIN_SUCCESS",
          ip,
          userAgent,
          `OTP verified successfully for existing user: ID: ${user.id}, Identifier: ${input}`
        );
      }

      // Check if 2FA is enabled. If enabled, we must require 2FA token to complete login.
      if (user.twoFactorEnabled) {
        // We cannot complete the login until TOTP is validated.
        // We will store a temporary verification state and return a requires2FA response
        return NextResponse.json({
          success: true,
          requires2FA: true,
          userId: user.id,
          message: "Please enter your 2-Factor Authentication code."
        });
      }

      // 2. Create Session & Tokens
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

      const accessToken = signJwt(accessTokenPayload, 15 * 60);
      const refreshExpirySeconds = 7 * 24 * 3600;
      serverDb.createSession(user.id, sessionToken, refreshExpirySeconds, ip, userAgent);

      // 3. Return user data and set secure HttpOnly cookies
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
      
      response.cookies.set("session_at", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60
      });

      response.cookies.set("session_rt", sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/api/auth",
        maxAge: refreshExpirySeconds
      });

      return response;
    }

    serverDb.addAuditLog(
      "OTP_VERIFY_FAIL",
      ip,
      userAgent,
      `Incorrect OTP code: ${code} entered for: ${input}`
    );
    return NextResponse.json({ success: false, error: "Invalid verification code" });

  } catch (error: any) {
    serverDb.addAuditLog("OTP_VERIFY_ERROR", ip, userAgent, `OTP verify failure: ${error.message}`);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
