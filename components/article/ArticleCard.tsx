import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";

const ARTICLES = [
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
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ArticleMetaProps {
  article: typeof ARTICLES[number];
  showAuthor?: boolean;
  showDate?: boolean;
  showReadTime?: boolean;
}

function ArticleMeta({ article, showAuthor, showDate, showReadTime }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500">
      <span className="flex items-center gap-1">
        <Calendar className="size-3.5" />
        {formatDate(article.date)}
      </span>
      {showReadTime && (
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          {article.readTime}
        </span>
      )}
      {showAuthor && (
        <span className="flex items-center gap-1.5">
          <Avatar className="size-5">
            <AvatarImage src={article.author.avatar} alt={article.author.name} />
            <AvatarFallback className="text-[10px]">{article.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-surface-700 dark:text-surface-300">{article.author.name}</span>
        </span>
      )}
    </div>
  );
}

interface ArticleCardProps {
  article?: typeof ARTICLES[number];
  variant?: "vertical" | "horizontal" | "featured" | "compact";
  className?: string;
}

export function ArticleCard({ article = ARTICLES[0], variant = "vertical", className }: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <article className={`group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
        <div className="relative sm:w-72 md:w-80 shrink-0">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full w-full overflow-hidden bg-surface-100">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            <Badge variant="default" className="w-fit bg-accent-600 text-white hover:bg-accent-700">
              {article.category}
            </Badge>
            <h3 className="text-xl font-semibold leading-snug tracking-tight text-surface-900 line-clamp-2 dark:text-surface-50">
              {article.title}
            </h3>
            <p className="text-sm text-surface-600 line-clamp-2 dark:text-surface-400">{article.excerpt}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <ArticleMeta article={article} showDate showReadTime showAuthor />
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">Lire</Button>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className={`group relative flex flex-col overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-100">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <Badge variant="default" className="bg-white/90 text-surface-900 hover:bg-white backdrop-blur-sm">
              {article.category}
            </Badge>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {article.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">{article.excerpt}</p>
            <div className="mt-4 flex items-center gap-4">
              <ArticleMeta article={article} showDate showReadTime showAuthor />
              <Button variant="secondary" size="sm" className="h-8 bg-white text-surface-900 hover:bg-white/90">Lire l'article</Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={`group flex items-start gap-4 rounded-xl border border-surface-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-100 sm:size-24">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{article.category}</Badge>
            <ArticleMeta article={article} showDate showReadTime />
          </div>
          <h3 className="text-sm font-semibold leading-snug tracking-tight text-surface-900 line-clamp-1 dark:text-surface-50 sm:text-base">
            {article.title}
          </h3>
          <p className="text-xs text-surface-600 line-clamp-1 dark:text-surface-400 sm:text-sm">{article.excerpt}</p>
          <div className="mt-1 flex items-center gap-2">
            <Avatar className="size-5">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback className="text-[10px]">{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-surface-700 dark:text-surface-300">{article.author.name}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 text-xs">Lire</Button>
      </article>
    );
  }

  return (
    <article className={`group flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-100">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 top-0 flex p-4">
          <Badge variant="default" className="bg-white/90 text-surface-900 hover:bg-white backdrop-blur-sm">
            {article.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ArticleMeta article={article} showDate showReadTime />

        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-surface-900 line-clamp-2 dark:text-surface-50">
          {article.title}
        </h3>

        <p className="mt-2 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{article.author.name}</span>
          </div>

          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            Lire
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ArticleCardGrid({ articles = ARTICLES, variant = "vertical" }: { articles?: typeof ARTICLES; variant?: ArticleCardProps["variant"] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant={variant} />
      ))}
    </div>
  );
}
