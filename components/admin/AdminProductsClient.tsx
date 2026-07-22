"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Product = {
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  affiliateLinks: { id: string }[];
  updatedAt: string;
};

type VerificationResult = {
  links?: { total: number; broken: number };
  images?: { total: number; broken: number };
  websites?: { total: number; broken: number };
};

type PriceUpdateResult = {
  updated: number;
  skipped: number;
  errors: Array<{ productId?: string; reason: string }>;
};

type ImportResult = {
  imported: number;
  skipped: number;
  errors: Array<{ row: number; reason: string }>;
};

export default function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [priceResult, setPriceResult] = useState<PriceUpdateResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function runVerification(type = "all") {
    setLoading(`verification-${type}`);
    try {
      const res = await fetch(`/api/admin/verification?type=${type}`);
      const data = await res.json();
      setVerification(data);
    } catch {
      setVerification({ links: { total: 0, broken: 0 }, images: { total: 0, broken: 0 }, websites: { total: 0, broken: 0 } });
    } finally {
      setLoading(null);
    }
  }

  async function runPriceUpdate() {
    setLoading("prices");
    try {
      const res = await fetch("/api/admin/prices", { method: "POST" });
      const data = await res.json();
      setPriceResult(data);
    } catch {
      setPriceResult({ updated: 0, skipped: 0, errors: [{ reason: "Erreur" }] });
    } finally {
      setLoading(null);
    }
  }

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    setLoading("import");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/import", { method: "POST", body: formData });
      const data = await res.json();
      setImportResult(data);
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      setImportResult({ imported: 0, skipped: 0, errors: [{ row: 0, reason: "Erreur" }] });
    } finally {
      setLoading(null);
      fileInput.value = "";
    }
  }

  async function handleExport() {
    setLoading("export");
    try {
      const res = await fetch("/api/products/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'export");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produits</h1>
          <p className="mt-2 text-zinc-600">Gestion des produits, imports, vérifications et prix.</p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleImport} className="flex items-center gap-2">
            <input type="file" accept=".csv" required className="text-sm" />
            <Button type="submit" variant="outline" disabled={loading === "import"}>
              {loading === "import" ? "Import..." : "Import CSV"}
            </Button>
          </form>
          <Button variant="outline" onClick={handleExport} disabled={loading === "export"}>
            {loading === "export" ? "Export..." : "Export CSV"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-zinc-500">Vérifier les liens affiliés</p>
          <Button className="mt-2 w-full" variant="secondary" onClick={() => runVerification("links")} disabled={loading === "verification-links"}>
            {loading === "verification-links" ? "Vérification..." : "Vérifier"}
          </Button>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-zinc-500">Vérifier les images</p>
          <Button className="mt-2 w-full" variant="secondary" onClick={() => runVerification("images")} disabled={loading === "verification-images"}>
            {loading === "verification-images" ? "Vérification..." : "Vérifier"}
          </Button>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-zinc-500">Vérifier les sites marchands</p>
          <Button className="mt-2 w-full" variant="secondary" onClick={() => runVerification("websites")} disabled={loading === "verification-websites"}>
            {loading === "verification-websites" ? "Vérification..." : "Vérifier"}
          </Button>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-zinc-500">Mettre à jour les prix</p>
          <Button className="mt-2 w-full" variant="default" onClick={runPriceUpdate} disabled={loading === "prices"}>
            {loading === "prices" ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </div>
      </div>

      {verification && (
        <div className="mt-6 rounded-2xl border bg-white p-4">
          <h2 className="text-lg font-semibold">Résultats vérification</h2>
          <pre className="mt-2 overflow-auto text-sm">{JSON.stringify(verification, null, 2)}</pre>
        </div>
      )}

      {priceResult && (
        <div className="mt-6 rounded-2xl border bg-white p-4">
          <h2 className="text-lg font-semibold">Résultats mise à jour prix</h2>
          <pre className="mt-2 overflow-auto text-sm">{JSON.stringify(priceResult, null, 2)}</pre>
        </div>
      )}

      {importResult && (
        <div className="mt-6 rounded-2xl border bg-white p-4">
          <h2 className="text-lg font-semibold">Résultats import</h2>
          <pre className="mt-2 overflow-auto text-sm">{JSON.stringify(importResult, null, 2)}</pre>
        </div>
      )}

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
                <TableCell>{new Date(product.updatedAt).toISOString().slice(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
