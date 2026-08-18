import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const {
      job_id,
      position,
      applicant_name,
      applicant_email,
      applicant_phone,
      portfolio_url,
      resume_url,
      instagram_url,
      cover_letter
    } = await request.json();

    if (!position || !applicant_name || !applicant_email || !cover_letter) {
      return NextResponse.json(
        { success: false, error: "Position, name, email, and cover letter are required." },
        { status: 400 }
      );
    }

    const { data: insertedApp, error } = await supabaseAdmin
      .from("applications")
      .insert({
        job_id: job_id || null,
        position: String(position).trim(),
        applicant_name: String(applicant_name).trim(),
        applicant_email: String(applicant_email).trim(),
        applicant_phone: applicant_phone ? String(applicant_phone).trim() : null,
        portfolio_url: portfolio_url ? String(portfolio_url).trim() : null,
        resume_url: resume_url ? String(resume_url).trim() : null,
        instagram_url: instagram_url ? String(instagram_url).trim() : null,
        cover_letter: String(cover_letter).trim(),
        status: "new"
      })
      .select("*")
      .single();

    if (error) {
      console.error("[Applications API] Supabase Insert Error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Create Admin Notification event
    try {
      await supabaseAdmin.from("admin_notifications").insert({
        title: "New Application Received",
        message: `${applicant_name} applied for "${position}"`,
        type: "application",
        link: "/admin/applications",
        is_read: false
      });
    } catch {
      // Non-blocking notification
    }

    return NextResponse.json({
      success: true,
      id: insertedApp?.id,
      message: "Your application has been received successfully! Our team will review your portfolio."
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
