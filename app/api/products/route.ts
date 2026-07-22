import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, unauthorized, recordAuditLog } from "@/lib/auth";

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
  if (!["ADMIN", "EDITOR", "WRITER"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const { name, slug, affiliateUrl, currency = "EUR", isPublished = false } = body;

  if (!name || !slug || !affiliateUrl) {
    return NextResponse.json({ error: "name, slug and affiliateUrl are required" }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { slug } });
  if (existingProduct) {
    return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  }

  const createData: any = {
    name,
    slug,
    affiliateUrl,
    currency,
    isPublished: Boolean(isPublished),
    productUrl: body.productUrl,
    description: body.description,
    priceCents: body.priceCents,
    merchant: body.merchant,
    imageUrl: body.imageUrl,
    publishedAt: isPublished ? new Date() : null,
  };

  if (currentUser.role === "WRITER") {
    createData.isPublished = false;
    createData.publishedAt = null;
  }

  const product = await prisma.product.create({ data: createData });
  await recordAuditLog(request, "create_product", "Product", product.id, { authorId: currentUser.id, role: currentUser.role }, currentUser.id);

  return NextResponse.json(product, { status: 201 });
}
