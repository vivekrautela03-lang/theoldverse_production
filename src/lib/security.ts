import { NextRequest, NextResponse } from "next/server";

/**
 * Global input sanitization helper.
 * Strips dangerous HTML tags and escapes characters to prevent XSS and SQL injection.
 */
export function sanitizeInput(input: any): any {
  if (input === null || input === undefined) return input;

  if (typeof input === "string") {
    return input
      .trim()
      // Strip script and iframe tags entirely
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "")
      // Escape HTML entities to prevent DOM XSS
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      // Escape database/comment sequence indicators
      .replace(/--/g, "&#x2D;&#x2D;")
      .replace(/\/\*/g, "&#x2F;&#x2A;");
  }

  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }

  if (typeof input === "object") {
    const sanitizedObj: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitizedObj[key] = sanitizeInput(input[key]);
      }
    }
    return sanitizedObj;
  }

  return input;
}

/**
 * Strict CSRF defense verification.
 * Compares the Request Origin/Referer with the Host header to verify site authenticity.
 */
export function verifyCsrf(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!host) return false;

  const extractDomain = (urlStr: string | null): string | null => {
    if (!urlStr) return null;
    try {
      const url = new URL(urlStr);
      return url.host;
    } catch {
      return null;
    }
  };

  const originHost = extractDomain(origin);
  const refererHost = extractDomain(referer);

  // If origin exists, it must match host
  if (originHost && originHost !== host) {
    return false;
  }

  // If referer exists, it must match host
  if (refererHost && refererHost !== host) {
    return false;
  }

  return true;
}

/**
 * Validates request payload structure and rejects empty keys.
 */
export function validatePayload(body: any, requiredKeys: string[]): { isValid: boolean; missingKey?: string } {
  if (!body || typeof body !== "object") {
    return { isValid: false };
  }

  for (const key of requiredKeys) {
    if (body[key] === undefined || body[key] === null || String(body[key]).trim() === "") {
      return { isValid: false, missingKey: key };
    }
  }

  return { isValid: true };
}
