export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAffiliateLinksHealth } from "@/lib/services/affiliate.service";
import { autoUpdateAllPrices } from "@/lib/services/price-update.service";
import { cleanupOldComments } from "@/lib/services/gdpr.service";
import { generateDailyReport } from "@/lib/services/report.service";
import { backupPostgreSQL } from "@/lib/services/backup.service";
import { sendNotification } from "@/lib/services/notification.service";

type CronJobResult = {
  job: string;
  status: "success" | "error";
  startedAt: string;
  finishedAt: string;
  data?: unknown;
  error?: string;
};

async function runJob(name: string, fn: () => Promise<unknown>): Promise<CronJobResult> {
  const startedAt = new Date().toISOString();
  try {
    const data = await fn();
    return { job: name, status: "success", startedAt, finishedAt: new Date().toISOString(), data };
  } catch (error) {
    return { job: name, status: "error", startedAt, finishedAt: new Date().toISOString(), error: error instanceof Error ? error.message : String(error) };
  }
}

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = request.headers.get("x-cron-secret");

  if (!cronSecret || providedSecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobNames = (request.headers.get("x-cron-jobs") || "").split(",").map((j) => j.trim()).filter(Boolean);
  const jobs = jobNames.length > 0 ? jobNames : ["all"];

  const results: CronJobResult[] = [];

  if (jobs.includes("all") || jobs.includes("links")) {
    results.push(await runJob("check_affiliate_links_health", () => checkAffiliateLinksHealth()));
  }
  if (jobs.includes("all") || jobs.includes("prices")) {
    results.push(await runJob("auto_update_prices", () => autoUpdateAllPrices(100)));
  }
  if (jobs.includes("all") || jobs.includes("gdpr")) {
    results.push(await runJob("cleanup_old_comments", () => cleanupOldComments(365)));
  }
  if (jobs.includes("all") || jobs.includes("report")) {
    results.push(await runJob("daily_report", () => generateDailyReport()));
  }
  if (jobs.includes("all") || jobs.includes("backup")) {
    results.push(await runJob("backup", () => backupPostgreSQL()));
  }

  const hasErrors = results.some((r) => r.status === "error");

  if (hasErrors) {
    await sendNotification({
      to: process.env.NOTIFICATION_EMAIL || "admin@monpetitappart.fr",
      subject: "Cron jobs terminés avec erreurs",
      text: `Job(s) en erreur: ${results.filter((r) => r.status === "error").map((r) => r.job).join(", ")}`,
      event: "cron_error",
      metadata: { results },
    });
  }

  return NextResponse.json({ success: !hasErrors, results }, { status: hasErrors ? 500 : 200 });
}
