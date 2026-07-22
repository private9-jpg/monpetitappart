export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

const articleQuerySchema = z.object({
  status: z.string().optional(),
  authorId: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const articleCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  status: z.string().default("draft"),
  excerpt: z.string().max(1000).optional(),
  seoTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  ogImage: z.string().url().optional(),
  canonical: z.string().url().optional(),
  indexable: z.boolean().default(true),
  authorId: z.string().uuid(),
});

const articleUpdateSchema = articleCreateSchema.partial().extend({ slug: z.string().min(1).max(200) });

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = articleQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { limit, ...filters } = parsed.data;
  const articles = await prisma.article.findMany({
    where: { ...(filters.status ? { status: filters.status } : {}), ...(filters.authorId ? { authorId: filters.authorId } : {}) },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { author: { select: { id: true, email: true } } },
  });

  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "WRITER"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const sanitized = sanitizeObject(body as Record<string, unknown>, 50000);
  const parsed = articleCreateSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Article with this slug already exists" }, { status: 409 });
  }

  const article = await prisma.article.create({ data: parsed.data });
  await recordAuditLog(request, "create_article", "Article", article.id, { title: article.title }, currentUser.id);
  return NextResponse.json(article, { status: 201 });
}
