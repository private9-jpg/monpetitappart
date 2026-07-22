export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth";
import { checkAffiliateLinksHealth } from "@/lib/services/affiliate.service";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const result = await checkAffiliateLinksHealth();
  return NextResponse.json(result);
}
