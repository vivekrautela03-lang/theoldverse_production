import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const recipientEmail = "theoldverse@gmail.com";
    const emailSubject = `[The OldVerse Contact] ${subject || "General Inquiry"}`;
    const emailBody = `New contact form submission:
----------------------------------------
Name: ${name}
Email: ${email}
Subject: ${subject || "General Inquiry"}
----------------------------------------
Message:
${message}
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
            reply_to: email,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("[Contact API] Successfully delivered via Resend!");
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
            name: name,
            email: email,
            subject: emailSubject,
            message: message,
            from_name: "The OldVerse Portal",
          }),
        });

        const text = await response.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          // Response was not JSON (e.g. Cloudflare HTML block page)
          throw new Error(`Non-JSON response received (HTTP ${response.status}). Web3Forms may be blocked by Cloudflare protections.`);
        }

        if (response.ok && data.success) {
          console.log("[Contact API] Successfully delivered via Web3Forms!");
          return NextResponse.json({
            success: true,
            mode: "web3forms",
            message: "Your message has been sent successfully via Web3Forms!",
          });
        } else {
          const errMsg = data.message || "Failed to deliver message via Web3Forms.";
          console.warn("[Contact API] Web3Forms returned error status:", data);
          errors.push(`Web3Forms Error: ${errMsg}`);
        }
      } catch (err: any) {
        console.warn("[Contact API] Web3Forms dispatch failed:", err.message);
        errors.push(`Web3Forms Exception: ${err.message}`);
      }
    }

    // 3. Fallback: Simulated Mode (Log to console / write local debug log)
    // We only reach this if either:
    // a) No API keys are set.
    // b) API keys are set but both failed.
    console.log("\n==================================================");
    console.log("✉️  [SIMULATED EMAIL DELIVERY] - THE OLDVERSE");
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`From Name: ${name}`);
    console.log(`From Email: ${email}`);
    if (errors.length > 0) {
      console.log(`Warning - Delivery attempted but failed with:`);
      errors.forEach((err) => console.log(`  * ${err}`));
    }
    console.log("--------------------------------------------------");
    console.log(message);
    console.log("==================================================\n");

    // Write to local debug log
    try {
      const logDir = path.join(process.cwd(), ".next");
      const logFilePath = path.join(logDir, "contact_submissions_debug.log");
      const logEntry = `[${new Date().toISOString()}] Name: ${name} | Email: ${email} | Subject: ${subject} | Message: ${message}\n`;
      fs.appendFileSync(logFilePath, logEntry, "utf8");
    } catch (fsErr) {
      // Ignore write failures
    }

    // If API keys were specified but failed, return a structured response indicating the fallback
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
    console.error("[API Error] contact submission failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
