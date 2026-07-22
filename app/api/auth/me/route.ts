import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, unauthorized } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();

  return NextResponse.json({
    id: currentUser.id,
    email: currentUser.email,
    role: currentUser.role,
    isActive: currentUser.isActive,
    twoFactorEnabled: currentUser.twoFactorEnabled,
  });
}
