import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function getAuthToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (authorization) {
    const [scheme, token] = authorization.split(" ");
    if (scheme?.toLowerCase() === "bearer" && token) return token;
  }

  const cookies = request.cookies ?? { get: () => undefined };
  const cookieToken = cookies.get("auth_token")?.value;
  return cookieToken ?? null;
}

export async function getUserFromRequest(request: NextRequest) {
  const token = await getAuthToken(request);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}
