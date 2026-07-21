import { NextResponse } from "next/server";
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

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authUser) {
      return NextResponse.json({ success: false, error: "Token invalid or expired" }, { status: 401 });
    }

    const user = await serverDb.getUserById(authUser.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
    }

    // Generate TOTP Secret
    const { secret, otpauthUrl } = generateTotpSecret(user.emailOrPhone);

    // Save temporary secret (do not enable 2FA yet until verified)
    await serverDb.updateUser(user.id, {
      twoFactorSecret: secret // Store in secret field temporarily
    });

    await serverDb.addAuditLog(
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
