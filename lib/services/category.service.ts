import { prisma } from "@/lib/prisma";

export async function listCategories() {
  return prisma.productCategory.findMany({
    orderBy: { name: "asc" },
    include: { products: { include: { product: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.productCategory.findUnique({
    where: { slug },
    include: { products: { include: { product: true } } },
  });
}

export async function getProductsByCategory(categoryId: string, limit = 20) {
  const relations = await prisma.productCategoryRelation.findMany({
    where: { categoryId },
    include: { product: true },
    take: limit,
    orderBy: { product: { createdAt: "desc" } },
  });
  return relations.map((r) => r.product);
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  return prisma.productCategory.create({ data });
}

export async function updateCategory(slug: string, data: Record<string, unknown>) {
  return prisma.productCategory.update({ where: { slug }, data });
}

export async function deleteCategory(slug: string) {
  return prisma.productCategory.delete({ where: { slug } });
}
