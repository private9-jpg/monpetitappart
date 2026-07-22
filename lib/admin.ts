import { prisma } from "@/lib/prisma";

export async function getOverviewStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    pendingComments,
    reportedComments,
    deadLinks,
    articlesToRefresh,
    criticalErrors,
    sessions7d,
    sessions30d,
    clicks7d,
    clicks30d,
    publishedThisMonth,
    drafts,
    inReview,
    topPages,
    topMerchants,
    estimatedRevenue,
  ] = await Promise.all([
    prisma.comment.count({ where: { isPublished: false } }),
    prisma.report.count({ where: { status: { not: "DISMISSED" } } }),
    prisma.affiliateLink.count({ where: { isActive: false } }),
    prisma.article.count({ where: { status: "PUBLISHED", lastCheckedAt: { lt: thirtyDaysAgo } } }),
    prisma.auditLog.count({ where: { action: { contains: "error" } } }),
    prisma.auditLog.count({ where: { action: "login", createdAt: { gte: sevenDaysAgo } } }),
    prisma.auditLog.count({ where: { action: "login", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.article.count({ where: { status: "PUBLISHED", publishedAt: { gte: startOfMonth } } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "PUBLISHED", publishedAt: null } }),
    prisma.auditLog.groupBy({ by: ["entityId"], where: { action: "tracking_click", createdAt: { gte: thirtyDaysAgo } }, _count: true, orderBy: { _count: { entityId: "desc" } }, take: 5 }),
    prisma.productOffer.groupBy({ by: ["merchantId"], where: { isActive: true }, _count: true, orderBy: { _count: { merchantId: "desc" } }, take: 5 }),
    prisma.conversion.aggregate({ where: { status: "COMPLETED" }, _sum: { amountCents: true } }),
  ]);

  const topMerchantIds = topMerchants.map((m) => m.merchantId);
  const merchantNames = topMerchantIds.length
    ? await prisma.merchant.findMany({ where: { id: { in: topMerchantIds } }, select: { id: true, name: true } })
    : [];
  const merchantMap = Object.fromEntries(merchantNames.map((m) => [m.id, m.name]));

  return {
    alerts: { pendingComments, reportedComments, deadLinks, articlesToRefresh, criticalErrors },
    traffic: { sessions7d, sessions30d, topPages },
    affiliation: { clicks7d, clicks30d, topMerchants: topMerchants.map((m) => ({ name: merchantMap[m.merchantId] ?? m.merchantId, clicks: m._count })), estimatedRevenue: estimatedRevenue._sum.amountCents ?? 0 },
    content: { publishedThisMonth, inReview, drafts },
  };
}
