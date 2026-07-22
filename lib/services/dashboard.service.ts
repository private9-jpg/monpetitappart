import { prisma } from "@/lib/prisma";
import { getRevenueStats } from "@/lib/services/conversion.service";

export async function getDashboardStats() {
  const [
    totalUsers,
    totalProducts,
    totalArticles,
    totalComments,
    totalAffiliateClicks,
    totalNewsletterSubscribers,
    publishedProducts,
    publishedArticles,
    activeAffiliateLinks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.article.count(),
    prisma.comment.count(),
    prisma.affiliateClick.count(),
    prisma.newsletterSubscriber.count({ where: { isSubscribed: true } }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.affiliateLink.count({ where: { isActive: true } }),
  ]);

  const revenueStats = await getRevenueStats();

  return {
    users: totalUsers,
    products: { total: totalProducts, published: publishedProducts },
    articles: { total: totalArticles, published: publishedArticles },
    comments: { total: totalComments },
    affiliate: { clicks: totalAffiliateClicks, activeLinks: activeAffiliateLinks, revenue: revenueStats },
    newsletter: { subscribers: totalNewsletterSubscribers },
  };
}

export async function getRecentActivity(limit = 10) {
  const [recentProducts, recentArticles, recentComments, recentClicks] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.article.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.comment.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.affiliateClick.findMany({ orderBy: { createdAt: "desc" }, take: limit, include: { affiliateLink: { include: { product: true } } } }),
  ]);

  return {
    recentProducts,
    recentArticles,
    recentComments,
    recentClicks,
  };
}

export async function getTopPerformingContent(limit = 5) {
  const [topProducts, topArticles] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { rating: "desc" },
      take: limit,
      include: { affiliateLinks: true },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: limit,
    }),
  ]);

  return { topProducts, topArticles };
}
