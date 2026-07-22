import type { ProductListItem } from "@/types/Product";
import { ComparisonRow, ComparisonRowCard } from "./ComparisonRow";

const PRODUCTS: ProductListItem[] = [
  {
    id: "1",
    name: "Assurance Loyer Impayé Premium",
    description: "",
    price: "12,90",
    oldPrice: "16,90",
    unit: "€/mois",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&q=80",
    rating: 4,
    reviews: 128,
    badge: "Notre choix",
    href: "#",
  },
  {
    id: "2",
    name: "Garantie Risque Locatif Essentiel",
    description: "",
    price: "7,50",
    oldPrice: "9,90",
    unit: "€/mois",
    image: "https://images.unsplash.com/photo-1579621970563-e3c3b2b6b0a0?w=200&q=80",
    rating: 3,
    reviews: 84,
    badge: null,
    href: "#",
  },
  {
    id: "3",
    name: "Pack Gestionnaire Immobilier",
    description: "",
    price: "24,90",
    oldPrice: "29,90",
    unit: "€/mois",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80",
    rating: 5,
    reviews: 256,
    badge: "Promo",
    href: "#",
  },
];

export function ComparisonTable() {
  return (
    <div>
      <div className="hidden md:block overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Produit</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Prix</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Note</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Marchand</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Voir</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((item) => (
              <ComparisonRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {PRODUCTS.map((item) => (
          <ComparisonRowCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
