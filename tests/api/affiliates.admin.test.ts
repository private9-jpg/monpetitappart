import { describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/affiliates/admin/route";

vi.mock("@/lib/auth", () => ({
  getUserFromRequest: vi.fn(() => ({ id: "user1", role: "EDITOR" })),
  unauthorized: () => ({ status: 401, json: () => ({ error: "Unauthorized" }) }),
  forbidden: () => ({ status: 403, json: () => ({ error: "Forbidden" }) }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    affiliateLink: {
      findMany: vi.fn(() => [{ id: "link1", source: "source", url: "https://example.com", clickCount: 5, product: { id: "prod1", name: "Test", slug: "test" } }]),
      create: vi.fn((data) => ({ id: "link1", ...data })),
    },
    product: {
      findUnique: vi.fn(() => ({ id: "prod1" })),
    },
  },
}));

describe("Affiliate admin API", () => {
  it("returns affiliate links for admin/editor", async () => {
    const response = await GET({} as any);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
