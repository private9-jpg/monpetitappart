"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AffiliateLink {
  id: string;
  source: string;
  url: string;
  clickCount: number;
  isActive: boolean;
  product: { id: string; name: string; slug: string } | null;
}

interface ProductOption {
  id: string;
  name: string;
}

export function AffiliateManager() {
  const [links, setLinks] = React.useState<AffiliateLink[]>([]);
  const [products, setProducts] = React.useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    id: "",
    productId: "",
    source: "",
    url: "",
    isActive: true,
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    void fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    const [linksRes, productsRes] = await Promise.all([
      fetch("/api/affiliates/admin").then((res) => res.json()),
      fetch("/api/products/admin").then((res) => res.json()),
    ]);

    setLinks(linksRes);
    setProducts(productsRes.map((product: any) => ({ id: product.id, name: product.name })));
    setIsLoading(false);
  }

  function openNew() {
    setForm({ id: "", productId: "", source: "", url: "", isActive: true });
    setError("");
    setIsOpen(true);
  }

  function openEdit(link: AffiliateLink) {
    setForm({
      id: link.id,
      productId: link.product?.id ?? "",
      source: link.source,
      url: link.url,
      isActive: link.isActive,
    });
    setError("");
    setIsOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.productId || !form.source || !form.url) {
      setError("Tous les champs sont requis.");
      return;
    }

    const payload = {
      productId: form.productId,
      source: form.source,
      url: form.url,
      isActive: form.isActive,
    };

    const endpoint = form.id ? `/api/affiliates/admin/${form.id}` : "/api/affiliates/admin";
    const method = form.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const json = await response.json();
      setError(json.error ?? "Impossible d’enregistrer le lien affilié.");
      return;
    }

    setIsOpen(false);
    void fetchData();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer ce lien affilié ?")) return;
    await fetch(`/api/affiliates/admin/${id}`, { method: "DELETE" });
    void fetchData();
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gestion des liens affiliés</h2>
          <p className="mt-1 text-sm text-zinc-600">Créer, modifier et supprimer des liens pour vos produits.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Nouveau lien</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form.id ? "Modifier le lien" : "Nouveau lien affilié"}</DialogTitle>
              <DialogDescription>
                Remplissez les informations et enregistrez pour ajouter ou mettre à jour un lien affilié.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-2" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm">
                <span>Produit</span>
                <select
                  value={form.productId}
                  onChange={(event) => setForm({ ...form, productId: event.target.value })}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none"
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Source</span>
                <Input
                  value={form.source}
                  onChange={(event) => setForm({ ...form, source: event.target.value })}
                  placeholder="Ex: newsletter, instagram"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>URL</span>
                <Input
                  value={form.url}
                  onChange={(event) => setForm({ ...form, url: event.target.value })}
                  placeholder="https://example.com"
                />
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                  className="h-4 w-4 rounded border border-zinc-300 text-primary focus:ring-primary"
                />
                Actif
              </label>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <DialogFooter>
                <Button type="submit" variant="default">
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Clics</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="p-4 text-center text-sm text-zinc-500">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : links.length ? (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.product?.name ?? "-"}</TableCell>
                  <TableCell>{link.source}</TableCell>
                  <TableCell>{link.clickCount}</TableCell>
                  <TableCell>{link.isActive ? "Oui" : "Non"}</TableCell>
                  <TableCell className="max-w-xs break-words">{link.url}</TableCell>
                  <TableCell className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" size="sm" onClick={() => openEdit(link)}>
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => void handleDelete(link.id)}>
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="p-4 text-center text-sm text-zinc-500">
                  Aucun lien affilié trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
