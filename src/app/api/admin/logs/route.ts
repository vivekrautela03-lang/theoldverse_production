import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";

export async function GET() {
  try {
    const logs = serverDb.getAuditLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Failed to load logs: ${errorMsg}` },
      { status: 500 }
    );
  }
}
