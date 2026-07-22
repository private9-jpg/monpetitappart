export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, unauthorized, forbidden, recordAuditLog } from "@/lib/auth";
import { checkAffiliateLinksHealth } from "@/lib/services/affiliate.service";
import { checkProductImages, checkMerchantWebsites } from "@/lib/services/verification.service";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const type = request.nextUrl.searchParams.get("type") || "all";
  const results: Record<string, unknown> = {};

  if (type === "all" || type === "links") {
    results.links = await checkAffiliateLinksHealth();
  }
  if (type === "all" || type === "images") {
    results.images = await checkProductImages();
  }
  if (type === "all" || type === "websites") {
    results.websites = await checkMerchantWebsites();
  }

  await recordAuditLog(request, "run_verification", "System", undefined, { type }, currentUser.id);
  return NextResponse.json(results);
}
