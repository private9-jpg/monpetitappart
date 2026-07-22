import { prisma } from "@/lib/prisma";

export async function trackClick(affiliateLinkId: string, source?: string, ip?: string, userAgent?: string, metadata?: string) {
  const click = await prisma.affiliateClick.create({
    data: {
      affiliateLinkId,
      source,
      ip,
      userAgent,
      metadata,
    },
  });

  await prisma.affiliateLink.update({
    where: { id: affiliateLinkId },
    data: { clickCount: { increment: 1 } },
  });

  return click;
}

export async function resolveProductRedirect(productSlug: string) {
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: {
      merchantRel: true,
      offers: { where: { isActive: true }, include: { merchant: true }, orderBy: { createdAt: "desc" } },
      affiliateLinks: { where: { isActive: true }, orderBy: { clickCount: "desc" } },
    },
  });

  if (!product) return null;

  const activeOffers = product.offers.filter((o) => o.isActive);
  const activeLinks = product.affiliateLinks.filter((l) => l.isActive);

  let targetUrl: string | null = null;
  let affiliateLinkId: string | null = null;

  if (activeLinks.length > 0) {
    targetUrl = activeLinks[0].url;
    affiliateLinkId = activeLinks[0].id;
  } else if (activeOffers.length > 0) {
    targetUrl = activeOffers[0].url;
  } else if (product.merchantRel?.websiteUrl) {
    targetUrl = product.merchantRel.websiteUrl;
  } else if (product.productUrl) {
    targetUrl = product.productUrl;
  }

  return { product, targetUrl, affiliateLinkId };
}

export async function checkAffiliateLinksHealth() {
  const links = await prisma.affiliateLink.findMany({
    where: { isActive: true },
    include: { product: { select: { id: true, name: true, slug: true } } },
  });

  const results = await Promise.all(
    links.map(async (link) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(link.url, { method: "HEAD", signal: controller.signal, redirect: "manual" });
        clearTimeout(timeout);
        const isOk = response.status >= 200 && response.status < 400;
        return { linkId: link.id, url: link.url, status: response.status, isOk };
      } catch {
        return { linkId: link.id, url: link.url, status: 0, isOk: false };
      }
    })
  );

  const deadLinks = results.filter((r) => !r.isOk);
  return { total: links.length, dead: deadLinks.length, deadLinks };
}

export async function getAffiliateStats() {
  const [totalClicks, totalConversions, totalRevenueCents, totalLinks, activeLinks] = await Promise.all([
    prisma.affiliateClick.count(),
    prisma.conversion.count({ where: { status: "COMPLETED" } }),
    prisma.conversion.aggregate({ where: { status: "COMPLETED" }, _sum: { amountCents: true } }),
    prisma.affiliateLink.count(),
    prisma.affiliateLink.count({ where: { isActive: true } }),
  ]);

  return {
    totalClicks,
    totalConversions,
    totalRevenueCents: totalRevenueCents._sum.amountCents ?? 0,
    totalLinks,
    activeLinks,
    conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
  };
}
