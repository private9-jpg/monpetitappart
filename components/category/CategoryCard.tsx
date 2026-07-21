import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "amenagement",
    name: "Aménagement",
    description: "Optimisez chaque espace pour vivre mieux.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  },
  {
    id: "decoration",
    name: "Décoration",
    description: "Astuces déco, minimalisme et ambiance.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  },
  {
    id: "demenagement",
    name: "Déménagement",
    description: "Organisez votre départ sans stress.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    id: "assurance",
    name: "Assurance",
    description: "Protégez votre logement et vos biens.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
  },
  {
    id: "mobilier",
    name: "Mobilier",
    description: "Choisissez des pièces qui durent.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    id: "electromenager",
    name: "Électroménager",
    description: "Comparez et choisissez le meilleur rapport qualité-prix.",
    image: "https://images.unsplash.com/photo-1571175446050-ef6e6d65e9dc?w=600&q=80",
  },
];

interface CategoryCardProps {
  category?: typeof CATEGORIES[number];
  className?: string;
}

export function CategoryCard({ category = CATEGORIES[0], className }: CategoryCardProps) {
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-100">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50">
            {category.name}
          </h3>
        </div>

        <p className="mt-2 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
          {category.description}
        </p>

        <Button variant="ghost" size="sm" className="mt-4 h-8 w-fit px-2 text-xs">
          Découvrir <ArrowRight className="ml-1 size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function CategoryCardGrid({ categories = CATEGORIES }: { categories?: typeof CATEGORIES }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
