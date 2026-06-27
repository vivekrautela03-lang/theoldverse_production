import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Protected Route Categories
  const isPrivateKey = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/watch");

  // 2. Authentication Verification
  const accessToken = request.cookies.get("session_at")?.value;
  let payload: { sub: string; email: string; isAdmin: boolean; isCreator: boolean; name: string; fp?: string } | null = null;

  if (accessToken) {
    const verified = verifyJwt(accessToken) as { sub: string; email: string; isAdmin: boolean; isCreator: boolean; name: string; fp?: string } | null;
    const userAgent = request.headers.get("user-agent") || "";
    const currentFingerprint = getClientFingerprint(userAgent);

    if (verified) {
      // Validate fingerprint if present in token
      if (!verified.fp || verified.fp === currentFingerprint) {
        payload = verified;
      }
    }
  }

  // Gating Logic
  const isAdminConsole = pathname.startsWith("/admin-console") || pathname.startsWith("/api/admin");

  if (isAdminConsole) {
    if (!payload || !payload.isAdmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Access Denied: Admin authorization required." }, { status: 403 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }

    // Step-up (sudo mode) validation for all admin operations (except step-up endpoints themselves)
    const isStepUpApi = pathname.startsWith("/api/admin/stepup");
    if (!isStepUpApi) {
      const adminSession = request.cookies.get("admin_session")?.value;
      let sudoPayload: any = null;
      if (adminSession) {
        sudoPayload = verifyJwt(adminSession);
      }
      if (!sudoPayload || !sudoPayload.sudo) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ success: false, error: "Step-up authentication required.", stepUpRequired: true }, { status: 401 });
        }
      }
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

  // 3. Security Headers Configuration
  const response = NextResponse.next();

  // Content Security Policy (CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://images.unsplash.com https://*.unsplash.com https://commondatastorage.googleapis.com;
    media-src 'self' https://commondatastorage.googleapis.com https://instagram.com https://*.instagram.com https://*.cdninstagram.com;
    connect-src 'self' https://api.resend.com https://api.web3forms.com;
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
     * - api (API routes, except gated authentication pages if needed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png|.*\\..*).*)",
  ],
};
