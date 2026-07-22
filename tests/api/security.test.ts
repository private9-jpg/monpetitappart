import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/products/route";

const { mockFindMany, mockFindUnique, mockCreate } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockFindUnique: vi.fn(),
  mockCreate: vi.fn(),
}));

const { mockGetUserFromRequest, mockUnauthorized, mockForbidden, mockRecordAuditLog, mockSanitizeObject } = vi.hoisted(() => ({
  mockGetUserFromRequest: vi.fn(),
  mockUnauthorized: vi.fn(() => ({ status: 401, json: () => ({ error: "Unauthorized" }) } as any)),
  mockForbidden: vi.fn(() => ({ status: 403, json: () => ({ error: "Forbidden" }) } as any)),
  mockRecordAuditLog: vi.fn(),
  mockSanitizeObject: vi.fn((obj: any) => obj),
}));

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      product: {
        findMany: mockFindMany,
        findUnique: mockFindUnique,
        create: mockCreate,
      },
    },
  };
});

vi.mock("@/lib/sanitize", () => ({
  sanitizeObject: mockSanitizeObject,
}));

vi.mock("@/lib/auth", () => ({
  getUserFromRequest: mockGetUserFromRequest,
  unauthorized: mockUnauthorized,
  forbidden: mockForbidden,
  recordAuditLog: mockRecordAuditLog,
}));

describe("API security", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
    mockFindUnique.mockReset();
    mockCreate.mockReset();
    mockGetUserFromRequest.mockReset();
    mockUnauthorized.mockReset();
    mockForbidden.mockReset();
    mockRecordAuditLog.mockReset();
    mockSanitizeObject.mockReset();
  });

  it("blocks unauthenticated access to products create", async () => {
    mockGetUserFromRequest.mockResolvedValue(null);
    const response = await POST({ headers: new Headers() } as any);
    expect(response.status).toBe(401);
  });

  it("blocks non-allowed role access to products create", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "MODERATOR" });
    const response = await POST({ headers: new Headers() } as any);
    expect(response.status).toBe(403);
  });

  it("rejects malformed object via zod validation", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "ADMIN" });
    const response = await POST({
      headers: new Headers({ authorization: "Bearer token" }),
      json: async () => ({
        affiliateUrl: "not-a-url",
        priceCents: "abc",
      }),
    } as any);

    expect(response.status).toBe(400);
  });

  it("rejects attacker-controlled long strings", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "ADMIN" });
    const hugeString = "a".repeat(10000);
    const response = await POST({
      headers: new Headers({ authorization: "Bearer token" }),
      json: async () => ({
        name: hugeString,
        slug: "test",
        affiliateUrl: "https://example.com",
      }),
    } as any);

    expect(response.status).toBe(400);
  });

  it("records audit log on authorized action", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "ADMIN" });
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: "prod1", name: "Test" });

    const response = await POST({
      headers: new Headers({ authorization: "Bearer token" }),
      json: async () => ({
        name: "Test",
        slug: "new-product",
        affiliateUrl: "https://example.com",
      }),
    } as any);

    expect(response.status).toBe(201);
    expect(mockRecordAuditLog).toHaveBeenCalled();
  });
});
