import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";
import { verifyPassword } from "@/lib/authCrypto";
import crypto from "crypto";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  try {
    const body = await request.json();
    const { email, password } = body;
    const targetEmail = (email || "").trim().toLowerCase();

    if (targetEmail !== "theoldverse@gmail.com") {
      serverDb.addAuditLog("ADMIN_STEPUP_FAIL_EMAIL", ip, userAgent, `Step-up blocked: Invalid admin email supplied: ${targetEmail}`);
      return NextResponse.json({ success: false, error: "Access Denied: Invalid credentials." }, { status: 403 });
    }

    const adminUser = serverDb.getUser(targetEmail);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });
    }

    const isPasswordValid = verifyPassword(password, adminUser.salt, adminUser.passwordHash);
    if (!isPasswordValid) {
      serverDb.addAuditLog("ADMIN_STEPUP_FAIL_PWD", ip, userAgent, `Step-up blocked: Incorrect password for administrator: ${targetEmail}`);
      return NextResponse.json({ success: false, error: "Access Denied: Invalid credentials." }, { status: 403 });
    }

    // Generate numeric 6-digit OTP code
    const digits = "0123456789";
    let otpCode = "";
    for (let i = 0; i < 6; i++) {
      otpCode += digits[crypto.randomInt(0, 10)];
    }

    // Store in global memory otpStore
    const globalContext = global as typeof globalThis & { otpStore?: Map<string, string> };
    if (!globalContext.otpStore) {
      globalContext.otpStore = new Map<string, string>();
    }
    globalContext.otpStore.set(`admin_stepup_${targetEmail}`, otpCode);

    serverDb.addAuditLog(
      "ADMIN_STEPUP_OTP_SENT",
      ip,
      userAgent,
      `Step-up verification OTP sent for: ${targetEmail}`
    );

    // Try sending email via Resend if API key is configured
    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: targetEmail,
            subject: "The OldVerse - Admin Sudo Mode Security OTP",
            html: `
              <div style="background-color: #0A0A0B; color: #FFFFFF; font-family: sans-serif; padding: 30px; border-radius: 12px; border: 1px solid #1C1C1E; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #F5A623; font-size: 20px; border-bottom: 1px solid #1C1C1E; padding-bottom: 10px;">🛡️ Administrative Step-Up Auth</h2>
                <p style="font-size: 14px; color: #A0A0A5; line-height: 1.6;">You requested access to the sensitive administrative control panel on The OldVerse.</p>
                <div style="background-color: #121214; padding: 20px; border-radius: 8px; border: 1px solid #1C1C1E; text-align: center; margin: 25px 0;">
                  <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #FFFFFF;">${otpCode}</span>
                </div>
                <p style="font-size: 11px; color: #636366; line-height: 1.4;">This code is valid for 10 minutes and single-use only. If you did not request this code, audit your server console immediately.</p>
              </div>
            `,
          }),
        });

        if (response.ok) {
          emailSent = true;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Resend admin OTP send failed:", errorMsg);
      }
    }

    const isProduction = process.env.NODE_ENV === "production";
    return NextResponse.json({
      success: true,
      emailSent,
      // Only share in response if not in production and Resend fails
      simulatedCode: !isProduction ? otpCode : undefined
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: `Step-up send error: ${errorMsg}` }, { status: 500 });
  }
}
