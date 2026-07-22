import { logger } from "@/lib/logger";

type NotificationPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  event: string;
  metadata?: Record<string, unknown>;
};

const inMemoryNotifications: NotificationPayload[] = [];

export async function sendNotification(payload: NotificationPayload) {
  const record = { ...payload, createdAt: new Date().toISOString() };
  inMemoryNotifications.push(record);

  if (process.env.RESEND_API_KEY && payload.to) {
    try {
      const { Resend } = await import("resend");
      const client = new Resend(process.env.RESEND_API_KEY);
      const sendOptions = {
        from: "Mon Petit Appart <no-reply@monpetitappart.fr>",
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      };
      await (client.emails.send as any)(sendOptions);
    } catch (error) {
      logger.error("Failed to send email notification", error);
      throw error;
    }
  }

  return record;
}

export async function notifyCommentPublished(commentId: string, targetType: string, targetId: string) {
  return sendNotification({
    to: process.env.NOTIFICATION_EMAIL || "admin@monpetitappart.fr",
    subject: "Nouveau commentaire publié",
    text: `Commentaire ${commentId} publié sur ${targetType} ${targetId}`,
    event: "comment_published",
    metadata: { commentId, targetType, targetId },
  });
}

export async function notifyCommentRejected(commentId: string, reason?: string) {
  return sendNotification({
    to: process.env.NOTIFICATION_EMAIL || "admin@monpetitappart.fr",
    subject: "Commentaire rejeté",
    text: `Commentaire ${commentId} rejeté${reason ? `: ${reason}` : ""}`,
    event: "comment_rejected",
    metadata: { commentId, reason },
  });
}

export async function notifyNewReport(reportId: string, targetType: string, targetId: string, reason: string) {
  return sendNotification({
    to: process.env.NOTIFICATION_EMAIL || "admin@monpetitappart.fr",
    subject: "Nouveau signalement",
    text: `Signalement ${reportId} sur ${targetType} ${targetId}: ${reason}`,
    event: "new_report",
    metadata: { reportId, targetType, targetId, reason },
  });
}

export function getNotificationHistory() {
  return inMemoryNotifications;
}
