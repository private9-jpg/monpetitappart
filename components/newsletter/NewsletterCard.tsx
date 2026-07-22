"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const FAKE_NEWSLETTERS = [
  {
    id: 1,
    title: "La newsletter du dimanche",
    description: "Chaque semaine, les meilleurs conseils immobiliers directement dans votre boîte mail.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    cta: "S'abonner",
    subscribers: "24k+",
  },
  {
    id: 2,
    title: "Investisseurs",
    description: "Opportunités, rendements et stratégies pour optimiser votre patrimoine.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
    cta: "Rejoindre",
    subscribers: "8,5k+",
  },
];

interface NewsletterCardProps {
  newsletter?: typeof FAKE_NEWSLETTERS[number];
  className?: string;
}

export function NewsletterCard({ newsletter = FAKE_NEWSLETTERS[0], className }: NewsletterCardProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900 ${className ?? ""}`}>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-100">
        <Image
          src={newsletter.image}
          alt={newsletter.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{newsletter.subscribers} abonnés</Badge>
          <Mail className="size-4 text-surface-400" />
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50">
          {newsletter.title}
        </h3>

        <p className="mt-2 text-sm text-surface-600 line-clamp-2 dark:text-surface-400">
          {newsletter.description}
        </p>

        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            placeholder="votre@email.com"
            className="h-9 flex-1"
          />
          <Button size="sm" className="h-9 whitespace-nowrap">
            {newsletter.cta}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function NewsletterCardGrid({ newsletters = FAKE_NEWSLETTERS }: { newsletters?: typeof FAKE_NEWSLETTERS }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {newsletters.map((newsletter) => (
        <NewsletterCard key={newsletter.id} newsletter={newsletter} />
      ))}
    </div>
  );
}
