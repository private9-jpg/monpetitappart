import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Badge component following shadcn/ui conventions.
 *
 * @example
 * ```tsx
 * <Badge variant="default">Default</Badge>
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Destructive</Badge>
 * <Badge variant="outline">Outline</Badge>
 * ```
 */
function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "destructive" | "outline";
}) {
  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border-transparent bg-destructive text-white shadow-xs hover:bg-destructive/80 dark:bg-destructive/60",
    outline:
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  };

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
