import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading states.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-full" />
 * ```
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-accent dark:bg-accent/50 animate-pulse rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
