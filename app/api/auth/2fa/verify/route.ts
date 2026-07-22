import { NextRequest, NextResponse } from "next/server";
import { verify } from "otplib";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, recordAuditLog, unauthorized } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const { twoFactorCode } = await request.json();
  if (!twoFactorCode) {
    return NextResponse.json({ error: "Code 2FA requis" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
  if (!user || !user.twoFactorTempSecret) {
    return NextResponse.json({ error: "Aucun secret 2FA en cours" }, { status: 400 });
  }

  const result = await verify({ secret: user.twoFactorTempSecret, token: twoFactorCode });
  if (!result.valid) {
    await recordAuditLog(request, "2fa_verify_failed", "User", currentUser.id, { email: currentUser.email }, currentUser.id);
    return NextResponse.json({ error: "Code 2FA invalide" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: user.twoFactorTempSecret,
      twoFactorTempSecret: null,
    },
  });

  await recordAuditLog(request, "2fa_enabled", "User", currentUser.id, { email: currentUser.email }, currentUser.id);
  return NextResponse.json({ success: true });
}
