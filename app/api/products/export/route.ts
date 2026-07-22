export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { exportProducts, toCSV } from "@/lib/services/product-import.service";

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  const products = await exportProducts();
  const csv = toCSV(products);

  await recordAuditLog(request, "export_products", "Product", undefined, { count: products.length }, currentUser.id);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="products.csv"',
    },
  });
}
