import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const PLACEHOLDER_ILLUSTRATION = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='none'%3E%3Crect width='600' height='400' fill='%23f5f5f4'/%3E%3Cpath d='M180 280L180 160L240 120L300 160L300 280' stroke='%23a8a29e' stroke-width='2'/%3E%3Cpath d='M300 280L300 160L360 120L420 160L420 280' stroke='%23a8a29e' stroke-width='2'/%3E%3Crect x='200' y='200' width='60' height='80' fill='%23e7e5e4'/%3E%3Crect x='320' y='180' width='60' height='100' fill='%23e7e5e4'/%3E%3Crect x='260' y='240' width='40' height='40' fill='%23d6d3d1'/%3E%3Ccircle cx='290' cy='260' r='4' fill='%2378716c'/%3E%3C/svg%3E";

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
}

export function Hero({
  title = "Le guide du petit appartement",
  subtitle = "Conseils, comparatifs, produits et astuces.",
  primaryCta = { label: "Découvrir les guides", href: "/guides" },
  secondaryCta = { label: "Voir les comparatifs", href: "/comparatifs" },
  imageSrc = PLACEHOLDER_ILLUSTRATION,
  imageAlt = "Illustration représentant un petit appartement",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-surface-950" aria-labelledby="hero-title">
      <Container className="py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <h1
              id="hero-title"
              className="font-display text-4xl font-semibold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl dark:text-surface-50"
            >
              {title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-surface-600 sm:text-xl dark:text-surface-400">
              {subtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" asChild>
                <a href={primaryCta.href}>{primaryCta.label}</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={secondaryCta.href}>{secondaryCta.label}</a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-100 shadow-sm dark:bg-surface-900">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
