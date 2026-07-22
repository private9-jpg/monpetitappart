"use client";

import type { Comment, CommentReply } from "@/types/Comment";

type CommentCardProps = {
  comment: Comment;
};

export function CommentCard({ comment }: CommentCardProps) {
  const totalReplies = comment.replies?.length ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{comment.author}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        {comment.rating != null && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{comment.rating}/5</span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{comment.content}</p>

      {totalReplies > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {comment.replies?.map((reply) => (
            <div
              key={reply.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{reply.author}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(reply.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
