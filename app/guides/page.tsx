import { ArticleCardGrid } from "@/components/article/ArticleCard";
import { Section } from "@/components/ui/section";

export default function GuidesPage() {
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
            Guides
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
            Nos guides complets pour réussir votre projet immobilier.
          </p>
        </div>
        <ArticleCardGrid variant="vertical" />
      </div>
    </Section>
  );
}
