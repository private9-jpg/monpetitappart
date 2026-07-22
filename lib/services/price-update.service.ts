import { prisma } from "@/lib/prisma";
import { recordPriceHistory } from "./price.service";

export interface PriceUpdateResult {
  updated: number;
  skipped: number;
  errors: Array<{ productId?: string; offerId?: string; reason: string }>;
}

export async function updateProductPriceFromOffer(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { offers: { where: { isActive: true }, orderBy: { priceCents: "asc" }, take: 1 } },
  });

  if (!product || product.offers.length === 0) {
    return null;
  }

  const bestOffer = product.offers[0];
  if (bestOffer.priceCents !== product.priceCents) {
    await recordPriceHistory({
      productId,
      offerId: bestOffer.id,
      merchantId: bestOffer.merchantId,
      priceCents: product.priceCents ?? 0,
      currency: product.currency,
    });

    await prisma.product.update({
      where: { id: productId },
      data: { priceCents: bestOffer.priceCents, currency: bestOffer.currency },
    });

    return { productId, oldPrice: product.priceCents, newPrice: bestOffer.priceCents };
  }

  return null;
}

export async function batchUpdatePrices(productIds: string[]): Promise<PriceUpdateResult> {
  const result: PriceUpdateResult = { updated: 0, skipped: 0, errors: [] };

  for (const productId of productIds) {
    try {
      const updated = await updateProductPriceFromOffer(productId);
      if (updated) {
        result.updated++;
      } else {
        result.skipped++;
      }
    } catch (error) {
      result.errors.push({ productId, reason: error instanceof Error ? error.message : "unknown" });
      result.skipped++;
    }
  }

  return result;
}

export async function autoUpdateAllPrices(limit = 100): Promise<PriceUpdateResult> {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    take: limit,
    select: { id: true },
  });

  const productIds = products.map((p) => p.id);
  return batchUpdatePrices(productIds);
}
