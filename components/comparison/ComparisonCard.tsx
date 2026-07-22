import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

type Comparison = {
  id: number;
  title: string;
  description: string;
  image: string;
  productCount: number;
  updatedAt: string;
  href: string;
};

const COMPARISONS: Comparison[] = [
  {
    id: 1,
    title: "Assurance loyer impayé : quelle formule choisir ?",
    description: "Comparez les meilleures offres pour protéger votre investissement locatif.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    productCount: 3,
    updatedAt: "2026-07-20",
    href: "#",
  },
  {
    id: 2,
    title: "Garantie risque locatif : les meilleures solutions",
    description: "Trouvez la garantie adaptée à votre profil et à votre budget.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    productCount: 4,
    updatedAt: "2026-07-18",
    href: "#",
  },
  {
    id: 3,
    title: "Gestion locative : outils et services",
    description: "Comparatif des services de gestion pour propriétaires bailleurs.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    productCount: 5,
    updatedAt: "2026-07-15",
    href: "#",
  },
  {
    id: 4,
    title: "Assurance habitation : comparez les offres",
    description: "Trouvez la meilleure protection pour votre logement.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    productCount: 6,
    updatedAt: "2026-07-12",
    href: "#",
  },
  {
    id: 5,
    title: "Crédit immobilier : taux et conditions",
    description: "Comparez les offres de prêt pour financer votre projet.",
    image: "https://images.unsplash.com/photo-1586281370619-e54e2ce9e3af?w=800&q=80",
    productCount: 4,
    updatedAt: "2026-07-08",
    href: "#",
  },
  {
    id: 6,
    title: "Déménagement : quel service choisir",
    description: "Comparez les entreprises de déménagement sur prix et services.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    productCount: 5,
    updatedAt: "2026-07-05",
    href: "#",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ComparisonCardProps {
  comparison?: Comparison;
  className?: string;
}

export function ComparisonCard({ comparison = COMPARISONS[0], className }: ComparisonCardProps) {
  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-100">
        <Image
          src={comparison.image}
          alt={comparison.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 top-0 flex p-4">
          <Badge variant="default" className="bg-white/90 text-surface-900 hover:bg-white backdrop-blur-sm">
            {comparison.productCount} produits
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-surface-900 line-clamp-2 dark:text-surface-50">
          {comparison.title}
        </h3>

        <p className="mt-2 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
          {comparison.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs text-surface-500">
          <Calendar className="size-3.5" />
          <span>Mis à jour le {formatDate(comparison.updatedAt)}</span>
        </div>

        <div className="mt-auto pt-5">
          <Button asChild className="w-full">
            <a href={comparison.href}>Voir le comparatif</a>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ComparisonCardGrid({ comparisons = COMPARISONS }: { comparisons?: Comparison[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {comparisons.map((comparison) => (
        <ComparisonCard key={comparison.id} comparison={comparison} />
      ))}
    </div>
  );
}
