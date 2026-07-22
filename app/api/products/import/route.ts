export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, forbidden, unauthorized, recordAuditLog } from "@/lib/auth";
import { importProducts, parseCSV } from "@/lib/services/product-import.service";

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) return unauthorized();
  if (!["ADMIN", "EDITOR"].includes(currentUser.role)) return forbidden();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Fichier CSV requis" }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length === 0) {
      return NextResponse.json({ error: "CSV vide ou invalide" }, { status: 400 });
    }

    const result = await importProducts(rows);
    await recordAuditLog(request, "import_products", "Product", undefined, { imported: result.imported, skipped: result.skipped }, currentUser.id);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'import" }, { status: 500 });
  }
}
