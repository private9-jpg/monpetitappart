import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    checks: {},
  };

  try {
    const dbCheck = await prisma.$queryRaw`SELECT 1 as check`;
    (checks.checks as Record<string, unknown>).database = { status: "healthy", result: dbCheck };
  } catch (error) {
    (checks.checks as Record<string, unknown>).database = { status: "unhealthy", error: error instanceof Error ? error.message : String(error) };
    checks.status = "degraded";
  }

  try {
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      (checks.checks as Record<string, unknown>).redis = { status: "healthy" };
    } else {
      (checks.checks as Record<string, unknown>).redis = { status: "not_configured" };
    }
  } catch (error) {
    (checks.checks as Record<string, unknown>).redis = { status: "unhealthy", error: error instanceof Error ? error.message : String(error) };
    checks.status = "degraded";
  }

  const statusCode = checks.status === "healthy" ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}

export async function HEAD(request: NextRequest) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
