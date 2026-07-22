export interface ArticleAuthor {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ArticleAuthorCard {
  name: string;
  avatar: string;
}

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ArticleContent {
  html: string;
  headings: ArticleHeading[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description?: string;
  category: string;
  image: string;
  author: ArticleAuthor;
  date: string;
  readTime: string;
  content: ArticleContent;
  affiliate?: {
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
  };
  relatedArticleIds?: string[];
  status?: string;
  isFeatured?: boolean;
  publishedAt?: string;
}

export interface ArticleListItem {
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
}
