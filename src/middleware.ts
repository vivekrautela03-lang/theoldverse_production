import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a build-safe, edge-compatible Supabase client for token verification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  // Gating Logic
  const isAdminConsole = pathname.startsWith("/admin-console") || pathname.startsWith("/api/admin");

  if (isAdminConsole) {
    // Standard role validation for Admin Console
    const hasAdminRights = payload && (payload.isAdmin || payload.email === "theoldverse@gmail.com");
    if (!hasAdminRights) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access to administrator APIs." },
          { status: 403 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isPrivateKey) {
    if (!payload) {
      // User is unauthenticated - redirect to /auth
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Security Headers Configuration with updated CSP rules
  const response = NextResponse.next();

  // Content Security Policy (CSP) allowing Supabase domains
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://images.unsplash.com https://*.unsplash.com https://commondatastorage.googleapis.com https://res.cloudinary.com https://*.supabase.co;
    media-src 'self' https://commondatastorage.googleapis.com https://instagram.com https://*.instagram.com https://*.cdninstagram.com https://res.cloudinary.com;
    connect-src 'self' https://*.supabase.co https://api.resend.com https://api.web3forms.com;
    font-src 'self' https://fonts.gstatic.com;
    frame-src 'self' https://challenges.cloudflare.com;
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
