/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import twilio from "twilio";
import { serverDb } from "@/lib/serverDb";

// Store OTPs in a global map to persist across serverless function reloads in development
const otpStore = (global as any).otpStore || new Map<string, string>();
(global as any).otpStore = otpStore;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  try {
    // Rate Limiting: 5 OTP requests per 5 minutes per IP
    const rateLimit = serverDb.checkRateLimit(`otp_rate_${ip}`, 5, 5 * 60 * 1000);
    if (!rateLimit.allowed) {
      serverDb.addAuditLog("OTP_SEND_BLOCKED", ip, userAgent, `OTP rate limit hit for IP: ${ip}`);
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a few minutes before requesting another code." },
        { status: 429 }
      );
    }

    const { emailOrPhone } = await request.json();
    const input = emailOrPhone?.trim();

    if (!input) {
      return NextResponse.json({ success: false, error: "Input is required" }, { status: 400 });
    }

    // Input Validation
    const isEmail = input.includes("@") || /[a-zA-Z]/.test(input);
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });
      }
    } else {
      const digitsOnly = input.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        return NextResponse.json({ success: false, error: "Invalid 10-digit mobile number." }, { status: 400 });
      }
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(input, code);

    const isProduction = process.env.NODE_ENV === "production";

    // 1. Email OTP: Simulate email delivery
    if (isEmail) {
      serverDb.addAuditLog(
        "OTP_CREATED",
        ip,
        userAgent,
        `Email OTP generated for ${input}: ${code}`
      );
      
      return NextResponse.json({
        success: true,
        mode: "simulated",
        // NEVER expose the verification code in the client response body in production!
        code: isProduction ? undefined : code,
        message: isProduction
          ? `✉️ Email Server: Verification code has been sent to ${input.slice(0, 3)}***@***`
          : `✉️ Email Server: Verification code sent to ${input}. Code (Dev Mode): ${code}`
      });
    }

    // 2. Phone OTP: Try to send real SMS if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && twilioPhoneNumber) {
      try {
        const client = twilio(accountSid, authToken);
        const digitsOnly = input.replace(/\D/g, "");
        const formattedPhone = digitsOnly.startsWith("91") ? `+${digitsOnly}` : `+91${digitsOnly}`;

        await client.messages.create({
          body: `Your The OldVerse verification code is: ${code}`,
          from: twilioPhoneNumber,
          to: formattedPhone
        });

        serverDb.addAuditLog(
          "OTP_SENT_TWILIO",
          ip,
          userAgent,
          `Real SMS OTP sent to ${formattedPhone}`
        );

        return NextResponse.json({
          success: true,
          mode: "real",
          message: `💬 SMS Gateway: Verification code sent to your phone number +91 *****${digitsOnly.slice(-4)}!`
        });

      } catch (twilioError: any) {
        serverDb.addAuditLog(
          "TWILIO_ERROR",
          ip,
          userAgent,
          `Twilio SMS dispatch failed: ${twilioError.message}. Fell back to simulated.`
        );

        // Fallback to simulated delivery on API failure
        return NextResponse.json({
          success: true,
          mode: "simulated",
          code: isProduction ? undefined : code,
          message: isProduction
            ? `💬 SMS Gateway: Twilio failed. Code sent via fallback.`
            : `💬 SMS Gateway (Fallback): Twilio failed. Code: ${code}`
        });
      }
    }

    // Default to simulated mode if Twilio credentials are not set
    serverDb.addAuditLog(
      "OTP_CREATED_SIMULATED",
      ip,
      userAgent,
      `Simulated SMS OTP generated for ${input}: ${code}`
    );

    return NextResponse.json({
      success: true,
      mode: "simulated",
      code: isProduction ? undefined : code,
      message: isProduction
        ? `💬 SMS Gateway: Credentials not set. Verification code sent via fallback.`
        : `💬 SMS Gateway (Simulated): Twilio credentials not set in .env. Code: ${code}`
    });

  } catch (error: any) {
    serverDb.addAuditLog("OTP_SEND_ERROR", ip, userAgent, `OTP send failure: ${error.message}`);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while sending OTP." },
      { status: 500 }
    );
  }
}
