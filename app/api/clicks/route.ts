import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackingClickSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/ratelimit";
import { recordAuditLog } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const rateLimitKey = `clicks:${ip}`;
    const rate = checkRateLimit({ key: rateLimitKey, limit: 30, windowMs: 60_000 });
    if (!rate.success) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
    }

    const body = await request.json();
    const sanitized = sanitizeObject(body as Record<string, unknown>, 200);
    const parsed = trackingClickSchema.safeParse(sanitized);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const link = await prisma.affiliateLink.findUnique({
      where: { id: parsed.data.affiliateLinkId },
    });
    if (!link || !link.isActive) {
      return NextResponse.json({ error: "Lien affilié introuvable ou inactif" }, { status: 404 });
    }

    const click = await prisma.affiliateClick.create({
      data: {
        affiliateLinkId: link.id,
        ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
        source: parsed.data.source,
        metadata: parsed.data.metadata,
      },
    });

    await prisma.affiliateLink.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    });

    await recordAuditLog(request, "tracking_click", "AffiliateClick", click.id, { affiliateLinkId: link.id, source: parsed.data.source }, undefined);

    return NextResponse.json({ id: click.id, url: link.url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
