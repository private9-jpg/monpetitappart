import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, unauthorized } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: { affiliateLinks: true },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const { name, slug, affiliateUrl, currency = "EUR", isPublished = false } = body;

  if (!name || !slug || !affiliateUrl) {
    return NextResponse.json({ error: "name, slug and affiliateUrl are required" }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { slug } });
  if (existingProduct) {
    return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      affiliateUrl,
      currency,
      isPublished,
      productUrl: body.productUrl,
      description: body.description,
      priceCents: body.priceCents,
      merchant: body.merchant,
      imageUrl: body.imageUrl,
      publishedAt: isPublished ? new Date() : body.publishedAt,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
