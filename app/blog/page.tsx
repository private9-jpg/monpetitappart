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
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
            Actualités, conseils et témoignages sur le monde de l&apos;immobilier et de l&apos;appartement.
          </p>
        </div>
        <ArticleCardGrid variant="vertical" />
      </div>
    </Section>
  );
}
