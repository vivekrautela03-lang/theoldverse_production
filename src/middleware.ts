import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a build-safe, edge-compatible Supabase client for token verification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || supabaseAnonKey;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function getClientFingerprint(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  let os = "unknown_os";
  if (ua.includes("windows")) os = "win";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "mac";
  else if (ua.includes("linux")) os = "linux";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "ios";
  else if (ua.includes("android")) os = "android";
  
  let browser = "unknown_browser";
  if (ua.includes("firefox")) browser = "firefox";
  else if (ua.includes("chrome")) browser = "chrome";
  else if (ua.includes("safari")) browser = "safari";
  else if (ua.includes("edge")) browser = "edge";
  
  return `${os}_${browser}`;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Protected Route Categories
  const isPrivateKey = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/watch");

  // 2. Authentication Verification using Supabase getUser
  const accessToken = request.cookies.get("session_at")?.value;
  let payload: { sub: string; email: string; isAdmin: boolean; isCreator: boolean; name: string } | null = null;

  if (accessToken) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (user && !error) {
        payload = {
          sub: user.id,
          email: user.email || "",
          isAdmin: user.user_metadata?.role === "admin" || user.email === "theoldverse@gmail.com",
          isCreator: user.user_metadata?.role === "creator" || user.user_metadata?.role === "admin" || user.email === "theoldverse@gmail.com" || user.email === "pioneer@oldverse.com",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Viewer"
        };
      }
    } catch (e) {
      console.error("[Middleware] Supabase token validation error:", e);
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || (request as any).ip || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";
  const { search } = request.nextUrl;

  // CORS check for API routes
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    if (origin) {
      const allowedOrigins = [
        "https://www.theoldverse-productions.in",
        "https://theoldverse-productions.in",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
      ];
      if (!allowedOrigins.includes(origin)) {
        return new NextResponse(
          JSON.stringify({ error: "Access Denied: CORS Policy Violation." }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // 1. IP Blacklist check
  try {
    const { data: blocked } = await supabaseAdmin
      .from("ip_blocks")
      .select("blocked_until")
      .eq("ip", ip)
      .gt("blocked_until", new Date().toISOString())
      .maybeSingle();

    if (blocked) {
      return new NextResponse(
        JSON.stringify({ error: "Access Denied: IP Blacklisted due to security violation." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("[Middleware] IP Block check failed:", err);
  }

  // 2. Exploit Detection (WAF Filters)
  const decodedPath = decodeURIComponent(pathname).toLowerCase();
  const decodedQuery = decodeURIComponent(search).toLowerCase();
  const decodedUA = userAgent.toLowerCase();

  const isSqlInjection = (str: string) => {
    return (
      /union\s+all\s+select/i.test(str) ||
      /union\s+select/i.test(str) ||
      /select\s+.*\s+from/i.test(str) ||
      /drop\s+table/i.test(str) ||
      /insert\s+into/i.test(str) ||
      /update\s+.*\s+set/i.test(str) ||
      /or\s+\d+=\d+/i.test(str) ||
      /admin'--/i.test(str) ||
      /'\s*or\s*'/i.test(str)
    );
  };

  const isXss = (str: string) => {
    return (
      /<script/i.test(str) ||
      /javascript:/i.test(str) ||
      /onload=/i.test(str) ||
      /onerror=/i.test(str) ||
      /alert\(/i.test(str) ||
      /eval\(/i.test(str) ||
      /document\.cookie/i.test(str)
    );
  };

  const isPathTraversal = (str: string) => {
    return (
      /\.\.\//.test(str) ||
      /\.\.\\/.test(str) ||
      /\/etc\/passwd/i.test(str) ||
      /win\.ini/i.test(str) ||
      /boot\.ini/i.test(str)
    );
  };

  // 3. Honeypot check
  const honeypots = [
    "/wp-admin",
    "/wp-login.php",
    "/xmlrpc.php",
    "/.env",
    "/.git",
    "/admin/config",
    "/admin/settings",
    "/api/admin/config",
    "/api/admin/settings"
  ];
  const isHoneypot = honeypots.some(h => decodedPath.startsWith(h));

  let detectedAttack = "";
  let riskScore = 0;

  if (isHoneypot) {
    detectedAttack = "HONEYPOT_ACCESS";
    riskScore = 100;
  } else if (isSqlInjection(decodedPath) || isSqlInjection(decodedQuery)) {
    detectedAttack = "SQL_INJECTION";
    riskScore = 80;
  } else if (isXss(decodedPath) || isXss(decodedQuery)) {
    detectedAttack = "XSS_ATTEMPT";
    riskScore = 80;
  } else if (isPathTraversal(decodedPath) || isPathTraversal(decodedQuery)) {
    detectedAttack = "PATH_TRAVERSAL";
    riskScore = 90;
  }

  if (detectedAttack) {
    const blockDurationMs = detectedAttack === "HONEYPOT_ACCESS" 
      ? 365 * 24 * 60 * 60 * 1000 // 1 year
      : 24 * 60 * 60 * 1000;      // 24 hours

    const blockedUntil = new Date(Date.now() + blockDurationMs).toISOString();

    try {
      // Log attack log asynchronously
      await supabaseAdmin.from("security_logs").insert({
        ip,
        user_id: payload?.sub || null,
        user_agent: userAgent,
        endpoint: pathname,
        method: request.method,
        attack_type: detectedAttack,
        risk_score: riskScore,
        action_taken: "IP_BLOCKED",
        details: `Attack payload detected in Path: ${pathname} | Query: ${search}`
      });

      // Block IP
      await supabaseAdmin.from("ip_blocks").insert({
        ip,
        blocked_until: blockedUntil,
        reason: `Auto-blocked by Active Defense system for ${detectedAttack}`
      });
    } catch (err) {
      console.error("[Middleware] Failed to log active defense event:", err);
    }

    return new NextResponse(
      JSON.stringify({ error: "Access Denied: Security Violation detected." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Gating Logic
  const isAdminPath = pathname.startsWith("/admin-console") || pathname.startsWith("/api/admin");
  const isCreatorPath = pathname.startsWith("/dashboard") || pathname.startsWith("/upload");

  // Fetch dbRole only if visiting restricted paths
  let dbRole = "user";
  if (payload && (isAdminPath || isCreatorPath)) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", payload.sub)
        .single();
      dbRole = profile?.role || "user";
    } catch (e) {
      console.error("[Middleware] DB Role check failed:", e);
    }
  }

  // 1. Admin Paths gating
  if (isAdminPath) {
    const isSystemAdmin = payload?.email === "theoldverse@gmail.com" || dbRole === "admin";
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (!isSystemAdmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  // 2. Creator Paths gating
  if (isCreatorPath) {
    const isCreatorOrAdmin = payload?.email === "theoldverse@gmail.com" || payload?.email === "pioneer@oldverse.com" || dbRole === "creator" || dbRole === "admin";
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (!isCreatorOrAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";
      return NextResponse.redirect(url);
    }
  }

  // 3. General Protected Paths gating (watchlist, continue watching, watch page, profile page)
  if (isPrivateKey) {
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Security Headers Configuration with updated CSP rules
  const response = NextResponse.next();

  // Content Security Policy (CSP) allowing Supabase, Turnstile, Vimeo, YouTube, and Google Analytics domains
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://images.unsplash.com https://*.unsplash.com https://commondatastorage.googleapis.com https://res.cloudinary.com https://*.supabase.co https://www.google-analytics.com https://img.youtube.com https://i.ytimg.com;
    media-src 'self' https://commondatastorage.googleapis.com https://instagram.com https://*.instagram.com https://*.cdninstagram.com https://res.cloudinary.com;
    connect-src 'self' https://*.supabase.co https://api.resend.com https://api.web3forms.com https://*.google-analytics.com https://challenges.cloudflare.com;
    font-src 'self' https://fonts.gstatic.com;
    frame-src 'self' https://challenges.cloudflare.com https://www.youtube.com https://youtube.com https://player.vimeo.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // 4. Cache-Control for Protected / Sensitive Pages (Prevent browser caching)
  if (isPrivateKey) {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

// Config to specify matching paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Authentication API endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png|.*\\..*).*)",
  ],
};
