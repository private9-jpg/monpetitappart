import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArticleListItem } from "@/types/Article";

const DEFAULT_RELATED: ArticleListItem[] = [
  {
    id: 101,
    title: "Louer sans garant : mode d'emploi",
    excerpt: "Solutions, assurances et astuces pour convaincre un propriétaire même sans garant.",
    category: "Location",
    date: "2026-07-20",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    author: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
  },
  {
    id: 102,
    title: "5 erreurs à éviter lors d'un état des lieux",
    excerpt: "Protégez votre dépôt de garantie et évitez les mauvaises surprises à la sortie.",
    category: "Conseils",
    date: "2026-07-18",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    author: {
      name: "Thomas Leroy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 103,
    title: "Peinture : quelle finition pour quelle pièce",
    excerpt: "Mate, satinée ou brillante : choisissez la finition adaptée à chaque ambiance.",
    category: "Décoration",
    date: "2026-07-08",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    author: {
      name: "Emma Petit",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330:w=200&q=80",
    },
  },
];

interface RelatedArticlesProps {
  articles?: ArticleListItem[];
  className?: string;
}

export function RelatedArticles({ articles = DEFAULT_RELATED }: RelatedArticlesProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-surface-900 dark:text-surface-50">
          Articles similaires
        </h2>
        <p className="text-sm text-surface-600 dark:text-surface-400">
          Découvrez d'autres contenus qui pourraient vous intéresser.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id} className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">{article.title}</p>
            <p className="text-xs text-surface-500">{article.author.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
