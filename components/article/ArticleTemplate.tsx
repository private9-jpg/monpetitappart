import type { Article } from "@/types/Article";

interface ArticleTemplateProps {
  article: Article;
}

export function ArticleTemplate({ article }: ArticleTemplateProps) {
  return (
    <div>ArticleTemplate {article.title}</div>
  );
}
