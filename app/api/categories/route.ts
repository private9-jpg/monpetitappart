export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

const categoryQuerySchema = z.object({ limit: z.coerce.number().int().positive().max(100).default(50) });

const categoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const categoryUpdateSchema = categoryCreateSchema.partial();

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = categoryQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
    take: parsed.data.limit,
    include: { products: { include: { product: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const sanitized = sanitizeObject(body as Record<string, unknown>, 500);
  const parsed = categoryCreateSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.productCategory.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Category with this slug already exists" }, { status: 409 });
  }

  const category = await prisma.productCategory.create({ data: parsed.data });
  await recordAuditLog(request, "create_category", "ProductCategory", category.id, { name: category.name }, currentUser.id);
  return NextResponse.json(category, { status: 201 });
}
