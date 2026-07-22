import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { ProductListItem } from "@/types/Product";

interface CardProps {
  product: ProductListItem;
  className?: string;
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

export function AffiliateCTA({ product, className }: CardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="absolute inset-x-0 top-0 flex p-4">
        <Badge variant="default" className="bg-accent-600 text-white hover:bg-accent-700">
          Notre recommandation
        </Badge>
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50">
            {product.name}
          </h3>
          <p className="text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
            {product.description}
          </p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-2xl font-semibold text-surface-900 dark:text-surface-50">{product.price} {product.unit}</span>
          {product.oldPrice && (
            <span className="text-sm text-surface-500 line-through">{product.oldPrice} {product.unit}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {product.reviews} avis
          </span>
        </div>

        <Button asChild className="h-10 w-full">
          <a href={product.href}>Voir l&apos;offre</a>
        </Button>
      </div>
    </div>
  );
}
