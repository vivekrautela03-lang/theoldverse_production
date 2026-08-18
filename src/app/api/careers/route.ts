import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: jobOpenings, error } = await supabaseAdmin
      .from("job_openings")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error || !jobOpenings || jobOpenings.length === 0) {
      // Fallback open roles
      const defaultJobs = [
        {
          id: "job-default-1",
          title: "Assistant Director / Script Supervisor",
          department: "Direction",
          location: "Dehradun / Remote",
          type: "Collaboration",
          description: "Assist lead directors in scene blocking, continuity tracking, and script breakdown for upcoming film projects.",
          requirements: ["Prior short film experience", "Script breakdown knowledge", "Dehradun / Uttarakhand presence preferred"]
        },
        {
          id: "job-default-2",
          title: "Cinematographer & Camera Operator",
          department: "Camera & Lighting",
          location: "Dehradun, India",
          type: "Contract",
          description: "Lead framing, lighting setup, and camera operation for indie short film and commercial video productions.",
          requirements: ["Camera operating portfolio", "Lighting gear experience", "Color grading proficiency"]
        }
      ];
      return NextResponse.json({ success: true, jobs: defaultJobs, source: "fallback" });
    }

    return NextResponse.json({ success: true, jobs: jobOpenings, source: "database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
