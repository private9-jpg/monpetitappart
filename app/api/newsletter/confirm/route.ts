export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { confirmNewsletterSubscription } from "@/lib/services/newsletter.service";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token requis" }, { status: 400 });
  }

  const result = await confirmNewsletterSubscription(token);
  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: result.message });
}
