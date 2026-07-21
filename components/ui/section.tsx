import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Section layout component for consistent vertical rhythm.
 *
 * @example
 * ```tsx
 * <Section>
 *   <h2>Title</h2>
 *   <p>Content</p>
 * </Section>
 * ```
 */
export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("w-full py-16 md:py-24", className)}
    >
      {children}
    </section>
  );
}
