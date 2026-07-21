import { Container } from "@/components/ui/container";
import { AffiliateManager } from "./AffiliateManager";

export const dynamic = "force-dynamic";

export default function AffiliateLinksPage() {
  return (
    <Container className="py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Liens affiliés</h1>
          <p className="mt-2 text-zinc-600">Suivi des clics et gestion des liens d’affiliation.</p>
        </div>
      </div>
      <AffiliateManager />
    </Container>
  );
}
