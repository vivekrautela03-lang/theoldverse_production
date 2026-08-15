import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { role, full_name, status } = await request.json();

    const { data: updated, error } = await supabaseAdmin
      .from("profiles")
      .update({
        role,
        full_name,
        status
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "ADMIN_USER_ROLE_UPDATED",
      entity_type: "AdminUser",
      entity_id: id,
      details: `User ID ${id} role updated to "${role}"`
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

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
      details: `User ID ${id} removed`
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
