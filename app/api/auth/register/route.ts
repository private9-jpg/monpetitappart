import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const body = await request.json();
  const { email, password, role = "WRITER" } = body;
  const allowedRoles = ["ADMIN", "EDITOR", "WRITER", "MODERATOR", "ANALYST"];

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe sont requis" }, { status: 400 });
  }

  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true, isActive: true, createdAt: true },
  });

  await recordAuditLog(request, "create_user", "User", user.id, { role }, currentUser.id);

  return NextResponse.json(user, { status: 201 });
}
