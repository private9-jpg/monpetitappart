import { prisma } from "@/lib/prisma";

export interface ProductImportRow {
  name: string;
  slug: string;
  description?: string;
  priceCents?: number;
  currency?: string;
  merchant?: string;
  affiliateUrl?: string;
  productUrl?: string;
  imageUrl?: string;
  category?: string;
  isPublished?: boolean;
}

export interface ProductImportResult {
  imported: number;
  skipped: number;
  errors: Array<{ row: number; reason: string }>;
}

export async function importProducts(rows: ProductImportRow[]): Promise<ProductImportResult> {
  const result: ProductImportResult = { imported: 0, skipped: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!row.name || !row.slug) {
      result.errors.push({ row: i + 1, reason: "name et slug requis" });
      result.skipped++;
      continue;
    }

    const slug = row.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const existing = await prisma.product.findUnique({ where: { slug } });

    if (existing) {
      await prisma.product.update({
        where: { slug },
        data: {
          name: row.name,
          description: row.description,
          priceCents: row.priceCents,
          currency: row.currency ?? "EUR",
          merchant: row.merchant,
          affiliateUrl: row.affiliateUrl,
          productUrl: row.productUrl,
          imageUrl: row.imageUrl,
          isPublished: row.isPublished ?? false,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: row.name,
          slug,
          description: row.description,
          priceCents: row.priceCents,
          currency: row.currency ?? "EUR",
          merchant: row.merchant ?? null,
          affiliateUrl: row.affiliateUrl ?? "",
          productUrl: row.productUrl,
          imageUrl: row.imageUrl,
          isPublished: row.isPublished ?? false,
        },
      });
    }

    result.imported++;
  }

  return result;
}

export async function exportProducts(filters?: { isPublished?: boolean; limit?: number }) {
  const where: Record<string, unknown> = {};
  if (filters?.isPublished !== undefined) where.isPublished = filters.isPublished;

  const products = await prisma.product.findMany({
    where,
    take: filters?.limit ?? 1000,
    orderBy: { createdAt: "desc" },
    include: { merchantRel: true, offers: true },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    priceCents: p.priceCents,
    currency: p.currency,
    merchant: p.merchantRel?.name ?? p.merchant,
    merchantId: p.merchantId,
    affiliateUrl: p.affiliateUrl,
    productUrl: p.productUrl,
    imageUrl: p.imageUrl,
    isPublished: p.isPublished,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

export function toCSV(data: Record<string, unknown>[], columns?: string[]): string {
  const keys = columns ?? Object.keys(data[0] ?? {});
  const header = keys.join(",");
  const rows = data.map((row) =>
    keys
      .map((key) => {
        const value = row[key];
        const stringValue = value === null || value === undefined ? "" : String(value);
        const escaped = stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
        return escaped;
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function parseCSV(csvText: string): ProductImportRow[] {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows: ProductImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: ProductImportRow = {
      name: values[0] ?? "",
      slug: values[1] ?? "",
      description: values[2] ?? undefined,
      priceCents: values[3] ? parseInt(values[3], 10) : undefined,
      currency: values[4] ?? undefined,
      merchant: values[5] ?? undefined,
      affiliateUrl: values[6] ?? undefined,
      productUrl: values[7] ?? undefined,
      imageUrl: values[8] ?? undefined,
      isPublished: values[9] === "true" || values[9] === "1",
    };
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}
