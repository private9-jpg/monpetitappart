import { prisma } from "@/lib/prisma";

export interface ImageCheckResult {
  url: string;
  status: number;
  isOk: boolean;
  contentType?: string;
  size?: number;
}

export async function checkProductImages(limit = 50) {
  const products = await prisma.product.findMany({
    where: { imageUrl: { not: null } },
    take: limit,
    select: { id: true, name: true, slug: true, imageUrl: true },
  });

  const results: ImageCheckResult[] = [];
  for (const product of products) {
    if (!product.imageUrl) continue;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(product.imageUrl, { method: "HEAD", signal: controller.signal, redirect: "manual" });
      clearTimeout(timeout);
      const contentType = response.headers.get("content-type");
      const contentLength = response.headers.get("content-length");
      const isOk = response.status >= 200 && response.status < 400 && contentType?.startsWith("image/");
      results.push({
        url: product.imageUrl,
        status: response.status,
        isOk: isOk ?? false,
        contentType: contentType ?? undefined,
        size: contentLength ? parseInt(contentLength, 10) : undefined,
      });
    } catch {
      results.push({ url: product.imageUrl, status: 0, isOk: false });
    }
  }

  const broken = results.filter((r) => !r.isOk);
  return { total: products.length, broken: broken.length, results, brokenImages: broken };
}

export async function checkMerchantWebsites(limit = 50) {
  const merchants = await prisma.merchant.findMany({
    where: { websiteUrl: { not: null } },
    take: limit,
    select: { id: true, name: true, slug: true, websiteUrl: true },
  });

  const results = await Promise.all(
    merchants.map(async (merchant) => {
      if (!merchant.websiteUrl) return { merchantId: merchant.id, url: "", status: 0, isOk: false };
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(merchant.websiteUrl, { method: "HEAD", signal: controller.signal, redirect: "manual" });
        clearTimeout(timeout);
        const isOk = response.status >= 200 && response.status < 400;
        return { merchantId: merchant.id, url: merchant.websiteUrl, status: response.status, isOk };
      } catch {
        return { merchantId: merchant.id, url: merchant.websiteUrl, status: 0, isOk: false };
      }
    })
  );

  const broken = results.filter((r) => !r.isOk);
  return { total: merchants.length, broken: broken.length, results, brokenWebsites: broken };
}
