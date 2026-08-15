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

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const requester = await getRequesterProfile();
    if (!requester || !["owner", "admin"].includes(requester.role)) {
      return NextResponse.json({ success: false, error: "Forbidden: You do not have permission to modify user profiles." }, { status: 403 });
    }

    const { id } = await context.params;
    const { role, full_name, status } = await request.json();

    // Fetch target user's current profile
    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (!targetProfile) {
      return NextResponse.json({ success: false, error: "Target user profile not found" }, { status: 444 });
    }

    // Protection Rule 1: Only OWNER can modify or demote an existing OWNER profile
    if (targetProfile.role === "owner" && requester.role !== "owner") {
      return NextResponse.json({ success: false, error: "Forbidden: Only an existing Owner can modify or demote an Owner account." }, { status: 403 });
    }

    // Protection Rule 2: Only OWNER can promote any account to OWNER
    if (role === "owner" && targetProfile.role !== "owner" && requester.role !== "owner") {
      return NextResponse.json({ success: false, error: "Forbidden: Only an Owner can promote users to the Owner role." }, { status: 403 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("profiles")
      .update({
        ...(role && { role }),
        ...(full_name && { full_name }),
        ...(status && { status }),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "ADMIN_USER_UPDATED",
      entity_type: "AdminUser",
      entity_id: id,
      details: `User "${targetProfile.email}" updated: role=${role || targetProfile.role}, status=${status || targetProfile.status} by ${requester.email}`
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const requester = await getRequesterProfile();
    if (!requester || !["owner", "admin"].includes(requester.role)) {
      return NextResponse.json({ success: false, error: "Forbidden: You do not have permission to delete admin users." }, { status: 403 });
    }

    const { id } = await context.params;

    const { data: targetProfile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (targetProfile) {
      if (targetProfile.role === "owner" && requester.role !== "owner") {
        return NextResponse.json({ success: false, error: "Forbidden: Only an Owner can delete an Owner account." }, { status: 403 });
      }
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", id);

    await supabaseAdmin.from("activity_logs").insert({
      action: "ADMIN_USER_DELETED",
      entity_type: "AdminUser",
      entity_id: id,
      details: `User ID ${id} deleted by ${requester.email}`
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
