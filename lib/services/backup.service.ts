import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { sendNotification } from "./notification.service";

const DEFAULT_BACKUP_DIR = process.env.BACKUP_DIR || "backups";

async function ensureBackupDir(dir: string): Promise<void> {
  try {
    await import("node:fs/promises").then((m) => m.mkdir(dir, { recursive: true }));
  } catch {
    // ignore directory creation errors; writing will fail later if unusable
  }
}

async function writeFileAtomic(path: string, content: string): Promise<void> {
  const { constants } = await import("node:fs");
  const { access, rename, writeFile } = await import("node:fs/promises");
  const tmpPath = `${path}.tmp`;

  await writeFile(tmpPath, content, { encoding: "utf8", mode: 0o600 });
  try {
    await access(path, constants.W_OK);
  } catch {
    // file does not exist yet; rename is fine
  }
  await rename(tmpPath, path);
}

export async function backupPostgreSQL() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dumpName = `backup-${timestamp}.sql`;

  let dumpContent = "";
  let backupMethod = "json_fallback";

  try {
    const { exec } = await import("node:child_process");
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const url = new URL(dbUrl);
      const user = url.username;
      const password = url.password;
      const host = url.hostname;
      const port = url.port || "5432";
      const database = url.pathname.replace(/^\//, "");

      const env = { ...process.env, PGPASSWORD: password };
      const command = `pg_dump -U ${user} -h ${host} -p ${port} -d ${database} --no-owner --no-privileges`;

      dumpContent = await new Promise<string>((resolve, reject) => {
        exec(command, { env }, (error, stdout) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });
      backupMethod = "pg_dump";
    }
  } catch {
    dumpContent = "";
    backupMethod = "json_fallback";
  }

  try {
    await ensureBackupDir(DEFAULT_BACKUP_DIR);

    if (dumpContent) {
      const sqlPath = `${DEFAULT_BACKUP_DIR}/${dumpName}`;
      await writeFileAtomic(sqlPath, dumpContent);
      logger.info("Backup SQL written", { path: sqlPath, size: dumpContent.length });
    } else {
      const tables = ["User", "Article", "Product", "Merchant", "ProductOffer", "PriceHistory", "Comment", "NewsletterSubscriber", "AuditLog", "Report", "AffiliateLink", "AffiliateClick", "Conversion", "Redirect"];
      const data: Record<string, unknown[]> = {};

      for (const table of tables) {
        try {
          const result = await (prisma as any)[table.toLowerCase()].findMany();
          data[table] = result;
        } catch {
          data[table] = [];
        }
      }

      const jsonContent = JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2);
      const jsonName = dumpName.replace(/\.sql$/, ".json");
      const jsonPath = `${DEFAULT_BACKUP_DIR}/${jsonName}`;
      await writeFileAtomic(jsonPath, jsonContent);
      logger.warn("pg_dump failed, JSON fallback written", { path: jsonPath, size: jsonContent.length });
      dumpContent = jsonContent;
    }

    await sendNotification({
      to: process.env.NOTIFICATION_EMAIL || "admin@monpetitappart.fr",
      subject: `Sauvegarde ${backupMethod === "pg_dump" ? "SQL" : "JSON"} - ${timestamp}`,
      text: `Sauvegarde effectuée: ${dumpName}\nMéthode: ${backupMethod}\nTaille: ${dumpContent.length} octets`,
      event: "backup",
      metadata: { dumpName, backupMethod, size: dumpContent.length },
    });

    return { dumpName, backupMethod, size: dumpContent.length };
  } catch (error) {
    logger.error("Backup failed", error);
    throw error;
  }
}
