import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/affiliates/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      affiliateLink: {
        findUnique: vi.fn(() => ({
          id: "link1",
          product: { slug: "test-product" },
          url: "https://example.com",
        })),
        update: vi.fn(() => ({ id: "link1" })),
      },
    },
  };
});

describe("Affiliate redirect", () => {
  it("redirects when product slug and link are valid", async () => {
    const request = {
      nextUrl: new URL("http://localhost/api/affiliates?product=test-product&link=link1"),
    } as any;

    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/");
  });
});
