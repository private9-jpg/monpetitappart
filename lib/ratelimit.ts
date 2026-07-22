const stores = new Map<string, { tokens: number; expiresAt: number }[]>();

type RateLimitOptions = {
  key?: string;
  limit?: number;
  windowMs?: number;
};

export function checkRateLimit({ key, limit = 5, windowMs = 60_000 }: RateLimitOptions = {}) {
  const now = Date.now();
  const bucket = key ?? "global";
  const entries = stores.get(bucket) ?? [];
  const allowed: { tokens: number; expiresAt: number }[] = [];

  let tokens = 0;
  for (const entry of entries) {
    if (entry.expiresAt < now) continue;
    allowed.push(entry);
    tokens += 1;
  }

  if (tokens >= limit) {
    stores.set(bucket, allowed);
    return { success: false as const, remaining: Math.max(0, limit - tokens), limit, resetAt: allowed[0]?.expiresAt ?? now + windowMs };
  }

  allowed.push({ tokens: 1, expiresAt: now + windowMs });
  stores.set(bucket, allowed);
  return { success: true as const, remaining: limit - tokens - 1, limit, resetAt: now + windowMs };
}
