import { CategoriesSection } from "@/components/category/CategoriesSection";
import { ArticleCardGrid } from "@/components/article/ArticleCard";
import { ProductCardGrid } from "@/components/product/ProductCard";
import { NewsletterCardGrid } from "@/components/newsletter/NewsletterCard";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white dark:bg-surface-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl dark:text-surface-50">
                Le guide du petit appartement
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-surface-600 sm:text-xl dark:text-surface-400">
                Conseils, comparatifs, produits et astuces pour réussir votre projet immobilier.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button size="lg" asChild>
                  <a href="/guides">Découvrir les guides</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/comparatifs">Voir les comparatifs</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-100 shadow-sm dark:bg-surface-900">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"
                  alt="Petit appartement moderne"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoriesSection />

      <Section>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
              Articles récents
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Nos derniers conseils et analyses pour votre quotidien.
            </p>
          </div>
          <ArticleCardGrid variant="vertical" />
        </div>
      </Section>

      <Section className="bg-surface-50 dark:bg-surface-900">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
              Produits vedettes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Notre sélection pour vous accompagner au quotidien.
            </p>
          </div>
          <ProductCardGrid />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl dark:text-surface-50">
              Ne manquez plus nos conseils
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-surface-600 dark:text-surface-400">
              Rejoignez notre communauté et recevez nos meilleurs contenus directement dans votre boîte mail.
            </p>
          </div>
          <NewsletterCardGrid />
        </div>
      </Section>
    </>
  );
}
