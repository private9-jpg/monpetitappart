import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  process.env.NEXTAUTH_URL || "http://localhost:3000",
  process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

export function validateCsrf(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const check = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = `${parsed.protocol}//${parsed.host}`;
      return ALLOWED_ORIGINS.includes(host);
    } catch {
      return false;
    }
  };
  return ALLOWED_ORIGINS.includes(origin ?? "") || check(referer ?? "");
}

export function csrfError() {
  return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
}
