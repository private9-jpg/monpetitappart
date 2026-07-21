import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Assurance Loyer Impayé Premium",
    description: "Protection complète pour votre investissement locatif.",
    price: "12,90",
    oldPrice: "16,90",
    unit: "€/mois",
    rating: 4,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    badge: "Notre choix",
    href: "#",
  },
  {
    id: 2,
    name: "Garantie Risque Locatif Essentiel",
    description: "La sécurité à petit prix pour votre logement.",
    price: "7,50",
    oldPrice: "9,90",
    unit: "€/mois",
    rating: 3,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1579621970563-e3c3b2b6b0a0?w=800&q=80",
    badge: null,
    href: "#",
  },
  {
    id: 3,
    name: "Pack Gestionnaire Immobilier",
    description: "Tout en un pour les propriétaires bailleurs.",
    price: "24,90",
    oldPrice: "29,90",
    unit: "€/mois",
    rating: 5,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    badge: "Promo",
    href: "#",
  },
];

interface ProductCardProps {
  product?: typeof PRODUCTS[number];
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

export function ProductCard({ product = PRODUCTS[0], className }: ProductCardProps) {
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

export function ProductCardGrid({ products = PRODUCTS }: { products?: typeof PRODUCTS }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
