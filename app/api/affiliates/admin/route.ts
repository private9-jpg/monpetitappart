import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, recordAuditLog, unauthorized } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

const affiliateLinkCreateSchema = z.object({
  productId: z.string().uuid(),
  source: z.string().max(100),
  url: z.string().url(),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const links = await prisma.affiliateLink.findMany({
    orderBy: { clickCount: "desc" },
    include: { product: { select: { id: true, name: true, slug: true } } },
  });

  return NextResponse.json(links);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const body = await request.json();
  const sanitized = sanitizeObject(body as Record<string, unknown>, 2000);
  const parsed = affiliateLinkCreateSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { productId, source, url, isActive = true } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const affiliateLink = await prisma.affiliateLink.create({
    data: {
      productId,
      source,
      url,
      isActive,
    },
  });

  await recordAuditLog(request, "create_affiliate_link", "AffiliateLink", affiliateLink.id, { createdBy: currentUser.id, productId }, currentUser.id);
  return NextResponse.json(affiliateLink, { status: 201 });
}
