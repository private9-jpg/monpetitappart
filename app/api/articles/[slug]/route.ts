export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

const articleUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(50000).optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  excerpt: z.string().max(1000).optional(),
  cluster: z.string().optional(),
  seoTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  ogImage: z.string().url().optional(),
  canonical: z.string().url().optional(),
  indexable: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: { select: { id: true, email: true } }, productLinks: { include: { product: true } } },
  });

  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "WRITER"].includes(currentUser.role)) return forbidden();

  const { slug } = await params;
  const body = await request.json();
  const sanitized = sanitizeObject(body as Record<string, unknown>, 50000);
  const parsed = articleUpdateSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const article = await prisma.article.update({ where: { slug }, data: parsed.data });
  await recordAuditLog(request, "update_article", "Article", article.id, { slug }, currentUser.id);
  return NextResponse.json(article);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  await prisma.article.delete({ where: { slug } });
  await recordAuditLog(request, "delete_article", "Article", article.id, { slug }, currentUser.id);
  return NextResponse.json({ message: "Article supprimé" }, { status: 200 });
}
