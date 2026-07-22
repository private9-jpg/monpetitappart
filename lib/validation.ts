import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
});

export const contactSchema = z.object({
  name: z.string().min(2, { message: "Nom trop court" }).max(100),
  email: z.string().email({ message: "Email invalide" }),
  subject: z.string().min(3, { message: "Sujet trop court" }).max(200),
  message: z.string().min(10, { message: "Message trop court" }).max(5000),
  honey: z.string().optional(),
});

export const trackingClickSchema = z.object({
  affiliateLinkId: z.string().uuid(),
  source: z.string().optional(),
  pageSource: z.string().optional(),
  position: z.number().int().nonnegative().optional(),
  metadata: z.string().optional(),
});

export const commentCreateSchema = z.object({
  content: z.string().min(3).max(2000),
  targetType: z.enum(["PRODUCT", "ARTICLE", "AFFILIATE_LINK"]),
  targetId: z.string().min(1),
  parentCommentId: z.string().uuid().optional(),
  authorName: z.string().min(2).max(100).optional(),
  authorEmail: z.string().email().optional(),
  rating: z.number().int().min(0).max(5).optional(),
});

export const commentModerationSchema = z.object({
  status: z.enum(["PUBLISHED", "REJECTED", "PENDING"]),
  rejectionReason: z.string().max(500).optional(),
});

export const commentReportSchema = z.object({
  reason: z.string().min(3).max(500),
  metadata: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type TrackingClickInput = z.infer<typeof trackingClickSchema>;
export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
export type CommentModerationInput = z.infer<typeof commentModerationSchema>;
export type CommentReportInput = z.infer<typeof commentReportSchema>;
