import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, recordAuditLog, unauthorized } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorTempSecret: null,
    },
  });

  await recordAuditLog(request, "2fa_disabled", "User", currentUser.id, { email: currentUser.email }, currentUser.id);
  return NextResponse.json({ success: true });
}
