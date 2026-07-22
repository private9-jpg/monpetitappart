import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

async function getData() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [pendingComments, reportedComments, deadLinks, articlesToRefresh, criticalErrors, sessions7d, sessions30d, clicks7d, clicks30d, publishedThisMonth, drafts, inReview] = await Promise.all([
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
  ]);

  return {
    alerts: { pendingComments, reportedComments, deadLinks, articlesToRefresh, criticalErrors },
    traffic: { sessions7d, sessions30d },
    affiliation: { clicks7d, clicks30d, estimatedRevenue: 0 },
    content: { publishedThisMonth, inReview, drafts },
  };
}

function StatCard({ title, value, sub }: { title: string; value: number; sub?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-zinc-900">{value.toLocaleString("fr-FR")}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </Card>
  );
}

export default async function AdminOverview() {
  const data = await getData();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Alertes</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Commentaires en attente" value={data.alerts.pendingComments} />
          <StatCard title="Commentaires signalés" value={data.alerts.reportedComments} />
          <StatCard title="Liens affiliés morts" value={data.alerts.deadLinks} />
          <StatCard title="Articles à rafraîchir" value={data.alerts.articlesToRefresh} />
          <StatCard title="Erreurs critiques" value={data.alerts.criticalErrors} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Trafic</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Sessions 7 jours" value={data.traffic.sessions7d} sub="Dernière semaine" />
          <StatCard title="Sessions 30 jours" value={data.traffic.sessions30d} sub="Dernier mois" />
          <StatCard title="Top pages" value={0} sub="Indisponible pour le moment" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Affiliation</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Clics 7 jours" value={data.affiliation.clicks7d} sub="Dernière semaine" />
          <StatCard title="Clics 30 jours" value={data.affiliation.clicks30d} sub="Dernier mois" />
          <StatCard title="Revenus estimés" value={data.affiliation.estimatedRevenue} sub="En attente de conversion" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">Contenu</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Publiés ce mois" value={data.content.publishedThisMonth} sub="Depuis le 1er du mois" />
          <StatCard title="En relecture" value={data.content.inReview} sub="Publiés sans date" />
          <StatCard title="Brouillons" value={data.content.drafts} sub="Non publiés" />
        </div>
      </section>
    </div>
  );
}
