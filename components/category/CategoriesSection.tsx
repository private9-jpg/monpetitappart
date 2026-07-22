import type { Category } from "@/types/Category";
import { CATEGORIES } from "@/lib/mocks/categories";

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
              Explorez par catégorie
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Trouvez facilement le contenu qui vous correspond.
            </p>
          </div>
          <CategoryGrid categories={CATEGORIES} />
        </div>
      </div>
    </section>
  );
}

export function CategoryGrid({ categories }: { categories?: Category[] }) {
  const items = categories ?? [];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface CategoryCardProps {
  category?: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  if (!category) return null;
  return (
    <div className={`group flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-100">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50">
            {category.name}
          </h3>
        </div>

        <p className="mt-2 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
          {category.description}
        </p>

        <Button variant="ghost" size="sm" className="mt-4 h-8 w-fit px-2 text-xs">
          Découvrir
        </Button>
      </div>
    </div>
  );
}
