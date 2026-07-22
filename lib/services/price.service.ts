import { prisma } from "@/lib/prisma";

export async function getPriceHistory(productId?: string, offerId?: string, merchantId?: string, limit = 100) {
  const where: Record<string, unknown> = {};
  if (productId) where.productId = productId;
  if (offerId) where.offerId = offerId;
  if (merchantId) where.merchantId = merchantId;

  return prisma.priceHistory.findMany({
    where,
    orderBy: { recordedAt: "desc" },
    take: limit,
  });
}

export async function recordPriceHistory(data: {
  productId?: string;
  offerId?: string;
  merchantId?: string;
  priceCents: number;
  currency?: string;
}) {
  return prisma.priceHistory.create({
    data: {
      productId: data.productId,
      offerId: data.offerId,
      merchantId: data.merchantId,
      priceCents: data.priceCents,
      currency: data.currency ?? "EUR",
    },
  });
}
