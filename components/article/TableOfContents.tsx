"use client";

import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

interface TableOfContentsProps {
  headings: HeadingItem[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!headings.length) return null;

  return (
    <div className={cn("w-full", className)}>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50 mb-3">
        Sommaire
      </h4>

      {isMobile ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="toc">
            <AccordionTrigger className="text-left text-sm font-medium text-surface-700 dark:text-surface-300 py-2">
              Voir le sommaire
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-2">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={cn(
                        "text-sm transition-colors hover:text-surface-900 dark:hover:text-surface-50",
                        heading.level === 3
                          ? "pl-4 text-surface-600 dark:text-surface-400"
                          : "text-surface-900 dark:text-surface-50"
                      )}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <ul className="flex flex-col gap-2 text-sm">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block transition-colors hover:text-surface-900 dark:hover:text-surface-50",
                    heading.level === 3
                      ? "pl-4 text-surface-600 dark:text-surface-400"
                      : "text-surface-900 dark:text-surface-50 font-medium"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
