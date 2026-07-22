export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats, getRecentActivity, getTopPerformingContent } from "@/lib/services/dashboard.service";
import { getUserFromRequest, unauthorized } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "ANALYST"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const [stats, recentActivity, topContent] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(10),
    getTopPerformingContent(5),
  ]);

  return NextResponse.json({ stats, recentActivity, topContent });
}
