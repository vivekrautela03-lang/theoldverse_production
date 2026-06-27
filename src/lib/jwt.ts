/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";

// JWT Secret Key - falls back to a default value if not defined in .env
const JWT_SECRET = process.env.SUPABASE_SECRET_KEY || "sb_secret_fallback_key_for_oldverse_tokens";

/**
 * Sign a payload and return a Base64url encoded HS256 JWT
 */
export function signJwt(payload: any, expiresInSeconds: number): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const data = { ...payload, exp };

  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64UrlPayload = Buffer.from(JSON.stringify(data)).toString("base64url");
  
  const signatureInput = `${base64UrlHeader}.${base64UrlPayload}`;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest("base64url");

  return `${signatureInput}.${signature}`;
}

/**
 * Verify HS256 JWT token signature and expiry.
 * Returns decoded payload if valid, otherwise null.
 */
export function verifyJwt(token: string): any | null {
  if (!token) return null;
  
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    const signatureInput = `${header}.${payload}`;
    
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(signatureInput)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    // Verify expiration time
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }

    return decodedPayload;
  } catch {
    return null;
  }
}
