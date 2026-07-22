import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type UserRole = "ADMIN" | "EDITOR" | "WRITER" | "MODERATOR" | "ANALYST";

export const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: [
    "manage_all",
    "manage_content",
    "publish",
    "manage_products",
    "moderate_comments",
    "view_affiliation",
    "view_statistics",
  ],
  EDITOR: [
    "manage_content",
    "publish",
    "manage_products",
    "moderate_comments",
    "view_affiliation",
  ],
  WRITER: ["create_content", "edit_own_content", "create_product_draft"],
  MODERATOR: ["view_content", "view_products", "moderate_comments"],
  ANALYST: ["view_content", "view_products", "view_comments", "view_affiliation"],
};

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

  const user = session.user;
  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

export async function requireUser(request: NextRequest, roles: UserRole[] = []) {
  const user = await getUserFromRequest(request);
  if (!user) return null;
  if (roles.length > 0 && !roles.includes(user.role as UserRole)) return null;
  return user;
}

export async function recordAuditLog(
  request: NextRequest,
  action: string,
  entity: string,
  entityId?: string,
  metadata?: unknown,
  userId?: string | null,
) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null;
  const userAgent = request.headers.get("user-agent") || null;

  await prisma.auditLog.create({
    data: {
      userId: userId ?? null,
      action,
      entity,
      entityId,
      metadata: typeof metadata === "string" ? metadata : metadata ? JSON.stringify(metadata) : undefined,
      ip: ip ?? undefined,
      userAgent: userAgent ?? undefined,
    },
  });
}
