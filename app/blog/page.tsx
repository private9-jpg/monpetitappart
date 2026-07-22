"use client";

import { useState, useMemo } from "react";
import { ArticleCard, ArticleCardGrid } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/guides/Pagination";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { SiteLayout } from "@/components/layouts/SiteLayout";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES, BLOG_PAGE_SIZE } from "@/components/blog/BlogData";

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesQuery = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
      const matchesCategory = category === "Tous" || post.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * BLOG_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + BLOG_PAGE_SIZE);

  return (
    <SiteLayout>
      <div className="flex flex-col">
        <Section className="pt-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-surface-900 sm:text-5xl dark:text-surface-50">
              Blog
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Actualités, astuces et inspirations pour votre logement.
            </p>
          </div>
        </Section>

        <Section>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-500" />
              <Input
                type="search"
                placeholder="Rechercher un article..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="pl-9"
                aria-label="Rechercher un article"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          {pageItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((post) => (
                <ArticleCard key={post.id} article={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-surface-600 dark:text-surface-400">Aucun article trouvé.</p>
          )}
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
