import { ProductCardGrid } from "@/components/product/ProductCard";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  badge: string | null;
  href: string;
};

export const PRODUCTS_DATA: Product[] = [
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
  {
    id: 4,
    name: "Comparateur d'Assurances Habitation",
    description: "Trouvez la couverture idéale au meilleur prix en 2 minutes.",
    price: "0,00",
    oldPrice: "",
    unit: "€",
    rating: 5,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    badge: "Gratuit",
    href: "#",
  },
  {
    id: 5,
    name: "Service d'État des Lieux Numérique",
    description: "Réalisez votre état des lieux en ligne, sans papier.",
    price: "19,90",
    oldPrice: "",
    unit: "€/état des lieux",
    rating: 4,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1586281370619-e54e2ce9e3af?w=800&q=80",
    badge: null,
    href: "#",
  },
  {
    id: 6,
    name: "Compte à Rebours Déménagement",
    description: "Checklist, budget et planning pour un départ sans stress.",
    price: "4,90",
    oldPrice: "7,90",
    unit: "€",
    rating: 4,
    reviews: 195,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    badge: "Bestseller",
    href: "#",
  },
];

export const PRODUCTS_PAGE_SIZE = 6;

interface ProductGridProps {
  items: Product[];
}

export function ProductGrid({ items }: ProductGridProps) {
  const adapted = items.map((product) => ({
    id: String(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    unit: product.unit,
    image: product.image,
    rating: product.rating,
    reviews: product.reviews,
    badge: product.badge,
    href: product.href,
  }));

  return <ProductCardGrid products={adapted} />;
}
