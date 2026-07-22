export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";

async function getCounts() {
  const [users, products, articles, affiliateClicks] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.article.count(),
    prisma.affiliateClick.count(),
  ]);

  return { users, products, articles, affiliateClicks };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-2 text-zinc-600">Espace d'administration — en construction.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(counts).map(([key, value]) => (
          <div key={key} className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{key}</p>
            <p className="mt-4 text-4xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
