import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";
import { signJwt } from "@/lib/jwt";
import { verifyPassword } from "@/lib/authCrypto";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  try {
    const cookies = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookies.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    
    const accessToken = getCookie("session_at");
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Access Denied: Log in first." }, { status: 401 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Access Denied: Session invalid." }, { status: 401 });
    }

    const body = await request.json();
    const { email, password } = body;
    const targetEmail = (email || "").trim().toLowerCase();

    // Verify role in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";
    if (user.email !== targetEmail || (role !== "admin" && user.email !== "theoldverse@gmail.com")) {
      await serverDb.addAuditLog("ADMIN_STEPUP_FAIL_ROLE", ip, userAgent, `Step-up blocked: User ${user.email} lacks administrative role.`);
      return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });
    }

    const adminUser = await serverDb.getUser(targetEmail);
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });
    }

    const isPasswordValid = verifyPassword(password, adminUser.salt, adminUser.passwordHash);
    if (!isPasswordValid) {
      await serverDb.addAuditLog(
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

    await serverDb.addAuditLog(
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
