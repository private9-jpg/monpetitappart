"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { GuideGrid, GUIDES_DATA, GUIDES_PAGE_SIZE } from "@/components/guides/GuideGrid";
import { Pagination } from "@/components/guides/Pagination";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { Section } from "@/components/ui/section";

export default function GuidesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDES_DATA;
    return GUIDES_DATA.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.excerpt.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / GUIDES_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * GUIDES_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + GUIDES_PAGE_SIZE);

  return (
    <div className="flex flex-col">
      <Section className="pt-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-surface-900 sm:text-5xl dark:text-surface-50">
              Guides
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Retrouvez tous nos guides, conseils et astuces pour votre logement.
            </p>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <Input
              type="search"
              placeholder="Rechercher un guide..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </Section>

      <Section>
        <GuideGrid items={pageItems} />
      </Section>

      <Section>
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
      </Section>

      <Section>
        <Newsletter />
      </Section>
    </div>
  );
}
