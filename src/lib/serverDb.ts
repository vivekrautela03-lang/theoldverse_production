import fs from "fs";
import path from "path";
import crypto from "crypto";

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

const DB_DIR = path.join(process.cwd(), ".next");
const DB_FILE = path.join(DB_DIR, "server-db.json");

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
  rotatedTo?: string; // session ID it was rotated to
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

interface DbSchema {
  users: UserSchema[];
  sessions: SessionSchema[];
  rateLimits: Record<string, RateLimitSchema>;
  auditLogs: AuditLogSchema[];
}

/**
 * Initializes and reads/writes the server-side file database.
 */
class ServerDb {
  private db: DbSchema = {
    users: [],
    sessions: [],
    rateLimits: {},
    auditLogs: [],
  };

  constructor() {
    this.init();
  }

  private initializeDefaultDb() {
    this.db = {
      users: [],
      sessions: [],
      rateLimits: {},
      auditLogs: [],
    };
    // Seed default Admin Account
    const seedAdmin = hashPasswordSimple("oldverse2025");
    this.db.users.push({
      id: "user-admin",
      name: "System Admin",
      emailOrPhone: "theoldverse@gmail.com",
      passwordHash: seedAdmin.hash,
      salt: seedAdmin.salt,
      isAdmin: true,
      isCreator: true,
      twoFactorEnabled: false,
      failedLogins: 0,
    });

    // Seed default Creator Account (Visual Pioneer)
    const seedPioneer = hashPasswordSimple("PioneerPass@123");
    this.db.users.push({
      id: "user-pioneer",
      name: "Visual Pioneer",
      emailOrPhone: "pioneer@oldverse.com",
      passwordHash: seedPioneer.hash,
      salt: seedPioneer.salt,
      isAdmin: false,
      isCreator: true,
      twoFactorEnabled: false,
      failedLogins: 0,
    });

    this.save();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf8").trim();
        if (fileContent) {
          try {
            this.db = JSON.parse(fileContent);
            // Ensure all required fields exist
            if (!this.db.users) this.db.users = [];
            if (!this.db.sessions) this.db.sessions = [];
            if (!this.db.rateLimits) this.db.rateLimits = {};
            if (!this.db.auditLogs) this.db.auditLogs = [];
          } catch {
            console.warn("[ServerDb] JSON parsing failed, resetting database to defaults...");
            this.initializeDefaultDb();
          }
        } else {
          this.initializeDefaultDb();
        }
      } else {
        this.initializeDefaultDb();
      }
    } catch (err) {
      console.error("[ServerDb Error] Initialization failed:", err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), "utf8");
    } catch (err) {
      console.error("[ServerDb Error] Save failed:", err);
    }
  }

  // --- Users Table ---

  public getUsers(): UserSchema[] {
    this.init(); // reload to get fresh changes across serverless files
    return this.db.users;
  }

  public getUser(emailOrPhone: string): UserSchema | undefined {
    this.init();
    const target = emailOrPhone.trim().toLowerCase();
    return this.db.users.find((u) => u.emailOrPhone.toLowerCase() === target);
  }

  public getUserById(userId: string): UserSchema | undefined {
    this.init();
    return this.db.users.find((u) => u.id === userId);
  }

  public createUser(
    name: string,
    emailOrPhone: string,
    passwordHash: string,
    salt: string,
    isAdmin = false,
    isCreator = false
  ): UserSchema {
    this.init();
    const newUser: UserSchema = {
      id: `user-${crypto.randomUUID()}`,
      name,
      emailOrPhone: emailOrPhone.trim().toLowerCase(),
      passwordHash,
      salt,
      isAdmin,
      isCreator,
      twoFactorEnabled: false,
      failedLogins: 0,
    };
    this.db.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(userId: string, updates: Partial<UserSchema>): boolean {
    this.init();
    const index = this.db.users.findIndex((u) => u.id === userId);
    if (index === -1) return false;
    this.db.users[index] = { ...this.db.users[index], ...updates };
    this.save();
    return true;
  }

  // --- Sessions Table ---

  public getSession(token: string): SessionSchema | undefined {
    this.init();
    return this.db.sessions.find((s) => s.token === token);
  }

  public createSession(
    userId: string,
    token: string,
    expiresInSeconds: number,
    ip: string,
    userAgent: string
  ): SessionSchema {
    this.init();
    
    // Revoke any previous unrotated sessions for user to avoid token accumulation
    this.db.sessions = this.db.sessions.filter(
      (s) => !(s.userId === userId && !s.rotated && new Date(s.expiresAt) < new Date())
    );

    const newSession: SessionSchema = {
      id: `session-${crypto.randomUUID()}`,
      token,
      userId,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
      rotated: false,
      ip,
      userAgent,
    };
    this.db.sessions.push(newSession);
    this.save();
    return newSession;
  }

  public updateSession(sessionId: string, updates: Partial<SessionSchema>): boolean {
    this.init();
    const index = this.db.sessions.findIndex((s) => s.id === sessionId);
    if (index === -1) return false;
    this.db.sessions[index] = { ...this.db.sessions[index], ...updates };
    this.save();
    return true;
  }

  public revokeSessionsForUser(userId: string) {
    this.init();
    this.db.sessions = this.db.sessions.filter((s) => s.userId !== userId);
    this.save();
  }

  public revokeSession(token: string) {
    this.init();
    this.db.sessions = this.db.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // --- Rate Limiter (API rate limits) ---

  /**
   * sliding window rate limiting
   */
  public checkRateLimit(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetAt: string } {
    this.init();
    const now = new Date();
    const currentLimit = this.db.rateLimits[key];

    if (!currentLimit || new Date(currentLimit.resetAt) < now) {
      // Create new limit window
      const resetAt = new Date(Date.now() + windowMs).toISOString();
      this.db.rateLimits[key] = {
        attempts: 1,
        resetAt,
      };
      this.save();
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (currentLimit.attempts >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: currentLimit.resetAt,
      };
    }

    currentLimit.attempts += 1;
    this.db.rateLimits[key] = currentLimit;
    this.save();
    return {
      allowed: true,
      remaining: limit - currentLimit.attempts,
      resetAt: currentLimit.resetAt,
    };
  }

  // --- Security Audit Logging ---

  public addAuditLog(event: string, ip: string, userAgent: string, details: string) {
    this.init();
    const logEntry: AuditLogSchema = {
      id: `audit-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      event,
      ip,
      userAgent: userAgent || "unknown",
      details,
    };
    this.db.auditLogs.unshift(logEntry);
    
    // Cap audit logs at 1000 records to prevent file bloat
    if (this.db.auditLogs.length > 1000) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 1000);
    }
    
    this.save();
    console.log(`[SECURITY AUDIT LOG] ${logEntry.timestamp} | ${event} | IP: ${ip} | ${details}`);
  }

  public getAuditLogs(): AuditLogSchema[] {
    this.init();
    return this.db.auditLogs;
  }
}

export const serverDb = new ServerDb();
export type { UserSchema, SessionSchema, AuditLogSchema };
