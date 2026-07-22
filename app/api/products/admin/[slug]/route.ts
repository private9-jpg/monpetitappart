import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const { slug } = await params;
  const body = await request.json();

  const action = (body.action ?? body.status ?? null) as string | null;
  const data: Record<string, unknown> = {
    name: body.name,
    description: body.description,
    affiliateUrl: body.affiliateUrl,
    productUrl: body.productUrl,
    imageUrl: body.imageUrl,
    merchant: body.merchant,
    priceCents: body.priceCents,
    currency: body.currency,
  };

  if (action === "archive" || action === "ARCHIVED" || body.status === "ARCHIVED") {
    data.isPublished = false;
    data.publishedAt = null;
  } else if (action === "publish" || action === "PUBLISHED" || body.status === "PUBLISHED") {
    data.isPublished = true;
    data.publishedAt = new Date();
  } else if (body.isPublished !== undefined) {
    data.isPublished = Boolean(body.isPublished);
    data.publishedAt = body.isPublished ? new Date() : data.publishedAt ?? null;
  }

  const updated = await prisma.product.updateMany({
    where: { slug },
    data,
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const product = await prisma.product.findUnique({ where: { slug } });
  await recordAuditLog(request, "update_product", "Product", product?.id, { slug, action }, currentUser.id);
  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  await prisma.product.delete({ where: { slug } });
  await recordAuditLog(request, "delete_product", "Product", product.id, { slug }, currentUser.id);
  return NextResponse.json({ message: "Produit supprimé" }, { status: 200 });
}
