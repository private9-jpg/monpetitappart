import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentCreateSchema } from "@/lib/validation";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { checkRateLimit } from "@/lib/ratelimit";
import { parseAndSanitize } from "@/lib/parse";
import { isRedisAvailable, checkRedisRateLimit } from "@/lib/redis";
import { notifyCommentPublished } from "@/lib/services/notification.service";

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
    const redisAvailable = await isRedisAvailable();
    const rateLimit = redisAvailable
      ? await checkRedisRateLimit(`comments:${ip}`, 10, 60_000)
      : checkRateLimit({ key: `comments:${ip}`, limit: 10, windowMs: 60_000 });

    if (!rateLimit.success) {
      return NextResponse.json({ error: "Trop de commentaires. Veuillez réessayer dans un instant." }, { status: 429 });
    }

    const parseResult = await parseAndSanitize(request, commentCreateSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }
    const parsed = parseResult.data;

    if (parsed.honeypot && parsed.honeypot.trim() !== "") {
      await recordAuditLog(request, "comment_spam_honeypot", "Comment", undefined, { ip }, undefined);
      return NextResponse.json({ message: "Commentaire enregistré" }, { status: 200 });
    }

    const turnstileToken = parsed.turnstileToken;
    if (turnstileToken) {
      const turnstileValid = await verifyTurnstile(turnstileToken, ip);
      if (!turnstileValid) {
        return NextResponse.json({ error: "Vérification anti-bot échouée" }, { status: 400 });
      }
    }

    const author = await getUserFromRequest(request);
    let spamScore = author ? 0 : 10;

    if (parsed.honeypot && parsed.honeypot.trim() !== "") {
      spamScore = 100;
    }

    const comment = await prisma.comment.create({
      data: {
        content: parsed.content,
        targetType: parsed.targetType,
        targetId: parsed.targetId,
        parentCommentId: parsed.parentCommentId,
        authorId: author?.id ?? null,
        spamScore,
        ipHash: hashIp(ip),
        userAgent: request.headers.get("user-agent") ?? undefined,
        optInResponse: parsed.rating !== undefined ? true : false,
        isPublished: spamScore < 50,
      },
      include: { author: { select: { id: true, email: true } } },
    });

    await recordAuditLog(request, "create_comment", "Comment", comment.id, { targetType: comment.targetType, targetId: comment.targetId, spamScore }, author?.id);

    if (comment.isPublished) {
      await notifyCommentPublished(comment.id, comment.targetType, comment.targetId);
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  try {
    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
}
