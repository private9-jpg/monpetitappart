import { NextRequest, NextResponse } from "next/server";
import { generateSecret, generateURI } from "otplib";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, recordAuditLog, unauthorized } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const secret = generateSecret();
  const serviceName = process.env.NEXT_PUBLIC_APP_NAME || "MonPetitAppart";
  const otpauthUrl = generateURI({ issuer: serviceName, label: currentUser.email, secret });

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { twoFactorTempSecret: secret },
  });

  await recordAuditLog(request, "2fa_setup_requested", "User", currentUser.id, { email: currentUser.email }, currentUser.id);

  return NextResponse.json({ otpauthUrl, secret });
}
