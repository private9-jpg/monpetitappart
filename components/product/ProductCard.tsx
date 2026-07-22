"use client";

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

export function ProductCard({ product, className }: CardProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.badge && (
          <div className="absolute inset-x-0 top-0 flex p-4">
            <Badge variant="default" className="bg-white/90 text-surface-900 hover:bg-white backdrop-blur-sm">
              {product.badge}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-surface-900 dark:text-surface-50">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
          {product.description}
        </p>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-2xl font-semibold text-surface-900 dark:text-surface-50">{product.price} {product.unit}</span>
          {product.oldPrice && (
            <span className="text-sm text-surface-500 line-through">{product.oldPrice} {product.unit}</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {product.reviews} avis
          </span>
        </div>

        <div className="mt-auto pt-5">
          <Button asChild className="w-full">
            <a href={product.href}>Voir l&apos;offre</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductCardGrid({ products }: { products?: ProductListItem[] }) {
  const items = products ?? [];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
