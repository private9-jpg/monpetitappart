import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/auth/register/route";
import { POST as LoginPost } from "@/app/api/auth/login/route";

const { mockFindUnique, mockCreate } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockCreate: vi.fn(),
}));

const { mockHash, mockCompare } = vi.hoisted(() => ({
  mockHash: vi.fn(),
  mockCompare: vi.fn(),
}));

const { mockGetUserFromRequest, mockUnauthorized, mockForbidden, mockRecordAuditLog } = vi.hoisted(() => ({
  mockGetUserFromRequest: vi.fn(),
  mockUnauthorized: vi.fn(() => ({ status: 401, json: () => ({ error: "Unauthorized" }) } as any)),
  mockForbidden: vi.fn(() => ({ status: 403, json: () => ({ error: "Forbidden" }) } as any)),
  mockRecordAuditLog: vi.fn(),
}));

const { mockVerify } = vi.hoisted(() => ({
  mockVerify: vi.fn(),
}));

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      user: {
        findUnique: mockFindUnique,
        create: mockCreate,
      },
      session: {
        create: vi.fn(),
      },
    },
  };
});

vi.mock("bcryptjs", () => ({
  hash: mockHash,
  compare: mockCompare,
}));

vi.mock("otplib", () => ({
  verify: mockVerify,
}));

vi.mock("@/lib/auth", () => ({
  getUserFromRequest: mockGetUserFromRequest,
  unauthorized: mockUnauthorized,
  forbidden: mockForbidden,
  recordAuditLog: mockRecordAuditLog,
}));

describe("API auth register", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockCreate.mockReset();
    mockHash.mockReset();
    mockRecordAuditLog.mockReset();
    mockGetUserFromRequest.mockReset();
  });

  it("requires authentication", async () => {
    mockGetUserFromRequest.mockResolvedValue(null);
    const response = await POST({ headers: new Headers() } as any);
    expect(response.status).toBe(401);
  });

  it("requires admin role", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "WRITER" });
    const response = await POST({ headers: new Headers() } as any);
    expect(response.status).toBe(403);
  });

  it("validates required fields", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "ADMIN" });
    const response = await POST({
      headers: new Headers({ authorization: "Bearer token" }),
      json: async () => ({}),
    } as any);
    expect(response.status).toBe(400);
  });

  it("rejects invalid role", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "ADMIN" });
    mockHash.mockResolvedValue("hashed");
    const response = await POST({
      headers: new Headers({ authorization: "Bearer token" }),
      json: async () => ({
        email: "new@example.com",
        password: "secret123",
        role: "INVALID",
      }),
    } as any);
    expect(response.status).toBe(400);
  });

  it("prevents duplicate email", async () => {
    mockGetUserFromRequest.mockResolvedValue({ id: "user1", role: "ADMIN" });
    mockHash.mockResolvedValue("hashed");
    mockFindUnique.mockResolvedValue({ id: "existing" });
    const response = await POST({
      headers: new Headers({ authorization: "Bearer token" }),
      json: async () => ({
        email: "existing@example.com",
        password: "secret123",
      }),
    } as any);
    expect(response.status).toBe(409);
  });
});

describe("API auth login", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockCreate.mockReset();
    mockCompare.mockReset();
    mockVerify.mockReset();
    mockRecordAuditLog.mockReset();
    mockGetUserFromRequest.mockReset();
  });

  it("validates required fields", async () => {
    const response = await LoginPost({ json: async () => ({}) } as any);
    expect(response.status).toBe(400);
  });

  it("returns 404 for unknown email", async () => {
    mockFindUnique.mockResolvedValue(null);
    const response = await LoginPost({
      json: async () => ({ email: "unknown@example.com", password: "secret" }),
    } as any);
    expect(response.status).toBe(404);
  });

  it("returns 403 for inactive user", async () => {
    mockFindUnique.mockResolvedValue({ id: "user1", isActive: false, passwordHash: "hash" });
    const response = await LoginPost({
      json: async () => ({ email: "user@example.com", password: "secret" }),
    } as any);
    expect(response.status).toBe(403);
  });

  it("returns 401 for invalid password", async () => {
    mockFindUnique.mockResolvedValue({ id: "user1", isActive: true, passwordHash: "hash" });
    mockCompare.mockResolvedValue(false);
    const response = await LoginPost({
      json: async () => ({ email: "user@example.com", password: "wrong" }),
    } as any);
    expect(response.status).toBe(401);
  });
});

describe("API auth login 2fa", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockCompare.mockReset();
    mockVerify.mockReset();
    mockRecordAuditLog.mockReset();
  });

  it("requires 2FA code when enabled", async () => {
    mockFindUnique.mockResolvedValue({ id: "user1", isActive: true, passwordHash: "hash", twoFactorEnabled: true, twoFactorSecret: "secret" });
    mockCompare.mockResolvedValue(true);
    const response = await LoginPost({
      json: async () => ({ email: "user@example.com", password: "secret" }),
    } as any);
    expect(response.status).toBe(401);
  });

  it("accepts valid 2FA code", async () => {
    mockFindUnique.mockResolvedValue({ id: "user1", isActive: true, passwordHash: "hash", twoFactorEnabled: true, twoFactorSecret: "secret" });
    mockCompare.mockResolvedValue(true);
    mockVerify.mockResolvedValue({ valid: true });

    const response = await LoginPost({
      json: async () => ({ email: "user@example.com", password: "secret", twoFactorCode: "123456" }),
    } as any);
    expect(response.status).toBe(200);
  });
});
