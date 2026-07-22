import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/ratelimit";
import { recordAuditLog } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const rateLimitKey = `newsletter:${ip}`;
    const rate = checkRateLimit({ key: rateLimitKey, limit: 5, windowMs: 60_000 });
    if (!rate.success) {
      return NextResponse.json({ error: "Trop de requêtes. Veuillez réessayer dans un instant." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email } = parsed.data;

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isSubscribed) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isSubscribed: true, subscribedAt: new Date(), unsubscribedAt: null },
        });
        return NextResponse.json({ message: "Réinscription confirmée" }, { status: 200 });
      }
      return NextResponse.json({ message: "Vous êtes déjà inscrit" }, { status: 200 });
    }

    await prisma.newsletterSubscriber.create({
      data: { email, isSubscribed: true },
    });

    await recordAuditLog(request, "newsletter_subscribe", "NewsletterSubscriber", email, { email }, undefined);

    return NextResponse.json({ message: "Inscription réussie. Un email de confirmation vous a été envoyé." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
