/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { serverDb } from "@/lib/serverDb";

// Escaping function to mitigate XSS in email contents
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  try {
    // 1. Rate Limiting: 5 contact requests per 10 minutes per IP
    const rateLimit = serverDb.checkRateLimit(`contact_rate_${ip}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      serverDb.addAuditLog(
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

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Input Validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = (subject || "General Inquiry").trim();
    const trimmedMessage = message.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json({ success: false, error: "Name must be between 2 and 100 characters." }, { status: 400 });
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      return NextResponse.json({ success: false, error: "Message must be between 10 and 5000 characters." }, { status: 400 });
    }

    // Escape HTML inputs to prevent injection and XSS
    const escapedName = escapeHtml(trimmedName);
    const escapedEmail = escapeHtml(trimmedEmail);
    const escapedSubject = escapeHtml(trimmedSubject);
    const escapedMessage = escapeHtml(trimmedMessage);

    const recipientEmail = "theoldverse@gmail.com";
    const emailSubject = `[The OldVerse Contact] ${escapedSubject}`;
    const emailBody = `New contact form submission:
----------------------------------------
Name: ${escapedName}
Email: ${escapedEmail}
Subject: ${escapedSubject}
----------------------------------------
Message:
${escapedMessage}
----------------------------------------
Sent via The OldVerse Contact Portal.`;

    const errors: string[] = [];

    // 1. Try Resend first (highly stable for backend environments)
    if (process.env.RESEND_API_KEY) {
      console.log("[Contact API] Attempting delivery via Resend...");
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev", // standard sandbox sender, or verified domain
            to: recipientEmail,
            subject: emailSubject,
            text: emailBody,
            reply_to: escapedEmail,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          serverDb.addAuditLog("CONTACT_SENT_RESEND", ip, userAgent, `Contact form sent via Resend for: ${escapedEmail}`);
          return NextResponse.json({
            success: true,
            mode: "resend",
            message: "Your message has been sent successfully via Resend!",
          });
        } else {
          const errMsg = data.message || "Failed to deliver message via Resend.";
          console.warn("[Contact API] Resend returned error status:", data);
          errors.push(`Resend Error: ${errMsg}`);
        }
      } catch (err: any) {
        console.warn("[Contact API] Resend dispatch failed:", err.message);
        errors.push(`Resend Dispatch Exception: ${err.message}`);
      }
    }

    // 2. Try Web3Forms (if Resend wasn't configured or failed)
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      console.log("[Contact API] Attempting delivery via Web3Forms...");
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_ACCESS_KEY,
            name: escapedName,
            email: escapedEmail,
            subject: emailSubject,
            message: escapedMessage,
            from_name: "The OldVerse Portal",
          }),
        });

        const text = await response.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          throw new Error("Non-JSON response received.");
        }

        if (response.ok && data.success) {
          serverDb.addAuditLog("CONTACT_SENT_WEB3FORMS", ip, userAgent, `Contact form sent via Web3Forms for: ${escapedEmail}`);
          return NextResponse.json({
            success: true,
            mode: "web3forms",
            message: "Your message has been sent successfully via Web3Forms!",
          });
        } else {
          const errMsg = data.message || "Failed to deliver message via Web3Forms.";
          console.warn("[Contact API] Web3Forms returned error status:", data);
          errors.push(`HTML Error: ${errMsg}`);
        }
      } catch (err: any) {
        console.warn("[Contact API] Web3Forms dispatch failed:", err.message);
        errors.push(`Web3Forms Exception: ${err.message}`);
      }
    }

    // 3. Fallback: Simulated Mode (Log to console / write local debug log)
    console.log("\n==================================================");
    console.log("✉️  [SIMULATED EMAIL DELIVERY] - THE OLDVERSE");
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`From Name: ${escapedName}`);
    console.log(`From Email: ${escapedEmail}`);
    if (errors.length > 0) {
      console.log(`Warning - Delivery attempted but failed with:`);
      errors.forEach((err) => console.log(`  * ${err}`));
    }
    console.log("--------------------------------------------------");
    console.log(escapedMessage);
    console.log("==================================================\n");

    // Write to local debug log safely
    try {
      const logDir = path.join(process.cwd(), ".next");
      const logFilePath = path.join(logDir, "contact_submissions_debug.log");
      const logEntry = `[${new Date().toISOString()}] Name: ${escapedName} | Email: ${escapedEmail} | Subject: ${escapedSubject} | Message: ${escapedMessage}\n`;
      fs.appendFileSync(logFilePath, logEntry, "utf8");
    } catch (fsErr) {
      // Ignore write failures
    }

    serverDb.addAuditLog("CONTACT_SENT_SIMULATED", ip, userAgent, `Contact form logged locally for: ${escapedEmail}`);

    if (process.env.RESEND_API_KEY || process.env.WEB3FORMS_ACCESS_KEY) {
      return NextResponse.json({
        success: true,
        mode: "simulated",
        message: `API delivery failed (attempted via ${process.env.RESEND_API_KEY ? 'Resend' : ''}${process.env.RESEND_API_KEY && process.env.WEB3FORMS_ACCESS_KEY ? ' & ' : ''}${process.env.WEB3FORMS_ACCESS_KEY ? 'Web3Forms' : ''}). Fell back to simulated local delivery.`,
        warnings: errors,
      });
    }

    return NextResponse.json({
      success: true,
      mode: "simulated",
      message: `Simulated transmission to ${recipientEmail} successful! Check terminal console logs for details.`,
    });

  } catch (error: any) {
    serverDb.addAuditLog("CONTACT_ERROR", ip, userAgent, `Contact form exception: ${error.message}`);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
