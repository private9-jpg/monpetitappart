"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import type { Newsletter } from "@/types/Newsletter";
import { NEWSLETTERS } from "@/lib/mocks/newsletters";
import { listNewsletters } from "@/lib/services/newsletter.service";

export type NewsletterCardProps = {
  newsletter?: Newsletter;
  className?: string;
};

export async function NewsletterCardGrid() {
  const newsletters = await listNewsletters();
  const items = newsletters.length ? newsletters : NEWSLETTERS;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((newsletter) => (
        <div key={String(newsletter.id)} className="rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
          <p className="p-4 text-sm font-semibold text-surface-900 dark:text-surface-50">{newsletter.title}</p>
        </div>
      ))}
    </div>
  );
}
