export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { trackClick, resolveProductRedirect } from "@/lib/services/affiliate.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = request.headers.get("x-requested-with") || request.nextUrl.searchParams.get("source") || "direct";
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null;
  const userAgent = request.headers.get("user-agent") || null;

  const redirect = await resolveProductRedirect(slug);
  if (!redirect || !redirect.targetUrl) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  if (redirect.affiliateLinkId) {
    await trackClick(redirect.affiliateLinkId, source, ip ?? undefined, userAgent ?? undefined);
  }

  return NextResponse.redirect(redirect.targetUrl, 302);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await request.json().catch(() => ({}));
  const source = body.source || "api";

  const redirect = await resolveProductRedirect(slug);
  if (!redirect) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  if (redirect.affiliateLinkId) {
    await trackClick(redirect.affiliateLinkId, source, undefined, undefined, body.metadata);
  }

  return NextResponse.json({ url: redirect.targetUrl, productId: redirect.product.id }, { status: 200 });
}
