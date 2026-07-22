import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

const { mockCheckRateLimit, mockAuditLogCreate, mockRecordAuditLog } = vi.hoisted(() => ({
  mockCheckRateLimit: vi.fn(),
  mockAuditLogCreate: vi.fn(),
  mockRecordAuditLog: vi.fn(),
}));

vi.mock("@/lib/ratelimit", () => ({
  checkRateLimit: mockCheckRateLimit,
}));

vi.mock("@/lib/auth", () => ({
  recordAuditLog: mockRecordAuditLog,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: {
      create: mockAuditLogCreate,
    },
  },
}));

describe("API contact", () => {
  beforeEach(() => {
    mockCheckRateLimit.mockReset();
    mockCheckRateLimit.mockReturnValue({ success: true, remaining: 2, limit: 3, resetAt: Date.now() + 60000 });
    mockAuditLogCreate.mockReset();
    mockRecordAuditLog.mockReset();
  });

  it("enforces rate limit", async () => {
    mockCheckRateLimit.mockReturnValue({ success: false, remaining: 0, limit: 3, resetAt: Date.now() + 60000 });

    const response = await POST({
      headers: new Headers(),
      json: async () => ({
        name: "Test",
        email: "test@example.com",
        subject: "Subject",
        message: "This is a test message",
      }),
    } as any);

    expect(response.status).toBe(429);
  });

  it("validates required fields", async () => {
    const response = await POST({
      headers: new Headers(),
      json: async () => ({
        name: "",
        email: "invalid",
        subject: "",
        message: "short",
      }),
    } as any);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toBeDefined();
  });

  it("records audit log for honeypot", async () => {
    mockCheckRateLimit.mockReturnValue({ success: true });
    const response = await POST({
      headers: new Headers(),
      json: async () => ({
        name: "Test",
        email: "test@example.com",
        subject: "Subject",
        message: "This is a test message",
        honey: "filled",
      }),
    } as any);

    expect(response.status).toBe(200);
    expect(mockRecordAuditLog).toHaveBeenCalled();
  });
});
