import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, unauthorized } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const updated = await prisma.product.updateMany({
    where: { slug },
    data: {
      name: body.name,
      description: body.description,
      affiliateUrl: body.affiliateUrl,
      productUrl: body.productUrl,
      imageUrl: body.imageUrl,
      merchant: body.merchant,
      priceCents: body.priceCents,
      currency: body.currency,
      isPublished: body.isPublished,
      publishedAt: body.isPublished ? new Date() : body.publishedAt,
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const product = await prisma.product.findUnique({ where: { slug } });
  return NextResponse.json(product);
}
