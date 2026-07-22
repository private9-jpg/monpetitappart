export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, unauthorized, recordAuditLog } from "@/lib/auth";
import { exportUserData, anonymizeUser, deleteUser, cleanupOldComments } from "@/lib/services/gdpr.service";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const action = request.nextUrl.searchParams.get("action");
  if (action === "export") {
    const data = await exportUserData(currentUser.id);
    await recordAuditLog(request, "gdpr_export", "User", currentUser.id, undefined, currentUser.id);
    return NextResponse.json(data);
  }

  return NextResponse.json({ message: "RGPD endpoint. Use ?action=export for data export." });
}

export async function DELETE(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const anonymize = body.anonymize === true;

  if (anonymize) {
    const result = await anonymizeUser(currentUser.id);
    await recordAuditLog(request, "gdpr_anonymize", "User", currentUser.id, undefined, currentUser.id);
    return NextResponse.json(result);
  }

  const result = await deleteUser(currentUser.id);
  await recordAuditLog(request, "gdpr_delete", "User", currentUser.id, undefined, currentUser.id);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "cleanup") {
    const retentionDays = typeof body.retentionDays === "number" ? body.retentionDays : 365;
    const result = await cleanupOldComments(retentionDays);
    await recordAuditLog(request, "gdpr_cleanup", "Comment", undefined, { retentionDays, deleted: result.deleted }, currentUser.id);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
