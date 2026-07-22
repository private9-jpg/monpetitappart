export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, unauthorized, forbidden, recordAuditLog } from "@/lib/auth";
import { autoUpdateAllPrices, batchUpdatePrices } from "@/lib/services/price-update.service";

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const body = await request.json().catch(() => ({}));
  const productIds = body.productIds as string[] | undefined;
  const limit = typeof body.limit === "number" ? body.limit : 100;

  let result;
  if (productIds && productIds.length > 0) {
    result = await batchUpdatePrices(productIds);
  } else {
    result = await autoUpdateAllPrices(limit);
  }

  await recordAuditLog(request, "auto_update_prices", "Product", undefined, { updated: result.updated, skipped: result.skipped }, currentUser.id);
  return NextResponse.json(result);
}
