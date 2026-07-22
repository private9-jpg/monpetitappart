import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import NewsletterClient from "@/components/admin/NewsletterClient";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "EDITOR"].includes(user.role)) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <p className="text-red-600">Accès refusé</p>
        </main>
      </div>
    );
  }

  const [subscribersRaw, stats] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.newsletterSubscriber.groupBy({
      by: ["isSubscribed"],
      _count: { id: true },
    }),
  ]);

  const subscribers = subscribersRaw.map((s) => ({
    id: s.id,
    email: s.email,
    isSubscribed: s.isSubscribed,
    subscribedAt: s.subscribedAt?.toISOString() ?? null,
    unsubscribedAt: s.unsubscribedAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
  }));

  const subscribedCount = stats.find((s) => s.isSubscribed)?._count.id ?? 0;
  const totalCount = stats.reduce((acc, s) => acc + s._count.id, 0);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold text-zinc-900">Newsletter</h1>
          <p className="mt-1 text-sm text-zinc-600">Abonnés et campagnes.</p>
        </div>
        <div className="p-4 sm:p-6">
          <NewsletterClient initialSubscribers={subscribers} stats={{ total: totalCount, subscribed: subscribedCount }} />
        </div>
      </main>
    </div>
  );
}

