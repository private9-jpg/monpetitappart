import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/ratelimit";
import { recordAuditLog, getUserFromRequest, unauthorized, forbidden } from "@/lib/auth";
import { subscribeToNewsletter } from "@/lib/services/newsletter.service";
import { isRedisAvailable, checkRedisRateLimit } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const redisAvailable = await isRedisAvailable();
    const rateLimit = redisAvailable
      ? await checkRedisRateLimit(`newsletter:${ip}`, 5, 60_000)
      : checkRateLimit({ key: `newsletter:${ip}`, limit: 5, windowMs: 60_000 });

    if (!rateLimit.success) {
      return NextResponse.json({ error: "Trop de requêtes. Veuillez réessayer dans un instant." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email } = parsed.data;
    const result = await subscribeToNewsletter(email, ip);

    await recordAuditLog(request, "newsletter_" + result.status, "NewsletterSubscriber", email, { email, status: result.status }, undefined);

    return NextResponse.json({ message: result.message, status: result.status }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const isSubscribed = request.nextUrl.searchParams.get("isSubscribed");
  const limit = request.nextUrl.searchParams.get("limit");

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: isSubscribed !== null ? { isSubscribed: isSubscribed === "true" } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit ? parseInt(limit) : 100,
  });

  await recordAuditLog(request, "list_newsletters", "NewsletterSubscriber", undefined, { count: subscribers.length }, currentUser.id);
  return NextResponse.json(subscribers);
}
