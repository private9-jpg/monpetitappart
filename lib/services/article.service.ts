import { prisma } from "@/lib/prisma";

export async function listArticles(filters?: { status?: string; authorId?: string; limit?: number }) {
  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.authorId) where.authorId = filters.authorId;

  return prisma.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: filters?.limit ?? 50,
    include: { author: { select: { id: true, email: true } } },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, email: true } },
      productLinks: { include: { product: true } },
    },
  });
}

export async function getRelatedArticles(slug: string, limit = 5) {
  const article = await prisma.article.findUnique({ where: { slug }, select: { id: true, status: true } });
  if (!article) return [];

  const where: Record<string, unknown> = { id: { not: article.id }, status: "PUBLISHED" };

  return prisma.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { author: { select: { id: true, email: true } } },
  });
}

export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  status?: string;
  excerpt?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonical?: string;
  publishedAt?: Date;
}) {
  return prisma.article.create({ data });
}

export async function updateArticle(slug: string, data: Record<string, unknown>) {
  return prisma.article.update({ where: { slug }, data });
}

export async function deleteArticle(slug: string) {
  return prisma.article.delete({ where: { slug } });
}
