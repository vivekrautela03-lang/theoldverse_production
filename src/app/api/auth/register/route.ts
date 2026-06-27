import { NextResponse } from "next/server";
import { serverDb } from "@/lib/serverDb";
import { hashPassword } from "@/lib/authCrypto";

// HTML Sanitizer to prevent XSS / Injection
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
    // 1. Rate Limiting: 5 registrations per hour per IP
    const rateLimit = serverDb.checkRateLimit(`register_rate_${ip}`, 5, 3600 * 1000);
    if (!rateLimit.allowed) {
      serverDb.addAuditLog(
        "REGISTER_BLOCKED",
        ip,
        userAgent,
        `Registration rate limit exceeded for IP: ${ip}. Locked until ${rateLimit.resetAt}`
      );
      return NextResponse.json(
        { success: false, error: "Too many registrations. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const nameInput = body.name?.trim();
    const emailOrPhoneInput = body.emailOrPhone?.trim();
    const passwordInput = body.password;

    if (!nameInput || !emailOrPhoneInput || !passwordInput) {
      return NextResponse.json(
        { success: false, error: "Name, email/phone, and password are required fields." },
        { status: 400 }
      );
    }

    // Validate inputs
    const escapedName = escapeHtml(nameInput);
    if (escapedName.length < 2 || escapedName.length > 50) {
      return NextResponse.json(
        { success: false, error: "Name must be between 2 and 50 characters." },
        { status: 400 }
      );
    }

    const isEmail = emailOrPhoneInput.includes("@");
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrPhoneInput)) {
        return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });
      }
    } else {
      const phoneRegex = /^\d{10}$/;
      const cleanPhone = emailOrPhoneInput.replace(/\D/g, "");
      if (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone)) {
        return NextResponse.json({ success: false, error: "Invalid 10-digit mobile number." }, { status: 400 });
      }
    }

    if (passwordInput.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = serverDb.getUser(emailOrPhoneInput);
    if (existingUser) {
      serverDb.addAuditLog(
        "REGISTER_ATTEMPT_DUPLICATE",
        ip,
        userAgent,
        `Attempted duplicate registration for email/phone: ${emailOrPhoneInput}`
      );
      // Return a generic error to prevent user enumeration
      return NextResponse.json(
        { success: false, error: "An account with this email or mobile number already exists." },
        { status: 400 }
      );
    }

    // Hash password and store user
    const { salt, hash } = hashPassword(passwordInput);
    // Flag creators if name or email specifies it
    const isCreator = emailOrPhoneInput.toLowerCase().includes("creator") || emailOrPhoneInput.includes("pioneer");
    const newUser = serverDb.createUser(
      escapedName,
      emailOrPhoneInput,
      hash,
      salt,
      false, // isAdmin
      isCreator
    );

    serverDb.addAuditLog(
      "REGISTER_SUCCESS",
      ip,
      userAgent,
      `User registered successfully: ID: ${newUser.id}, Identifier: ${emailOrPhoneInput}`
    );

    return NextResponse.json({
      success: true,
      message: "Account registered successfully! You can now log in.",
    });

  } catch (error: any) {
    serverDb.addAuditLog(
      "REGISTER_ERROR",
      ip,
      userAgent,
      `Registration process error: ${error.message}`
    );
    // Secure error: never expose internal error stack traces
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
