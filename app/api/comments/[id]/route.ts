import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentModerationSchema, commentReportSchema } from "@/lib/validation";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { checkRateLimit } from "@/lib/ratelimit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "MODERATOR"].includes(currentUser.role)) return forbidden();

  const { id } = await params;
  const body = await request.json();
  const parsed = commentModerationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
  }

  const data: Record<string, unknown> = {
    isPublished: parsed.data.status === "PUBLISHED",
  };

  if (parsed.data.status === "REJECTED" && parsed.data.rejectionReason) {
    data.rejectionReason = parsed.data.rejectionReason;
  }

  const updated = await prisma.comment.update({
    where: { id },
    data,
    include: { author: { select: { id: true, email: true, role: true } } },
  });

  await recordAuditLog(request, "moderate_comment", "Comment", comment.id, { status: parsed.data.status }, currentUser.id);
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const { id } = await params;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
  }

  await prisma.comment.delete({ where: { id } });
  await recordAuditLog(request, "delete_comment", "Comment", comment.id, { content: comment.content.slice(0, 50) }, currentUser.id);
  return NextResponse.json({ message: "Commentaire supprimé" }, { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const { id } = await params;
  const body = await request.json();
  const parsed = commentReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
  }

  const existing = await prisma.report.findFirst({
    where: {
      targetType: "PRODUCT",
      targetId: id,
      reporterId: currentUser.id,
      status: { not: "DISMISSED" },
    },
  });
  if (existing) {
    return NextResponse.json({ message: "Signalement déjà enregistré" }, { status: 200 });
  }

  await prisma.report.create({
    data: {
      targetType: "PRODUCT",
      targetId: id,
      reporterId: currentUser.id,
      reason: parsed.data.reason,
      metadata: parsed.data.metadata,
    },
  });

  await prisma.comment.update({
    where: { id },
    data: { spamScore: { increment: 5 } },
  });

  await recordAuditLog(request, "report_comment", "Comment", comment.id, { reason: parsed.data.reason }, currentUser.id);
  return NextResponse.json({ message: "Signalement enregistré" }, { status: 201 });
}
