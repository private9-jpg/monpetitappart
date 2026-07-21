import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const productSlug = request.nextUrl.searchParams.get("product");
  const linkId = request.nextUrl.searchParams.get("link");

  if (!productSlug || !linkId) {
    return NextResponse.json({ error: "Product and link query params are required" }, { status: 400 });
  }

  const link = await prisma.affiliateLink.findUnique({
    where: { id: linkId },
    include: { product: true },
  });

  if (!link || link.product.slug !== productSlug) {
    return NextResponse.json({ error: "Affiliate link not found" }, { status: 404 });
  }

  await prisma.affiliateLink.update({
    where: { id: link.id },
    data: { clickCount: { increment: 1 } },
  });

  const target = link.url;
  return NextResponse.redirect(target);
}
