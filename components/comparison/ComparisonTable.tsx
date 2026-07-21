import { ComparisonRow, ComparisonRowCard } from "./ComparisonRow";

const PRODUCTS = [
  {
    id: 1,
    product: "Assurance Loyer Impayé Premium",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&q=80",
    price: "12,90",
    oldPrice: "16,90",
    unit: "€/mois",
    rating: 4,
    reviews: 128,
    merchant: "AssurTech",
    badge: "Notre choix",
    href: "#",
  },
  {
    id: 2,
    product: "Garantie Risque Locatif Essentiel",
    image: "https://images.unsplash.com/photo-1579621970563-e3c3b2b6b0a0?w=200&q=80",
    price: "7,50",
    oldPrice: "9,90",
    unit: "€/mois",
    rating: 3,
    reviews: 84,
    merchant: "ProtectHome",
    badge: null,
    href: "#",
  },
  {
    id: 3,
    product: "Pack Gestionnaire Immobilier",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80",
    price: "24,90",
    oldPrice: "29,90",
    unit: "€/mois",
    rating: 5,
    reviews: 256,
    merchant: "ImmoAssure",
    badge: "Promo",
    href: "#",
  },
];

interface ComparisonTableProps {
  className?: string;
}

export function ComparisonTable({ className }: ComparisonTableProps) {
  return (
    <div className={className}>
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
