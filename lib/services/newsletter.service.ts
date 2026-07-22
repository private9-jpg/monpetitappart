import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "./notification.service";

export async function subscribeToNewsletter(email: string, _ip?: string) {
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing) {
    if (!existing.isSubscribed) {
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { optInToken: token, optInExpiresAt: expiresAt, isSubscribed: false },
      });
      await sendNotification({
        to: email,
        subject: "Confirmez votre inscription",
        text: `Cliquez sur ce lien pour confirmer: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/newsletter/confirm?token=${token}`,
        event: "newsletter_optin",
        metadata: { email },
      });
      return { status: "pending_confirmation", message: "Email de confirmation envoyé" };
    }
    return { status: "already_subscribed", message: "Vous êtes déjà inscrit" };
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const unsubscribeToken = uuidv4();

  await prisma.newsletterSubscriber.create({
    data: {
      email,
      isSubscribed: false,
      optInToken: token,
      optInExpiresAt: expiresAt,
      unsubscribeToken,
    },
  });

  await sendNotification({
    to: email,
    subject: "Confirmez votre inscription",
    text: `Cliquez sur ce lien pour confirmer: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/newsletter/confirm?token=${token}`,
    event: "newsletter_optin",
    metadata: { email },
  });

  return { status: "pending_confirmation", message: "Email de confirmation envoyé" };
}

export async function confirmNewsletterSubscription(token: string) {
  const subscriber = await prisma.newsletterSubscriber.findFirst({
    where: { optInToken: token },
  });

  if (!subscriber) {
    return { success: false, message: "Token invalide" };
  }

  if (subscriber.optInExpiresAt && subscriber.optInExpiresAt < new Date()) {
    return { success: false, message: "Token expiré" };
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { isSubscribed: true, subscribedAt: new Date(), optInToken: null, optInExpiresAt: null },
  });

  await sendNotification({
    to: subscriber.email,
    subject: "Inscription confirmée",
    text: "Votre inscription à la newsletter est confirmée.",
    event: "newsletter_confirmed",
    metadata: { email: subscriber.email },
  });

  return { success: true, message: "Inscription confirmée" };
}

export async function unsubscribeNewsletter(token: string) {
  const subscriber = await prisma.newsletterSubscriber.findFirst({
    where: { unsubscribeToken: token },
  });

  if (!subscriber) {
    return { success: false, message: "Token invalide" };
  }

  await prisma.newsletterSubscriber.update({
    where: { id: subscriber.id },
    data: { isSubscribed: false, unsubscribedAt: new Date() },
  });

  await sendNotification({
    to: subscriber.email,
    subject: "Désinscription confirmée",
    text: "Vous avez été désinscrit de la newsletter.",
    event: "newsletter_unsubscribed",
    metadata: { email: subscriber.email },
  });

  return { success: true, message: "Désinscription confirmée" };
}

export async function listNewsletters(filters?: { isSubscribed?: boolean; limit?: number }) {
  const where: Record<string, unknown> = {};
  if (filters?.isSubscribed !== undefined) where.isSubscribed = filters.isSubscribed;

  return prisma.newsletterSubscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: filters?.limit ?? 100,
  });
}

export async function getNewsletterHistory(email: string) {
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (!subscriber) return null;

  return {
    email: subscriber.email,
    isSubscribed: subscriber.isSubscribed,
    subscribedAt: subscriber.subscribedAt,
    unsubscribedAt: subscriber.unsubscribedAt,
    createdAt: subscriber.createdAt,
  };
}
