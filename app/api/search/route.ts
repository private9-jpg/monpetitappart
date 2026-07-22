export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchArticlesAndProducts } from "@/lib/services/search.service";

const searchSchema = z.object({ q: z.string().min(1).max(200), limit: z.coerce.number().int().positive().max(50).default(20) });

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = searchSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const results = await searchArticlesAndProducts(parsed.data.q, parsed.data.limit);
  return NextResponse.json({ query: parsed.data.q, ...results });
}
