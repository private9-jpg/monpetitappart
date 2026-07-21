import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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

interface ComparisonRowProps {
  item: typeof PRODUCTS[number];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Note ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-accent-500 text-accent-500" : "text-surface-300"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ComparisonRow({ item }: ComparisonRowProps) {
  return (
    <tr className="border-b border-surface-100 last:border-b-0 dark:border-surface-800">
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-100">
            <Image src={item.image} alt={item.product} fill className="object-cover" sizes="64px" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">{item.product}</span>
              {item.badge && <Badge variant="default" className="text-[10px]">{item.badge}</Badge>}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">{item.price} {item.unit}</span>
          {item.oldPrice && <span className="text-xs text-surface-500 line-through">{item.oldPrice} {item.unit}</span>}
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-1">
          <StarRating rating={item.rating} />
          <span className="text-xs text-surface-500">{item.reviews} avis</span>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6">
        <span className="text-sm text-surface-700 dark:text-surface-300">{item.merchant}</span>
      </td>
      <td className="px-4 py-4 sm:px-6">
        <Button size="sm" className="h-8" asChild>
          <a href={item.href}>Voir</a>
        </Button>
      </td>
    </tr>
  );
}

export function ComparisonRowCard({ item }: ComparisonRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-200 bg-white p-4 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <div className="flex items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-100">
          <Image src={item.image} alt={item.product} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">{item.product}</span>
            {item.badge && <Badge variant="default" className="text-[10px]">{item.badge}</Badge>}
          </div>
          <span className="text-xs text-surface-500">{item.merchant}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-surface-900 dark:text-surface-50">{item.price} {item.unit}</span>
          {item.oldPrice && <span className="text-xs text-surface-500 line-through">{item.oldPrice} {item.unit}</span>}
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={item.rating} />
          <span className="text-xs text-surface-500">({item.reviews})</span>
        </div>
      </div>

      <Button size="sm" className="w-full" asChild>
        <a href={item.href}>Voir l&apos;offre</a>
      </Button>
    </div>
  );
}
