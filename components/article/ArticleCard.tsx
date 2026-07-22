import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArticleListItem } from "@/types/Article";

interface ArticleMetaProps {
  article: ArticleListItem;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadTime?: boolean;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleMeta({ article, showAuthor, showDate, showReadTime }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500">
      {showDate && (
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M17 4h-1V2h-2v2H7V2H5v2H4a2 2 0 00-2 2v12a2 2 0 002 2h13a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H4V8h13v10z" />
          </svg>
          {formatDate(article.date)}
        </span>
      )}
      {showReadTime && (
        <span className="flex items-center gap-1">
          <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9V9h2v4zm0-6H9V5h2v2z" />
          </svg>
          {article.readTime}
        </span>
      )}
      {showAuthor && (
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-surface-700 dark:text-surface-300">{article.author.name}</span>
        </span>
      )}
    </div>
  );
}

interface ArticleCardProps {
  article?: ArticleListItem;
  variant?: "vertical" | "horizontal" | "featured" | "compact";
  className?: string;
}

export function ArticleCardGrid({ articles, variant = "vertical" }: { articles?: ArticleListItem[]; variant?: ArticleCardProps["variant"] }) {
  const items = articles ?? [];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((article) => (
        <ArticleCard key={article.id} article={article} variant={variant} />
      ))}
    </div>
  );
}

export function ArticleCard({ article, variant = "vertical", className }: ArticleCardProps) {
  const data = article ?? {
    id: 0,
    title: "",
    excerpt: "",
    category: "",
    date: "",
    readTime: "",
    image: "",
    author: { name: "", avatar: "" },
  };

  if (variant === "horizontal") {
    return (
      <article className={`group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
        <div className="relative sm:w-72 md:w-80 shrink-0">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full w-full overflow-hidden bg-surface-100">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            <Badge variant="default" className="w-fit bg-accent-600 text-white hover:bg-accent-700">
              {data.category}
            </Badge>
            <h3 className="text-xl font-semibold leading-snug tracking-tight text-surface-900 line-clamp-2 dark:text-surface-50">
              {data.title}
            </h3>
            <p className="text-sm text-surface-600 line-clamp-2 dark:text-surface-400">{data.excerpt}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <ArticleMeta article={data} showDate showReadTime showAuthor />
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
            src={data.image}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <Badge variant="default" className="bg-white/90 text-surface-900 hover:bg-white backdrop-blur-sm">
              {data.category}
            </Badge>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {data.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">{data.excerpt}</p>
            <div className="mt-4 flex items-center gap-4">
              <ArticleMeta article={data} showDate showReadTime showAuthor />
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
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{data.category}</Badge>
            <ArticleMeta article={data} showDate showReadTime />
          </div>
          <h3 className="text-sm font-semibold leading-snug tracking-tight text-surface-900 line-clamp-1 dark:text-surface-50 sm:text-base">
            {data.title}
          </h3>
          <p className="text-xs text-surface-600 line-clamp-1 dark:text-surface-400 sm:text-sm">{data.excerpt}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-surface-700 dark:text-surface-300">{data.author.name}</span>
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
          src={data.image}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 top-0 flex p-4">
          <Badge variant="default" className="bg-white/90 text-surface-900 hover:bg-white backdrop-blur-sm">
            {data.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ArticleMeta article={data} showDate showReadTime />

        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-surface-900 line-clamp-2 dark:text-surface-50">
          {data.title}
        </h3>

        <p className="mt-2 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
          {data.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{data.author.name}</span>
          </div>

          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            Lire
          </Button>
        </div>
      </div>
    </article>
  );
}
