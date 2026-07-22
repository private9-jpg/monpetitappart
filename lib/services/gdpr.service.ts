import { prisma } from "@/lib/prisma";

export async function exportUserData(userId: string) {
  const [user, comments, reports, auditLogs, sessions] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true } }),
    prisma.comment.findMany({ where: { authorId: userId } }),
    prisma.report.findMany({ where: { reporterId: userId } }),
    prisma.auditLog.findMany({ where: { userId } }),
    prisma.session.findMany({ where: { userId }, select: { id: true, createdAt: true, expiresAt: true } }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user,
    comments,
    reports,
    auditLogs,
    sessions,
  };
}

export async function anonymizeUser(userId: string) {
  const anonymized = `anonymized-${userId.slice(0, 8)}`;

  await prisma.comment.updateMany({
    where: { authorId: userId },
    data: { content: "[Contenu supprimé RGPD]", authorId: null, ipHash: null, userAgent: null },
  });

  await prisma.report.updateMany({
    where: { reporterId: userId },
    data: { reporterId: null },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { email: `${anonymized}@deleted.local`, passwordHash: "", twoFactorSecret: null, twoFactorTempSecret: null, isActive: false },
  });

  await prisma.session.deleteMany({ where: { userId } });

  await prisma.auditLog.create({
    data: { action: "gdpr_anonymize", entity: "User", entityId: userId, metadata: JSON.stringify({ anonymizedAt: new Date().toISOString() }) },
  });

  return { success: true, message: "Utilisateur anonymisé" };
}

export async function deleteUser(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.comment.deleteMany({ where: { authorId: userId } });
  await prisma.report.deleteMany({ where: { reporterId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  await prisma.auditLog.create({
    data: { action: "gdpr_delete", entity: "User", entityId: userId, metadata: JSON.stringify({ deletedAt: new Date().toISOString() }) },
  });

  return { success: true, message: "Utilisateur supprimé" };
}

export async function cleanupOldComments(retentionDays = 365) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);

  const result = await prisma.comment.deleteMany({
    where: { createdAt: { lt: cutoff }, isPublished: false },
  });

  await prisma.auditLog.create({
    data: { action: "gdpr_cleanup", entity: "Comment", metadata: JSON.stringify({ deletedCount: result.count, retentionDays, cutoff: cutoff.toISOString() }) },
  });

  return { deleted: result.count };
}
