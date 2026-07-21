import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, unauthorized } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const links = await prisma.affiliateLink.findMany({
    orderBy: { clickCount: "desc" },
    include: { product: { select: { id: true, name: true, slug: true } } },
  });

  return NextResponse.json(links);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const { productId, source, url, isActive = true } = await request.json();
  if (!productId || !source || !url) {
    return NextResponse.json({ error: "productId, source, and url are required" }, { status: 400 });
  }

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

  return NextResponse.json(affiliateLink, { status: 201 });
}
