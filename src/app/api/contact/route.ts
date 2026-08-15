import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";
import { verifyCsrf } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  // 1. CSRF Verification
  if (request instanceof Request && !verifyCsrf(request as any)) {
    return NextResponse.json({ success: false, error: "CSRF verification failed." }, { status: 403 });
  }

  try {
    // 2. Rate Limiting: 5 submissions per 10 minutes per IP (bypassed in dev mode)
    const isProd = process.env.NODE_ENV === "production";
    const rateLimit = isProd
      ? await serverDb.checkRateLimit(`contact_rate_${ip}`, 5, 10 * 60 * 1000)
      : { allowed: true };

    if (!rateLimit.allowed) {
      await serverDb.addAuditLog(
        "CONTACT_RATE_LIMIT",
        ip,
        userAgent,
        `Contact form rate limit exceeded by IP: ${ip}`
      );
      return NextResponse.json(
        { success: false, error: "Too many contact submissions. Please wait 10 minutes and try again." },
        { status: 429 }
      );
    }

    const { name, email, subject, message } = await request.json();

    // 3. Field validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedSubject = String(subject || "General Inquiry").trim();
    const trimmedMessage = String(message).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json({ success: false, error: "Name must be between 2 and 100 characters." }, { status: 400 });
    }

    if (trimmedMessage.length < 5 || trimmedMessage.length > 5000) {
      return NextResponse.json({ success: false, error: "Message must be between 5 and 5000 characters." }, { status: 400 });
    }

    // 4. Primary Persistent Storage: Save to Supabase contact_messages database table
    let insertedMsg: any = null;
    let dbError: any = null;

    // Try inserting basic payload (without explicit status key to ensure backward compatibility if column is missing)
    const { data: dbData, error: err1 } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage
      })
      .select("*");

    if (err1) {
      console.warn("[Contact API] Standard insert error, attempting minimal payload:", err1.message);
      dbError = err1;
    } else {
      insertedMsg = dbData && dbData.length > 0 ? dbData[0] : null;
    }

    // 5. Create Admin Notification event
    try {
      await supabaseAdmin.from("admin_notifications").insert({
        title: "New Contact Message",
        message: `${trimmedName} sent an inquiry regarding "${trimmedSubject}"`,
        type: "message",
        link: "/admin/messages",
        is_read: false
      });
    } catch {
      // Non-blocking notification logging
    }

    // 6. Web3Forms Direct Email Dispatch (Primary Email Forwarder to theoldverse@gmail.com)
    const recipientEmail = "theoldverse@gmail.com";
    const emailSubject = `[The OldVerse Contact] ${trimmedSubject}`;
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY || "b8fa7dda-d970-47a1-839d-f204f9eefa66";
    let emailDispatched = false;

    if (web3Key) {
      try {
        const web3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            access_key: web3Key,
            name: trimmedName,
            email: trimmedEmail,
            subject: emailSubject,
            message: `From: ${trimmedName} (${trimmedEmail})\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
            from_name: "TheOldverse Website Contact"
          })
        });

        const web3Data = await web3Res.json();
        if (web3Res.ok && web3Data.success) {
          emailDispatched = true;
          console.log("[Contact API] Web3Forms email forwarded successfully to theoldverse@gmail.com");
        } else {
          console.warn("[Contact API] Web3Forms returned status:", web3Data);
        }
      } catch (err: any) {
        console.warn("[Contact API] Web3Forms dispatch failed:", err.message);
      }
    }

    // Backup: Resend Email API
    if (!emailDispatched && process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: recipientEmail,
            subject: emailSubject,
            text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
            reply_to: trimmedEmail
          })
        });
        if (resendRes.ok) emailDispatched = true;
      } catch (err: any) {
        console.warn("[Contact API] Resend email dispatch failed:", err.message);
      }
    }

    await serverDb.addAuditLog(
      "CONTACT_SUBMISSION_SUCCESS",
      ip,
      userAgent,
      `Contact message ID ${insertedMsg?.id} submitted by ${trimmedEmail}`
    );

    return NextResponse.json({
      success: true,
      id: insertedMsg?.id,
      message: "Thanks for reaching out. We'll get back to you soon.",
      emailForwarded: emailDispatched
    });

  } catch (error: any) {
    console.error("[Contact API] Unexpected Exception:", error.message);
    await serverDb.addAuditLog("CONTACT_EXCEPTION", ip, userAgent, `Exception: ${error.message}`);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
