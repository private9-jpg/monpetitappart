import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/products/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      product: {
        findMany: vi.fn(() => [
          {
            id: "1",
            name: "Test product",
            slug: "test-product",
            affiliateUrl: "https://example.com",
            isPublished: true,
            publishedAt: new Date(),
            affiliateLinks: [],
          },
        ]),
      },
    },
  };
});

describe("API products", () => {
  it("returns published products", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toMatchObject({ slug: "test-product" });
  });
});
