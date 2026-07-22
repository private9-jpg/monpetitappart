"use client";

import { useState, useMemo } from "react";
import { ProductGrid, PRODUCTS_DATA, PRODUCTS_PAGE_SIZE } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/guides/Pagination";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { SiteLayout } from "@/components/layouts/SiteLayout";
import { Section } from "@/components/ui/section";

export default function ProduitsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS_DATA;
    return PRODUCTS_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * PRODUCTS_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PRODUCTS_PAGE_SIZE);

  return (
    <SiteLayout>
      <div className="flex flex-col">
        <Section className="pt-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-surface-900 sm:text-5xl dark:text-surface-50">
              Produits
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Découvrez notre sélection de produits et services pour votre logement.
            </p>
          </div>
        </Section>

        <Section>
          <ProductFilters searchQuery={query} onSearchChange={(value) => { setQuery(value); setPage(1); }} />
        </Section>

        <Section>
          <ProductGrid items={pageItems} />
        </Section>

        <Section>
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </Section>

        <Section>
          <Newsletter />
        </Section>
      </div>
    </SiteLayout>
  );
}
