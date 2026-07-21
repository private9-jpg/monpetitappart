import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const token = body.token || (await getAuthToken(request));

  if (!token) {
    return NextResponse.json({ error: "Token requis" }, { status: 400 });
  }

  await prisma.session.deleteMany({ where: { token } });
  return NextResponse.json({ success: true });
}
