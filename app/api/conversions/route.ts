export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth";
import { z } from "zod";
import { createConversion, getConversionsByProduct, getRevenueStats, updateConversionStatus } from "@/lib/services/conversion.service";

const conversionCreateSchema = z.object({
  affiliateClickId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  amountCents: z.number().int().positive(),
  currency: z.string().default("EUR"),
  status: z.string().default("PENDING"),
  metadata: z.string().optional(),
});

const conversionUpdateSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED", "REFUNDED"]),
});

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "ANALYST"].includes(currentUser.role)) return forbidden();

  const productId = request.nextUrl.searchParams.get("productId");
  if (productId) {
    const conversions = await getConversionsByProduct(productId);
    return NextResponse.json(conversions);
  }

  const stats = await getRevenueStats();
  return NextResponse.json(stats);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const parsed = conversionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const conversion = await createConversion(parsed.data);
  return NextResponse.json(conversion, { status: 201 });
}

export async function PATCH(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

  const { id } = await context.params;
  const body = await request.json();
  const parsed = conversionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const conversion = await updateConversionStatus(id, parsed.data.status);
  return NextResponse.json(conversion);
}
