import { ProductCardGrid } from "@/components/product/ProductCard";
import { Section } from "@/components/ui/section";

export function FeaturedProducts() {
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center sm:text-left sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
              Produits recommandés
            </h2>
            <p className="max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Notre sélection pour votre logement.
            </p>
          </div>
        </div>

        <ProductCardGrid />
      </div>
    </Section>
  );
}
