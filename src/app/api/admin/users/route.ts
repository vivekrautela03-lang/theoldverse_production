import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
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
    const { email, password, full_name, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Create user in Supabase Auth via Service Role
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || email.split("@")[0],
        role: role || "editor"
      }
    });

    if (authError || !authData.user) {
      return NextResponse.json({ success: false, error: authError?.message || "Failed to create user" }, { status: 400 });
    }

    // Update profile role
    await supabaseAdmin
      .from("profiles")
      .update({
        role: role || "editor",
        full_name: full_name || email.split("@")[0]
      })
      .eq("id", authData.user.id);

    await supabaseAdmin.from("activity_logs").insert({
      action: "ADMIN_USER_CREATED",
      entity_type: "AdminUser",
      entity_id: authData.user.id,
      details: `Admin user "${email}" created with role "${role || "editor"}"`
    });

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
