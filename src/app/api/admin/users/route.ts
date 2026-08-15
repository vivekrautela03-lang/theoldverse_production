import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

async function getRequesterProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_at")?.value;
  if (!token) return null;

  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return profile || null;
}

export async function GET() {
  try {
    const requester = await getRequesterProfile();
    if (!requester || !["owner", "admin"].includes(requester.role)) {
      return NextResponse.json({ success: false, error: "Forbidden: Only Owner or Admin can access user management." }, { status: 403 });
    }

    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: true, users: [] });
    }

    return NextResponse.json({ success: true, users: profiles || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const requester = await getRequesterProfile();
    if (!requester || !["owner", "admin"].includes(requester.role)) {
      return NextResponse.json({ success: false, error: "Forbidden: You do not have permission to create admin users." }, { status: 403 });
    }

    const { email, password, full_name, role } = await request.json();
    const targetRole = role || "editor";

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Only OWNER can assign the OWNER role
    if (targetRole === "owner" && requester.role !== "owner") {
      return NextResponse.json({ success: false, error: "Forbidden: Only the Owner can create or assign Owner accounts." }, { status: 403 });
    }

    // Create user in Supabase Auth via Service Role
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || email.split("@")[0],
        role: targetRole
      }
    });

    if (authError || !authData.user) {
      return NextResponse.json({ success: false, error: authError?.message || "Failed to create user" }, { status: 400 });
    }

    // Upsert profile role in profiles table
    await supabaseAdmin
      .from("profiles")
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: full_name || email.split("@")[0],
        role: targetRole,
        status: "active"
      });

    await supabaseAdmin.from("activity_logs").insert({
      action: "ADMIN_USER_CREATED",
      entity_type: "AdminUser",
      entity_id: authData.user.id,
      details: `User "${email}" created with role "${targetRole}" by ${requester.email}`
    });

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
