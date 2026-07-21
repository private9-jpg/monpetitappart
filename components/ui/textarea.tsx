import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Textarea component following shadcn/ui conventions.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Type your message here." />
 * ```
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
