import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { recordAuditLog } from "@/lib/auth";
import { verify } from "otplib";

export async function POST(request: NextRequest) {
  const { email, password, twoFactorCode } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe sont requis" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (!user.isActive) {
    await recordAuditLog(request, "login_failed", "User", user.id, { reason: "inactive" }, user.id);
    return NextResponse.json({ error: "Compte désactivé" }, { status: 403 });
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    await recordAuditLog(request, "login_failed", "User", user.id, { reason: "invalid_password" }, user.id);
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  if (user.twoFactorEnabled) {
    if (!twoFactorCode) {
      return NextResponse.json({ error: "Code 2FA requis", twoFactorRequired: true }, { status: 401 });
    }

    const secret = user.twoFactorSecret || "";
    const result = await verify({ secret, token: twoFactorCode });
    if (!result.valid) {
      await recordAuditLog(request, "login_failed", "User", user.id, { reason: "invalid_2fa" }, user.id);
      return NextResponse.json({ error: "Code 2FA invalide" }, { status: 401 });
    }
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  await recordAuditLog(request, "login", "User", user.id, { twoFactorEnabled: user.twoFactorEnabled }, user.id);

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
    },
  });
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  return response;
}
