import crypto from "crypto";

// PBKDF2 configuration
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha256";

/**
 * Hash password securely using PBKDF2-SHA256
 */
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  ).toString("hex");
  return { salt, hash };
}

/**
 * Verify a password against a stored salt and hash
 */
export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const verifyHash = crypto.pbkdf2Sync(
      password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEYLEN,
      PBKDF2_DIGEST
    ).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(verifyHash, "hex"));
  } catch {
    return false;
  }
}

// Base32 Alphabet for TOTP secret encoding/decoding (RFC 4648)
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encodes a buffer to a Base32 string
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

/**
 * Decodes a Base32 string to a Buffer
 */
export function base32Decode(str: string): Buffer {
  const cleanStr = str.replace(/=+$/, "").toUpperCase();
  const result: number[] = [];
  let bits = 0;
  let value = 0;
  for (let i = 0; i < cleanStr.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleanStr[i]);
    if (idx === -1) {
      throw new Error("Invalid base32 character");
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      result.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(result);
}

/**
 * Generates a random Base32 TOTP secret
 */
export function generateTotpSecret(email: string): { secret: string; otpauthUrl: string } {
  const bytes = crypto.randomBytes(10); // 80 bits key
  const secret = base32Encode(bytes);
  const issuer = "TheOldVerse";
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  return { secret, otpauthUrl };
}

/**
 * Verifies a 6-digit TOTP code against a Base32 secret key.
 * Allows a +/- 1 time-step drift window (30 seconds each).
 */
export function verifyTotp(secretBase32: string, token: string): boolean {
  try {
    const key = base32Decode(secretBase32);
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const counter = Math.floor(epoch / timeStep);

    const checkCodeForCounter = (c: number) => {
      const buffer = Buffer.alloc(8);
      // Write the 64-bit integer counter in big endian
      // UInt32 division to split high and low 32-bit words
      const high = Math.floor(c / 0x100000000);
      const low = c & 0xffffffff;
      buffer.writeUInt32BE(high, 0);
      buffer.writeUInt32BE(low, 4);

      const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
      const offset = hmac[hmac.length - 1] & 0xf;
      const code =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);

      const otp = (code % 1000000).toString().padStart(6, "0");
      return otp === token;
    };

    // Check t, t-1, t+1
    return checkCodeForCounter(counter) || checkCodeForCounter(counter - 1) || checkCodeForCounter(counter + 1);
  } catch {
    return false;
  }
}
