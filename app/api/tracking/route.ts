import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { type, source, metadata } = payload;

  if (!type) {
    return NextResponse.json({ error: "Type de tracking requis" }, { status: 400 });
  }

  const event = await prisma.affiliateClick.create({
    data: {
      affiliateLinkId: metadata?.affiliateLinkId ?? "",
      source: source ?? "api",
      ip: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
