import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { affiliateLinks: true },
  }) as Promise<Array<{
    id: string;
    name: string;
    slug: string;
    isPublished: boolean;
    affiliateLinks: { id: string }[];
    updatedAt: Date;
  }>>;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produits</h1>
          <p className="mt-2 text-zinc-600">Gestion des produits et liens affiliés.</p>
        </div>
        <Button variant="default">Nouveau produit</Button>
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Publié</TableHead>
              <TableHead>Affiliés</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.slug}</TableCell>
                <TableCell>{product.isPublished ? "Oui" : "Non"}</TableCell>
                <TableCell>{product.affiliateLinks.length}</TableCell>
                <TableCell>{product.updatedAt.toISOString().slice(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
