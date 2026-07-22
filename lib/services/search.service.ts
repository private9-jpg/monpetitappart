import { prisma } from "@/lib/prisma";

export async function searchArticlesAndProducts(query: string, limit = 20) {
  const [articles, products] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
    }),
    prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      include: { affiliateLinks: true },
    }),
  ]);

  return { articles, products, total: articles.length + products.length };
}
