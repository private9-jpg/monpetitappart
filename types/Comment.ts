export interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  authorId?: string;
  targetType?: string;
  targetId?: string;
  content: string;
  rating?: number;
  parentCommentId?: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt?: string;
  replies?: CommentReply[];
}
