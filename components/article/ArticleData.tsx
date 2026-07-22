import type { Article, ArticleListItem } from "@/types/Article";
import { ARTICLE_BY_SLUG, FALLBACK_ARTICLES } from "@/lib/mocks/articles";

export type { Article, ArticleListItem };

export { ARTICLE_BY_SLUG, FALLBACK_ARTICLES };

export function getArticleBySlug(slug: string): Article {
  if (slug in ARTICLE_BY_SLUG) {
    return ARTICLE_BY_SLUG[slug];
  }
  return FALLBACK_ARTICLES[0];
}

export function getRelatedArticles(currentId: string, relatedIds: string[]): Article[] {
  const fallback = FALLBACK_ARTICLES.filter((a) => a.id !== currentId);
  if (!relatedIds.length) return fallback.slice(0, 3);
  return relatedIds
    .map((id) => Object.values(ARTICLE_BY_SLUG).find((a) => a.id === id))
    .filter((article): article is Article => Boolean(article));
}
