import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { ProductListItem } from "@/types/Product";

export type ComparisonRowProps = {
  item: ProductListItem;
};

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
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">{item.name}</span>
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
        <span className="text-sm text-surface-700 dark:text-surface-300">{item.name}</span>
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
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">{item.name}</span>
            {item.badge && <Badge variant="default" className="text-[10px]">{item.badge}</Badge>}
          </div>
          <span className="text-xs text-surface-500 line-through">{item.oldPrice}</span>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-xl font-semibold text-surface-900 dark:text-surface-50">{item.price} {item.unit}</span>
      </div>

      <div className="flex items-center gap-1">
        <StarRating rating={item.rating} />
        <span className="text-xs text-surface-500">({item.reviews})</span>
      </div>

      <Button size="sm" className="w-full" asChild>
        <a href={item.href}>Voir l&apos;offre</a>
      </Button>
    </div>
  );
}
