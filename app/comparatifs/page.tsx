import { SiteLayout } from "@/components/layouts/SiteLayout";
import { Hero } from "@/components/hero/Hero";
import { ComparisonCardGrid } from "@/components/comparison/ComparisonCard";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { Section } from "@/components/ui/section";

export default function ComparatifsPage() {
  return (
    <SiteLayout>
      <Hero
        title="Comparatifs"
        subtitle="Comparez les meilleures solutions pour votre logement."
        primaryCta={{ label: "Voir les guides", href: "/guides" }}
        secondaryCta={{ label: "Voir les produits", href: "/produits" }}
      />

      <Section>
        <ComparisonCardGrid />
      </Section>

      <Section>
        <Newsletter />
      </Section>
    </SiteLayout>
  );
}
