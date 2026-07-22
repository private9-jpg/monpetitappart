import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeObject } from "@/lib/sanitize";

export async function parseAndSanitize<T extends z.ZodType>(request: NextRequest, schema: T) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return { success: false as const, response: NextResponse.json({ error: "Requête invalide" }, { status: 400 }) };
  }
  const sanitized = sanitizeObject(body as Record<string, unknown>, 5000);
  const parsed = schema.safeParse(sanitized);
  if (!parsed.success) {
    return { success: false as const, response: NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 }) };
  }
  return { success: true as const, data: parsed.data };
}
