import { NextResponse } from "next/server";
import twilio from "twilio";

// Store OTPs in a global map to persist across serverless function reloads in development
const otpStore = (global as any).otpStore || new Map<string, string>();
(global as any).otpStore = otpStore;

export async function POST(request: Request) {
  try {
    const { emailOrPhone } = await request.json();
    const input = emailOrPhone?.trim();

    if (!input) {
      return NextResponse.json({ success: false, error: "Input is required" }, { status: 400 });
    }

    const isEmail = input.includes("@") || /[a-zA-Z]/.test(input);
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Store the generated OTP code keyed by the identifier (email or phone)
    otpStore.set(input, code);

    if (isEmail) {
      // Email OTP: Simulate email delivery
      return NextResponse.json({
        success: true,
        mode: "simulated",
        code,
        message: `✉️ Email Server: Verification code sent to ${input}`
      });
    }

    // Phone OTP: Try to send real SMS if Twilio is configured
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

        console.log(`[Twilio SMS] Real OTP sent successfully to ${formattedPhone}`);
        return NextResponse.json({
          success: true,
          mode: "real",
          message: `💬 SMS Gateway: Verification code sent to your phone number +91 ${digitsOnly.slice(-4)}!`
        });

      } catch (twilioError: any) {
        console.error("[Twilio Error] Failed to send SMS:", twilioError.message);
        // Fallback to simulated delivery on API failure
        return NextResponse.json({
          success: true,
          mode: "simulated",
          code,
          error: twilioError.message,
          message: `💬 SMS Gateway (Fallback): Twilio failed. Code: ${code}`
        });
      }
    }

    // Default to simulated mode if Twilio credentials are not set
    return NextResponse.json({
      success: true,
      mode: "simulated",
      code,
      message: `💬 SMS Gateway (Simulated): Twilio credentials not set in .env. Code: ${code}`
    });

  } catch (error: any) {
    console.error("[API Error] send-otp failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
