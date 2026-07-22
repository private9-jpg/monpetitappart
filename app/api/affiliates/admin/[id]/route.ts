import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, recordAuditLog, unauthorized } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const link = await prisma.affiliateLink.update({
    where: { id },
    data: {
      source: body.source,
      url: body.url,
      isActive: body.isActive,
    },
  });

  await recordAuditLog(request, "update_affiliate_link", "AffiliateLink", id, { updatedBy: currentUser.id }, currentUser.id);
  return NextResponse.json(link);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  await prisma.affiliateLink.delete({ where: { id } });
  await recordAuditLog(request, "delete_affiliate_link", "AffiliateLink", id, { deletedBy: currentUser.id }, currentUser.id);
  return NextResponse.json({ success: true });
}
