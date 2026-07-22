export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth";
import { z } from "zod";
import { getPriceHistory, recordPriceHistory } from "@/lib/services/price.service";

const priceQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  offerId: z.string().uuid().optional(),
  merchantId: z.string().uuid().optional(),
  limit: z.coerce.number().int().positive().max(500).default(100),
});

const priceRecordSchema = z.object({
  productId: z.string().uuid().optional(),
  offerId: z.string().uuid().optional(),
  merchantId: z.string().uuid().optional(),
  priceCents: z.number().int().positive(),
  currency: z.string().default("EUR"),
});

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "ANALYST"].includes(currentUser.role)) return forbidden();

  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = priceQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { productId, offerId, merchantId, limit } = parsed.data;
  const history = await getPriceHistory(productId, offerId, merchantId, limit);
  return NextResponse.json(history);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const parsed = priceRecordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const record = await recordPriceHistory(parsed.data);
  return NextResponse.json(record, { status: 201 });
}
