import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentCreateSchema } from "@/lib/validation";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { checkRateLimit } from "@/lib/ratelimit";

function hashIp(ip?: string | null) {
  if (!ip) return null;
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return String(hash);
}

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "MODERATOR"].includes(currentUser.role)) return forbidden();

  const targetType = request.nextUrl.searchParams.get("targetType");
  const targetId = request.nextUrl.searchParams.get("targetId");
  const status = request.nextUrl.searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (targetType && targetId) {
    where.targetType = targetType;
    where.targetId = targetId;
  }
  if (status) {
    where.isPublished = status === "PUBLISHED";
  }

  const comments = await prisma.comment.findMany({
    where,
    include: { author: { select: { id: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const rateLimitKey = `comments:${ip}`;
    const rate = checkRateLimit({ key: rateLimitKey, limit: 10, windowMs: 60_000 });
    if (!rate.success) {
      return NextResponse.json({ error: "Trop de commentaires. Veuillez réessayer dans un instant." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = commentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const author = await getUserFromRequest(request);
    const spamScore = author ? 0 : 10;

    const comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
        parentCommentId: parsed.data.parentCommentId,
        authorId: author?.id ?? null,
        spamScore,
        ipHash: hashIp(ip),
        userAgent: request.headers.get("user-agent") ?? undefined,
        optInResponse: parsed.data.rating !== undefined ? true : false,
      },
      include: { author: { select: { id: true, email: true } } },
    });

    await recordAuditLog(request, "create_comment", "Comment", comment.id, { targetType: comment.targetType, targetId: comment.targetId }, author?.id);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
