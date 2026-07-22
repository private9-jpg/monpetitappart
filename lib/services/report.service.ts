import { prisma } from "@/lib/prisma";
import { sendNotification } from "./notification.service";

export async function generateDailyReport() {
  const [users, products, articles, comments, clicks, subscribers, conversions] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.article.count(),
    prisma.comment.count(),
    prisma.affiliateClick.count(),
    prisma.newsletterSubscriber.count({ where: { isSubscribed: true } }),
    prisma.conversion.count({ where: { status: "COMPLETED" } }),
  ]);

  const revenue = await prisma.conversion.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amountCents: true },
  });

  const report = {
    date: new Date().toISOString(),
    users,
    products,
    articles,
    comments,
    clicks,
    subscribers,
    conversions,
    revenueCents: revenue._sum.amountCents ?? 0,
  };

  await sendNotification({
    to: process.env.NOTIFICATION_EMAIL || "admin@monpetitappart.fr",
    subject: "Rapport quotidien",
    text: JSON.stringify(report, null, 2),
    event: "daily_report",
    metadata: report,
  });

  return report;
}

export async function generateWeeklyReport() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [newUsers, newProducts, newArticles, newComments, newClicks, newSubscribers, newConversions] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.product.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.article.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.comment.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.conversion.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  const revenue = await prisma.conversion.aggregate({
    where: { status: "COMPLETED", createdAt: { gte: sevenDaysAgo } },
    _sum: { amountCents: true },
  });

  const report = {
    period: "7 days",
    from: sevenDaysAgo.toISOString(),
    to: new Date().toISOString(),
    newUsers,
    newProducts,
    newArticles,
    newComments,
    newClicks,
    newSubscribers,
    newConversions,
    revenueCents: revenue._sum.amountCents ?? 0,
  };

  await sendNotification({
    to: process.env.NOTIFICATION_EMAIL || "admin@monpetitappart.fr",
    subject: "Rapport hebdomadaire",
    text: JSON.stringify(report, null, 2),
    event: "weekly_report",
    metadata: report,
  });

  return report;
}
