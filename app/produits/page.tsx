import { ProductCardGrid } from "@/components/product/ProductCard";
import { Section } from "@/components/ui/section";

export default function ProduitsPage() {
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
            Produits
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
            Notre sélection de produits et services pour votre quotidien.
          </p>
        </div>
        <ProductCardGrid />
      </div>
    </Section>
  );
}
