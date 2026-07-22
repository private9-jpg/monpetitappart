import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminProductsClient from "@/components/admin/AdminProductsClient";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Produits",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
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

  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { affiliateLinks: true },
  });

  const initialProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    isPublished: p.isPublished,
    affiliateLinks: p.affiliateLinks,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold text-zinc-900">Produits</h1>
          <p className="mt-1 text-sm text-zinc-600">Gestion des produits, imports, vérifications et prix.</p>
        </div>
        <div className="p-4 sm:p-6">
          <AdminProductsClient initialProducts={initialProducts} />
        </div>
      </main>
    </div>
  );
}
