import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis() {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      redis = new Redis({ url, token });
    }
  }
  return redis;
}

export async function checkRedisRateLimit(key: string, limit: number, windowMs: number): Promise<{ success: boolean; remaining: number; resetAt: number }> {
  const client = getRedis();
  if (!client) {
    return { success: true, remaining: limit, resetAt: Date.now() + windowMs };
  }

  const now = Date.now();
  const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;
  try {
    const count = await client.incr(windowKey);
    if (count === 1) {
      await client.expire(windowKey, Math.ceil(windowMs / 1000));
    }

    const ttl = await client.ttl(windowKey);
    const resetAt = now + (ttl > 0 ? ttl * 1000 : windowMs);
    const remaining = Math.max(0, limit - count);

    return { success: count <= limit, remaining, resetAt };
  } catch {
    return { success: true, remaining: limit, resetAt: now + windowMs };
  }
}

export async function isRedisAvailable(): Promise<boolean> {
  const client = getRedis();
  if (!client) return false;
  try {
    await client.ping();
    return true;
  } catch {
    return false;
  }
}
