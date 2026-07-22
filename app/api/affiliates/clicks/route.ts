import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clicks = await prisma.affiliateLink.findMany({
    orderBy: { clickCount: "desc" },
    take: 20,
    select: {
      id: true,
      productId: true,
      source: true,
      clickCount: true,
      url: true,
    },
  });

  return NextResponse.json(clicks);
}
