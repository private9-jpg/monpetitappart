import type { ArticleListItem } from "@/types/Article";
import { Section } from "@/components/ui/section";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Button } from "@/components/ui/button";

export const FEATURED_ARTICLES: ArticleListItem[] = [
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
    excerpt: "Protégetez votre dépôt de garantie et évitez les mauvaises surprises à la sortie.",
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
    title: "Aménager un petit balcon",
    excerpt: "Quelques mètres carrés peuvent devenir un véritable extension de votre logement.",
    category: "Aménagement",
    date: "2026-07-15",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    author: {
      name: "Sophie Martin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80:w=200&q=80",
    },
  },
  {
    id: 104,
    title: "Colocation : mes droits et devoirs",
    excerpt: "Tout ce qu'il faut savoir avant de signer un bail en colocation.",
    category: "Droit",
    date: "2026-07-12",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    author: {
      name: "Lucas Bernard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e:w=200&q=80",
    },
  },
  {
    id: 105,
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
  {
    id: 106,
    title: "Comment négocier son loyer",
    excerpt: "Préparez votre dossier et argumentez pour réduire votre budget mensuel.",
    category: "Conseils",
    date: "2026-07-05",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    author: {
      name: "Hugo Martin",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e:w=200&q=80",
    },
  },
];

export function FeaturedArticles() {
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center sm:text-left sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
              Articles à la une
            </h2>
            <p className="max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Nos derniers guides et conseils pour réussir votre projet immobilier.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="/guides">Voir tous les guides</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_ARTICLES.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </Section>
  );
}
