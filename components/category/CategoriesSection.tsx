import { CategoryCardGrid } from "./CategoryCard";
import { Section } from "@/components/ui/section";

export function CategoriesSection() {
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
            Explorez par catégorie
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
            Trouvez facilement le contenu qui vous correspond.
          </p>
        </div>
        <CategoryCardGrid />
      </div>
    </Section>
  );
}
