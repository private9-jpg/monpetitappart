import type { Comment } from "@/types/Comment";
import { COMMENTS } from "@/lib/mocks/comments";

export async function getCommentsByTarget(targetType: string, targetId: string): Promise<Comment[]> {
  return COMMENTS.filter((c) => c.targetType === targetType && c.targetId === targetId);
}

export async function createComment(input: {
  targetType: string;
  targetId: string;
  content: string;
}): Promise<Comment> {
  const created: Comment = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    author: "",
    targetType: input.targetType,
    targetId: input.targetId,
    content: input.content,
    isPublished: true,
    createdAt: new Date().toISOString(),
  };
  return created;
}
