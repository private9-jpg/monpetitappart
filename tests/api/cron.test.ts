import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/cron/route";

const { mockCheckAffiliateLinksHealth, mockAutoUpdateAllPrices, mockCleanupOldComments, mockGenerateDailyReport, mockBackupPostgreSQL, mockSendNotification } = vi.hoisted(() => ({
  mockCheckAffiliateLinksHealth: vi.fn(),
  mockAutoUpdateAllPrices: vi.fn(),
  mockCleanupOldComments: vi.fn(),
  mockGenerateDailyReport: vi.fn(),
  mockBackupPostgreSQL: vi.fn(),
  mockSendNotification: vi.fn(),
}));

vi.mock("@/lib/services/affiliate.service", () => ({
  checkAffiliateLinksHealth: mockCheckAffiliateLinksHealth,
}));

vi.mock("@/lib/services/price-update.service", () => ({
  autoUpdateAllPrices: mockAutoUpdateAllPrices,
}));

vi.mock("@/lib/services/gdpr.service", () => ({
  cleanupOldComments: mockCleanupOldComments,
}));

vi.mock("@/lib/services/report.service", () => ({
  generateDailyReport: mockGenerateDailyReport,
}));

vi.mock("@/lib/services/backup.service", () => ({
  backupPostgreSQL: mockBackupPostgreSQL,
}));

vi.mock("@/lib/services/notification.service", () => ({
  sendNotification: mockSendNotification,
}));

describe("API cron", () => {
  beforeEach(() => {
    mockCheckAffiliateLinksHealth.mockReset();
    mockAutoUpdateAllPrices.mockReset();
    mockCleanupOldComments.mockReset();
    mockGenerateDailyReport.mockReset();
    mockBackupPostgreSQL.mockReset();
    mockSendNotification.mockReset();
  });

  it("requires authentication", async () => {
    process.env.CRON_SECRET = "secret";
    const response = await POST({ headers: new Headers() } as any);
    expect(response.status).toBe(401);
  });

  it("rejects wrong secret", async () => {
    process.env.CRON_SECRET = "secret";
    const response = await POST({
      headers: new Headers({ "x-cron-secret": "wrong" }),
    } as any);
    expect(response.status).toBe(401);
  });

  it("runs all jobs with correct secret", async () => {
    process.env.CRON_SECRET = "secret";
    mockCheckAffiliateLinksHealth.mockResolvedValue({ updated: 5, failed: 0 });
    mockAutoUpdateAllPrices.mockResolvedValue({ updated: 10, failed: 0 });
    mockCleanupOldComments.mockResolvedValue({ deleted: 2 });
    mockGenerateDailyReport.mockResolvedValue({ users: 10, products: 5 });
    mockBackupPostgreSQL.mockResolvedValue({ dumpName: "backup.sql", backupMethod: "pg_dump", size: 1024 });

    const response = await POST({
      headers: new Headers({ "x-cron-secret": "secret" }),
    } as any);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.results.length).toBe(5);
    expect(mockCheckAffiliateLinksHealth).toHaveBeenCalled();
    expect(mockAutoUpdateAllPrices).toHaveBeenCalledWith(100);
    expect(mockCleanupOldComments).toHaveBeenCalledWith(365);
    expect(mockGenerateDailyReport).toHaveBeenCalled();
    expect(mockBackupPostgreSQL).toHaveBeenCalled();
  });

  it("runs selected job", async () => {
    process.env.CRON_SECRET = "secret";
    mockBackupPostgreSQL.mockResolvedValue({ dumpName: "backup.sql", backupMethod: "pg_dump", size: 1024 });

    const response = await POST({
      headers: new Headers({ "x-cron-secret": "secret", "x-cron-jobs": "backup" }),
    } as any);

    const body = await response.json();
    expect(body.results.length).toBe(1);
    expect(body.results[0].job).toBe("backup");
    expect(mockBackupPostgreSQL).toHaveBeenCalled();
  });
});
