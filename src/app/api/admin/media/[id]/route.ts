import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("media_files")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    await supabaseAdmin.from("activity_logs").insert({
      action: "MEDIA_DELETED",
      entity_type: "MediaFile",
      entity_id: id,
      details: `Media file ID ${id} deleted`
    });

    return NextResponse.json({ success: true, message: "Media item deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
