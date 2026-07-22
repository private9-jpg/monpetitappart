import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbidden, getUserFromRequest, unauthorized, recordAuditLog } from "@/lib/auth";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  affiliateUrl: z.string().url(),
  currency: z.string().default("EUR"),
  isPublished: z.boolean().default(false),
  productUrl: z.string().url().optional(),
  description: z.string().max(5000).optional(),
  priceCents: z.number().int().nonnegative().optional(),
  merchant: z.string().max(200).optional(),
  imageUrl: z.string().url().optional(),
});

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    include: { affiliateLinks: true },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR", "WRITER"].includes(currentUser.role)) return forbidden();

  const body = await request.json();
  const sanitized = sanitizeObject(body as Record<string, unknown>, 5000);
  const parsed = productCreateSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existingProduct) {
    return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  }

type ProductCreateData = {
  name: string;
  slug: string;
  affiliateUrl: string;
  currency: string;
  isPublished: boolean;
  productUrl?: string | null;
  description?: string | null;
  priceCents?: number | null;
  merchant?: string | null;
  imageUrl?: string | null;
  publishedAt?: Date | null;
};

  const createData: ProductCreateData = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    affiliateUrl: parsed.data.affiliateUrl,
    currency: parsed.data.currency,
    isPublished: Boolean(parsed.data.isPublished),
    productUrl: parsed.data.productUrl,
    description: parsed.data.description,
    priceCents: parsed.data.priceCents,
    merchant: parsed.data.merchant,
    imageUrl: parsed.data.imageUrl,
    publishedAt: parsed.data.isPublished ? new Date() : null,
  };

  if (currentUser.role === "WRITER") {
    createData.isPublished = false;
    createData.publishedAt = null;
  }

  const product = await prisma.product.create({ data: createData });
  await recordAuditLog(request, "create_product", "Product", product.id, { authorId: currentUser.id, role: currentUser.role }, currentUser.id);

  return NextResponse.json(product, { status: 201 });
}
