import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, recordAuditLog, unauthorized } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { affiliateLinks: true },
  });

  return NextResponse.json(products);
}

export async function DELETE(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const body = await request.json();
  const sanitized = sanitizeObject(body as Record<string, unknown>, 200);
  const slug = typeof sanitized.slug === "string" ? sanitized.slug.trim() : "";
  if (!slug) {
    return NextResponse.json({ error: "Slug requis" }, { status: 400 });
  }

  await prisma.product.deleteMany({ where: { slug } });
  await recordAuditLog(request, "delete_product", "Product", slug, { deletedBy: currentUser.id }, currentUser.id);
  return NextResponse.json({ success: true });
}
