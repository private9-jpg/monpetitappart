import { prisma } from "@/lib/prisma";

export async function createConversion(data: {
  affiliateClickId?: string;
  productId?: string;
  amountCents: number;
  currency?: string;
  status?: string;
  metadata?: string;
}) {
  return prisma.conversion.create({
    data: {
      affiliateClickId: data.affiliateClickId,
      productId: data.productId,
      amountCents: data.amountCents,
      currency: data.currency ?? "EUR",
      status: data.status ?? "PENDING",
      metadata: data.metadata,
    },
  });
}

export async function updateConversionStatus(id: string, status: string) {
  return prisma.conversion.update({
    where: { id },
    data: { status },
  });
}

export async function getConversionsByProduct(productId: string) {
  return prisma.conversion.findMany({
    where: { productId },
    include: { affiliateClick: { include: { affiliateLink: { include: { product: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRevenueStats() {
  const [totalRevenue, totalConversions, avgOrderValue] = await Promise.all([
    prisma.conversion.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amountCents: true },
      _count: true,
    }),
    prisma.conversion.count({ where: { status: "COMPLETED" } }),
    prisma.conversion.aggregate({
      where: { status: "COMPLETED" },
      _avg: { amountCents: true },
    }),
  ]);

  return {
    totalRevenueCents: totalRevenue._sum.amountCents ?? 0,
    totalConversions,
    averageOrderValueCents: avgOrderValue._avg.amountCents ?? 0,
  };
}
