import { ArticleCard } from "@/components/article/ArticleCard";

type Article = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
};

export const GUIDES_DATA: Article[] = [
  {
    id: 1,
    title: "Comment choisir son premier appartement",
    excerpt: "Les critères essentiels pour ne pas se tromper lors de votre première acquisition immobilière.",
    category: "Guide",
    date: "2026-07-15",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    author: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
  },
  {
    id: 2,
    title: "Les 10 erreurs à éviter en location",
    excerpt: "Pièges, arnaques et mauvaises surprises : soyez vigilant à chaque étape de votre dossier.",
    category: "Conseils",
    date: "2026-07-10",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    author: {
      name: "Thomas Leroy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 3,
    title: "Optimiser son espace : astuces minimalistes",
    excerpt: "Maximisez chaque mètre carré sans sacrifier le style ni le confort.",
    category: "Décoration",
    date: "2026-07-05",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    author: {
      name: "Sophie Martin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
  },
  {
    id: 4,
    title: "Assurance loyer impayé : mode d'emploi",
    excerpt: "Comprendre les garanties, les plafonds et les exclusions pour bien protéger votre investissement.",
    category: "Assurance",
    date: "2026-06-28",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    author: {
      name: "Lucas Bernard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 5,
    title: "Aménager un studio de 20m²",
    excerpt: "Toutes les astuces pour gagner en confort sans perdre en espace.",
    category: "Aménagement",
    date: "2026-06-20",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    author: {
      name: "Emma Petit",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
  },
  {
    id: 6,
    title: "Déménagement pas cher : le guide complet",
    excerpt: "Budget, calendrier, astuces : tout pour réussir votre déménagement sans se ruiner.",
    category: "Déménagement",
    date: "2026-06-12",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    author: {
      name: "Hugo Martin",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 7,
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
    id: 8,
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
    id: 9,
    title: "Peinture : quelle finition pour quelle pièce",
    excerpt: "Mate, satinée ou brillante : choisissez la finition adaptée à chaque ambiance.",
    category: "Décoration",
    date: "2026-07-08",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    author: {
      name: "Emma Petit",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
  },
  {
    id: 10,
    title: "Colocation : mes droits et devoirs",
    excerpt: "Tout ce qu'il faut savoir avant de signer un bail en colocation.",
    category: "Droit",
    date: "2026-07-12",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    author: {
      name: "Lucas Bernard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 11,
    title: "Comment négocier son loyer",
    excerpt: "Préparez votre dossier et argumentez pour réduire votre budget mensuel.",
    category: "Conseils",
    date: "2026-07-05",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    author: {
      name: "Hugo Martin",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 12,
    title: "Aménager un petit balcon",
    excerpt: "Quelques mètres carrés peuvent devenir un véritable extension de votre logement.",
    category: "Aménagement",
    date: "2026-07-15",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    author: {
      name: "Sophie Martin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
  },
];

export const GUIDES_PAGE_SIZE = 6;

interface GuideGridProps {
  items: Article[];
}

export function GuideGrid({ items }: GuideGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((guide) => (
        <ArticleCard key={guide.id} article={guide} />
      ))}
    </div>
  );
}
