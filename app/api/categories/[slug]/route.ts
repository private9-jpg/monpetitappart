export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.productCategory.findUnique({
    where: { slug },
    include: { products: { include: { product: true } } },
  });

  if (!category) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const { slug } = await params;
  const body = await request.json();
  const sanitized = sanitizeObject(body as Record<string, unknown>, 500);
  const parsed = categoryUpdateSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const category = await prisma.productCategory.update({ where: { slug }, data: parsed.data });
  await recordAuditLog(request, "update_category", "ProductCategory", category.id, { slug }, currentUser.id);
  return NextResponse.json(category);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const { slug } = await params;
  const category = await prisma.productCategory.findUnique({ where: { slug } });
  if (!category) {
    return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  }

  await prisma.productCategory.delete({ where: { slug } });
  await recordAuditLog(request, "delete_category", "ProductCategory", category.id, { slug }, currentUser.id);
  return NextResponse.json({ message: "Catégorie supprimée" }, { status: 200 });
}
