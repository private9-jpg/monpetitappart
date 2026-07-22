import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken, recordAuditLog } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const token = body.token || (await getAuthToken(request));

  if (!token) {
    return NextResponse.json({ error: "Token requis" }, { status: 400 });
  }

  const session = await prisma.session.findUnique({ where: { token } });
  if (session) {
    await recordAuditLog(request, "logout", "User", session.userId, undefined, session.userId);
  }

  await prisma.session.deleteMany({ where: { token } });
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "auth_token",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}
