import type { ArticleListItem } from "@/types/Article";
import { ARTICLES } from "@/lib/mocks/articles";

export const BLOG_POSTS: ArticleListItem[] = ARTICLES;

export const BLOG_CATEGORIES = [
  "Tous",
  "Guide",
  "Conseils",
  "Décoration",
  "Aménagement",
  "Assurance",
  "Déménagement",
  "Location",
  "Droit",
];

export const BLOG_PAGE_SIZE = 6;
