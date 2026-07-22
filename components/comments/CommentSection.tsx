"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { CommentCard } from "@/components/comments/CommentCard";
import { CommentForm } from "@/components/comments/CommentForm";
import { Button } from "@/components/ui/button";
import { getCommentsByTarget, createComment } from "@/lib/services/comment.service";
import type { Comment } from "@/types/Comment";

type CommentSectionProps = {
  targetType?: string;
  targetId?: string;
};

export function CommentSection({ targetType = "PRODUCT", targetId = "1" }: CommentSectionProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommentsByTarget(targetType, targetId);
      setComments(data as Comment[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [targetType, targetId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (text: string) => {
    const created = await createComment({
      targetType,
      targetId,
      content: text,
    });

    const newComment: Comment = {
      id: created.id,
      author: created.author ?? "Vous",
      targetType: created.targetType,
      targetId: created.targetId,
      content: created.content,
      rating: created.rating,
      isPublished: created.isPublished,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Commentaires</h2>
      <CommentForm onSubmit={handleSubmit} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {loading && (
          <div className="space-y-4">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Aucun commentaire pour le moment.</p>
        )}
        {!loading &&
          comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>
          Précédent
        </Button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page 1 / 1
        </span>
        <Button variant="secondary" size="sm" disabled>
          Suivant
        </Button>
      </div>
    </section>
  );
}

function Skeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}
