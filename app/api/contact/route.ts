import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/ratelimit";
import { recordAuditLog } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;
    const rateLimitKey = `contact:${ip}`;
    const rate = checkRateLimit({ key: rateLimitKey, limit: 3, windowMs: 60_000 });
    if (!rate.success) {
      return NextResponse.json({ error: "Trop de requêtes. Veuillez réessayer dans un instant." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    if (parsed.data.honey) {
      await recordAuditLog(request, "contact_spam", "Contact", undefined, { reason: "honeypot" }, undefined);
      return NextResponse.json({ message: "Message envoyé" }, { status: 200 });
    }

    const sanitized = {
      name: String(parsed.data.name).trim(),
      email: String(parsed.data.email).trim().toLowerCase(),
      subject: String(parsed.data.subject).trim(),
      message: String(parsed.data.message).trim(),
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    };

    await prisma.auditLog.create({
      data: {
        action: "contact_submit",
        entity: "Contact",
        metadata: JSON.stringify(sanitized),
        ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
    });

    await recordAuditLog(request, "contact_submit", "Contact", undefined, { email: sanitized.email, subject: sanitized.subject }, undefined);

    return NextResponse.json({ message: "Nous avons bien reçu votre message. Nous vous répondrons dans les plus brefs délais." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
