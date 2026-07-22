import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromRequest, UserRole } from "@/lib/auth";
import { checkRateLimit } from "@/lib/ratelimit";
import { validateCsrf } from "@/lib/csrf";

const protectedRoutes: Record<string, UserRole[]> = {
  "/dashboard": ["ADMIN", "EDITOR", "WRITER", "MODERATOR", "ANALYST"],
  "/products": ["ADMIN", "EDITOR", "WRITER", "MODERATOR", "ANALYST"],
  "/(admin)": ["ADMIN", "EDITOR", "WRITER", "MODERATOR", "ANALYST"],
};

const publicApiPrefixes = ["/api/auth/login", "/api/auth/register", "/api/auth/2fa"];

const csrfExemptPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/2fa",
  "/api/newsletter",
  "/api/contact",
  "/api/comments",
];

function isAllowedByRole(pathname: string, role: UserRole): boolean {
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(role);
    }
  }
  return true;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const isApiAuth = pathname.startsWith("/api/auth") || pathname.startsWith("/api/affiliates") || pathname.startsWith("/api/products") || pathname.startsWith("/api/comments") || pathname.startsWith("/api/clicks") || pathname.startsWith("/api/tracking") || pathname.startsWith("/api/newsletter") || pathname.startsWith("/api/contact");

  if (isApiAuth) {
    const ip = getClientIp(request);
    const key = `auth:${ip}`;
    const limit = checkRateLimit({ key, limit: 30, windowMs: 60_000 });
    if (!limit.success) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans 1 minute." }, { status: 429 });
    }

    if (["POST", "PATCH", "PUT", "DELETE"].includes(method) && !csrfExemptPaths.some((p) => pathname.startsWith(p))) {
      if (!validateCsrf(request)) {
        return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
      }
    }
  }

  const isProtected = Object.keys(protectedRoutes).some((route) => pathname.startsWith(route));
  if (!isProtected) {
    const response = NextResponse.next();
    response.headers.set("x-content-type-options", "nosniff");
    response.headers.set("x-frame-options", "DENY");
    response.headers.set("x-xss-protection", "1; mode=block");
    response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    response.headers.set("content-security-policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:3001 ws://localhost:3001; frame-ancestors 'none';");
    return response;
  }

  const user = await getUserFromRequest(request);
  if (!user || !user.isActive) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user.twoFactorEnabled) {
    const twoFactorVerified = request.cookies.get("2fa_verified")?.value === "true";
    if (!twoFactorVerified && pathname !== "/auth/2fa") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/2fa";
      return NextResponse.redirect(url);
    }
  }

  if (!isAllowedByRole(pathname, user.role as UserRole)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const response = NextResponse.next();
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("x-xss-protection", "1; mode=block");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("content-security-policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:3001 ws://localhost:3001; frame-ancestors 'none';");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/(admin)/(.*)",
    "/api/auth/:path*",
    "/api/affiliates/:path*",
    "/api/products/:path*",
    "/api/comments/:path*",
    "/api/clicks/:path*",
    "/api/tracking/:path*",
    "/api/newsletter/:path*",
    "/api/contact/:path*",
  ],
};
