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

    // 1. Check for Web3Forms API Integration
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      console.log("[Contact API] Found Web3Forms access key. Forwarding submission...");
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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

        const data = await response.json();
        if (response.ok && data.success) {
          return NextResponse.json({
            success: true,
            mode: "web3forms",
            message: "Your message has been sent successfully via Web3Forms!",
          });
        } else {
          console.error("[Contact API] Web3Forms returned error status:", data);
          return NextResponse.json(
            { success: false, error: data.message || "Failed to deliver message via Web3Forms." },
            { status: 502 }
          );
        }
      } catch (err: any) {
        console.error("[Contact API] Web3Forms dispatch failed:", err.message);
        return NextResponse.json(
          { success: false, error: `Web3Forms dispatch error: ${err.message}` },
          { status: 500 }
        );
      }
    }

    // 2. Check for Resend API Integration
    if (process.env.RESEND_API_KEY) {
      console.log("[Contact API] Found Resend API key. Sending email...");
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "The OldVerse Contact <onboarding@resend.dev>", // Or verified domain
            to: recipientEmail,
            subject: emailSubject,
            text: emailBody,
            reply_to: email,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          return NextResponse.json({
            success: true,
            mode: "resend",
            message: "Your message has been sent successfully via Resend!",
          });
        } else {
          console.error("[Contact API] Resend returned error status:", data);
          return NextResponse.json(
            { success: false, error: data.message || "Failed to deliver message via Resend." },
            { status: 502 }
          );
        }
      } catch (err: any) {
        console.error("[Contact API] Resend dispatch failed:", err.message);
        return NextResponse.json(
          { success: false, error: `Resend dispatch error: ${err.message}` },
          { status: 500 }
        );
      }
    }

    // 3. Fallback: Simulated Mode (Log to console / write local debug log)
    console.log("\n==================================================");
    console.log("✉️  [SIMULATED EMAIL DELIVERY] - THE OLDVERSE");
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`From Name: ${name}`);
    console.log(`From Email: ${email}`);
    console.log("--------------------------------------------------");
    console.log(message);
    console.log("==================================================\n");

    // Write to a local scratch log in development environment if possible
    try {
      const logDir = path.join(process.cwd(), ".next");
      const logFilePath = path.join(logDir, "contact_submissions_debug.log");
      const logEntry = `[${new Date().toISOString()}] Name: ${name} | Email: ${email} | Subject: ${subject} | Message: ${message}\n`;
      fs.appendFileSync(logFilePath, logEntry, "utf8");
    } catch (fsErr) {
      // Ignore write failures in read-only environments
    }

    return NextResponse.json({
      success: true,
      mode: "simulated",
      message: `Simulated transmission to ${recipientEmail} successful! Check terminal console logs for full contents.`,
    });
  } catch (error: any) {
    console.error("[API Error] contact submission failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
