import crypto from "crypto";
import { supabaseAdmin } from "./supabaseClient";

// Hashing helper to seed the admin account (avoid circular import during init)
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha256";

function hashPasswordSimple(password: string): { salt: string; hash: string } {
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

interface UserSchema {
  id: string;
  name: string;
  emailOrPhone: string;
  passwordHash: string;
  salt: string;
  isAdmin: boolean;
  isCreator: boolean;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  failedLogins: number;
  lockedUntil?: string; // ISO string
}

interface SessionSchema {
  id: string;
  token: string;
  userId: string;
  expiresAt: string; // ISO string
  rotated: boolean;
  rotatedTo?: string;
  ip: string;
  userAgent: string;
}

interface RateLimitSchema {
  attempts: number;
  resetAt: string; // ISO string
}

interface AuditLogSchema {
  id: string;
  timestamp: string; // ISO string
  event: string;
  ip: string;
  userAgent: string;
  details: string;
}

/**
 * Enterprise-grade Server Database powered by Supabase PostgreSQL.
 */
class ServerDb {
  private seeded = false;

  private async ensureSeeded() {
    if (this.seeded) return;
    try {
      const { data, error } = await supabaseAdmin
        .from("users_db")
        .select("id")
        .limit(1);
      
      if (!error && (!data || data.length === 0)) {
        console.log("[ServerDb] Seeding default admin and pioneer users to Supabase...");
        
        const seedAdmin = hashPasswordSimple("oldverse2025");
        await supabaseAdmin.from("users_db").insert({
          id: "user-admin",
          name: "System Admin",
          email_or_phone: "theoldverse@gmail.com",
          password_hash: seedAdmin.hash,
          salt: seedAdmin.salt,
          is_admin: true,
          is_creator: true,
          two_factor_enabled: false,
          failed_logins: 0
        });

        const seedPioneer = hashPasswordSimple("PioneerPass@123");
        await supabaseAdmin.from("users_db").insert({
          id: "user-pioneer",
          name: "Visual Pioneer",
          email_or_phone: "pioneer@oldverse.com",
          password_hash: seedPioneer.hash,
          salt: seedPioneer.salt,
          is_admin: false,
          is_creator: true,
          two_factor_enabled: false,
          failed_logins: 0
        });
      }
      this.seeded = true;
    } catch (err) {
      console.error("[ServerDb] Seeding validation exception:", err);
    }
  }

  // --- Users Table ---

  public async getUsers(): Promise<UserSchema[]> {
    await this.ensureSeeded();
    const { data } = await supabaseAdmin.from("users_db").select("*");
    return (data || []).map(u => ({
      id: u.id,
      name: u.name,
      emailOrPhone: u.email_or_phone,
      passwordHash: u.password_hash,
      salt: u.salt,
      isAdmin: u.is_admin,
      isCreator: u.is_creator,
      twoFactorSecret: u.two_factor_secret || undefined,
      twoFactorEnabled: u.two_factor_enabled,
      failedLogins: u.failed_logins,
      lockedUntil: u.locked_until || undefined
    }));
  }

  public async getUser(emailOrPhone: string): Promise<UserSchema | undefined> {
    await this.ensureSeeded();
    const target = emailOrPhone.trim().toLowerCase();
    const { data } = await supabaseAdmin
      .from("users_db")
      .select("*")
      .eq("email_or_phone", target)
      .maybeSingle();
    
    if (!data) return undefined;
    return {
      id: data.id,
      name: data.name,
      emailOrPhone: data.email_or_phone,
      passwordHash: data.password_hash,
      salt: data.salt,
      isAdmin: data.is_admin,
      isCreator: data.is_creator,
      twoFactorSecret: data.two_factor_secret || undefined,
      twoFactorEnabled: data.two_factor_enabled,
      failedLogins: data.failed_logins,
      lockedUntil: data.locked_until || undefined
    };
  }

  public async getUserById(userId: string): Promise<UserSchema | undefined> {
    await this.ensureSeeded();
    const { data } = await supabaseAdmin
      .from("users_db")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!data) return undefined;
    return {
      id: data.id,
      name: data.name,
      emailOrPhone: data.email_or_phone,
      passwordHash: data.password_hash,
      salt: data.salt,
      isAdmin: data.is_admin,
      isCreator: data.is_creator,
      twoFactorSecret: data.two_factor_secret || undefined,
      twoFactorEnabled: data.two_factor_enabled,
      failedLogins: data.failed_logins,
      lockedUntil: data.locked_until || undefined
    };
  }

  public async createUser(
    name: string,
    emailOrPhone: string,
    passwordHash: string,
    salt: string,
    isAdmin = false,
    isCreator = false
  ): Promise<UserSchema> {
    await this.ensureSeeded();
    const id = `user-${crypto.randomUUID()}`;
    const emailOrPhoneLower = emailOrPhone.trim().toLowerCase();
    
    const { data, error } = await supabaseAdmin
      .from("users_db")
      .insert({
        id,
        name,
        email_or_phone: emailOrPhoneLower,
        password_hash: passwordHash,
        salt,
        is_admin: isAdmin,
        is_creator: isCreator,
        two_factor_enabled: false,
        failed_logins: 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      emailOrPhone: data.email_or_phone,
      passwordHash: data.password_hash,
      salt: data.salt,
      isAdmin: data.is_admin,
      isCreator: data.is_creator,
      twoFactorSecret: data.two_factor_secret || undefined,
      twoFactorEnabled: data.two_factor_enabled,
      failedLogins: data.failed_logins,
      lockedUntil: data.locked_until || undefined
    };
  }

  public async updateUser(userId: string, updates: Partial<UserSchema>): Promise<boolean> {
    await this.ensureSeeded();
    const mappedUpdates: any = {};
    if (updates.name !== undefined) mappedUpdates.name = updates.name;
    if (updates.emailOrPhone !== undefined) mappedUpdates.email_or_phone = updates.emailOrPhone;
    if (updates.passwordHash !== undefined) mappedUpdates.password_hash = updates.passwordHash;
    if (updates.salt !== undefined) mappedUpdates.salt = updates.salt;
    if (updates.isAdmin !== undefined) mappedUpdates.is_admin = updates.isAdmin;
    if (updates.isCreator !== undefined) mappedUpdates.is_creator = updates.isCreator;
    if (updates.twoFactorSecret !== undefined) mappedUpdates.two_factor_secret = updates.twoFactorSecret;
    if (updates.twoFactorEnabled !== undefined) mappedUpdates.two_factor_enabled = updates.twoFactorEnabled;
    if (updates.failedLogins !== undefined) mappedUpdates.failed_logins = updates.failedLogins;
    if (updates.lockedUntil !== undefined) mappedUpdates.locked_until = updates.lockedUntil;

    const { error } = await supabaseAdmin
      .from("users_db")
      .update(mappedUpdates)
      .eq("id", userId);
    
    return !error;
  }

  // --- Sessions Table ---

  public async getSession(token: string): Promise<SessionSchema | undefined> {
    await this.ensureSeeded();
    const { data } = await supabaseAdmin
      .from("sessions_db")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (!data) return undefined;
    return {
      id: data.id,
      token: data.token,
      userId: data.user_id,
      expiresAt: data.expires_at,
      rotated: data.rotated,
      rotatedTo: data.rotated_to || undefined,
      ip: data.ip,
      userAgent: data.user_agent
    };
  }

  public async createSession(
    userId: string,
    token: string,
    expiresInSeconds: number,
    ip: string,
    userAgent: string
  ): Promise<SessionSchema> {
    await this.ensureSeeded();
    
    // Clean up older expired/rotated sessions
    await supabaseAdmin
      .from("sessions_db")
      .delete()
      .eq("user_id", userId)
      .lt("expires_at", new Date().toISOString());

    const id = `session-${crypto.randomUUID()}`;
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    
    const { data, error } = await supabaseAdmin
      .from("sessions_db")
      .insert({
        id,
        token,
        user_id: userId,
        expires_at: expiresAt,
        rotated: false,
        ip,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      token: data.token,
      userId: data.user_id,
      expiresAt: data.expires_at,
      rotated: data.rotated,
      rotatedTo: data.rotated_to || undefined,
      ip: data.ip,
      userAgent: data.user_agent
    };
  }

  public async updateSession(sessionId: string, updates: Partial<SessionSchema>): Promise<boolean> {
    await this.ensureSeeded();
    const mappedUpdates: any = {};
    if (updates.rotated !== undefined) mappedUpdates.rotated = updates.rotated;
    if (updates.rotatedTo !== undefined) mappedUpdates.rotated_to = updates.rotatedTo;
    if (updates.expiresAt !== undefined) mappedUpdates.expires_at = updates.expiresAt;

    const { error } = await supabaseAdmin
      .from("sessions_db")
      .update(mappedUpdates)
      .eq("id", sessionId);
    
    return !error;
  }

  public async revokeSessionsForUser(userId: string): Promise<void> {
    await this.ensureSeeded();
    await supabaseAdmin
      .from("sessions_db")
      .delete()
      .eq("user_id", userId);
  }

  public async revokeSession(token: string): Promise<void> {
    await this.ensureSeeded();
    await supabaseAdmin
      .from("sessions_db")
      .delete()
      .eq("token", token);
  }

  // --- Rate Limiter ---

  public async checkRateLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: string }> {
    await this.ensureSeeded();
    const now = new Date();
    
    const { data } = await supabaseAdmin
      .from("rate_limits")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (!data || new Date(data.reset_at) < now) {
      const resetAt = new Date(Date.now() + windowMs).toISOString();
      await supabaseAdmin
        .from("rate_limits")
        .upsert({
          key,
          attempts: 1,
          reset_at: resetAt,
          updated_at: now.toISOString()
        });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (data.attempts >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.reset_at
      };
    }

    const attempts = data.attempts + 1;
    await supabaseAdmin
      .from("rate_limits")
      .update({
        attempts,
        updated_at: now.toISOString()
      })
      .eq("key", key);

    return {
      allowed: true,
      remaining: limit - attempts,
      resetAt: data.reset_at
    };
  }

  // --- Security Audit Logging ---

  public async addAuditLog(event: string, ip: string, userAgent: string, details: string): Promise<void> {
    await this.ensureSeeded();
    const id = `audit-${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    
    await supabaseAdmin
      .from("audit_logs")
      .insert({
        id,
        timestamp,
        event,
        ip,
        user_agent: userAgent || "unknown",
        details
      });
      
    console.log(`[SECURITY AUDIT LOG] ${timestamp} | ${event} | IP: ${ip} | ${details}`);
  }

  public async getAuditLogs(): Promise<AuditLogSchema[]> {
    await this.ensureSeeded();
    const { data } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1000);
      
    return (data || []).map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      event: l.event,
      ip: l.ip,
      userAgent: l.user_agent,
      details: l.details
    }));
  }
}

export const serverDb = new ServerDb();
export type { UserSchema, SessionSchema, AuditLogSchema };
