import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
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
      // Clear the OTP code after successful verification to prevent reuse
      otpStore.delete(input);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid verification code" });

  } catch (error: any) {
    console.error("[API Error] verify-otp failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
