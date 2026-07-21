import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, unauthorized } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!['ADMIN', 'EDITOR'].includes(currentUser.role)) return forbidden();

  const products = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { affiliateLinks: true },
  });

  return NextResponse.json(products);
}

export async function DELETE(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== 'ADMIN') return forbidden();

  const { slug } = await request.json();
  if (!slug) {
    return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
  }

  await prisma.product.deleteMany({ where: { slug } });
  return NextResponse.json({ success: true });
}
