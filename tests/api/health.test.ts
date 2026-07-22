import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";
import { HEAD } from "@/app/api/health/route";

const { mockQueryRaw, mockGetRedis } = vi.hoisted(() => ({
  mockQueryRaw: vi.fn(),
  mockGetRedis: vi.fn(() => null),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
  },
}));

vi.mock("@/lib/redis", () => ({
  getRedis: mockGetRedis,
}));

describe("API health", () => {
  beforeEach(() => {
    mockQueryRaw.mockReset();
  });

  it("returns 200 when database is healthy", async () => {
    mockQueryRaw.mockResolvedValue([{ check: 1 }]);

    const response = await GET({} as any);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body.checks.database.status).toBe("healthy");
  });

  it("returns 503 when database is unhealthy", async () => {
    mockQueryRaw.mockRejectedValue(new Error("Connection refused"));

    const response = await GET({} as any);
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.status).toBe("degraded");
    expect(body.checks.database.status).toBe("unhealthy");
  });

  it("HEAD returns 200 when healthy", async () => {
    mockQueryRaw.mockResolvedValue([{ check: 1 }]);

    const response = await HEAD({} as any);
    expect(response.status).toBe(200);
  });

  it("HEAD returns 503 when database is unhealthy", async () => {
    mockQueryRaw.mockRejectedValue(new Error("Connection refused"));

    const response = await HEAD({} as any);
    expect(response.status).toBe(503);
  });
});
