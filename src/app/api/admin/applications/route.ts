import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    let query = supabaseAdmin
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`applicant_name.ilike.%${search}%,applicant_email.ilike.%${search}%,position.ilike.%${search}%`);
    }

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: applications, error } = await query;

    if (error) {
      return NextResponse.json({ success: true, applications: [] });
    }

    return NextResponse.json({ success: true, applications: applications || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
