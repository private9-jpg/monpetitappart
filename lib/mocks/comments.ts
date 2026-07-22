import type { Comment } from "@/types/Comment";

export const COMMENTS: Comment[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `c-${i + 1}`,
  author: i % 3 === 0 ? "Alice Martin" : i % 3 === 1 ? "Ben L." : "Claire",
  targetType: "PRODUCT",
  targetId: "1",
  content: `Excellent produit, rapport qualité/prix très intéressant. Livraison rapide et soignée. Je recommande vivement ce modèle pour son design minimaliste.`,
  rating: 4 + (i % 2),
  isPublished: true,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - i * 86400000 + 3600000).toISOString(),
  replies:
    i % 2 === 0
      ? [
          {
            id: `r-${i + 1}-1`,
            author: "Support",
            text: "Merci pour votre retour !",
            createdAt: new Date(Date.now() - i * 86400000 + 3600000).toISOString(),
          },
        ]
      : [],
}));
