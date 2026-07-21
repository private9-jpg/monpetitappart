import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Loader component for loading indicators.
 *
 * @example
 * ```tsx
 * <Loader size="default" />
 * <Loader size="sm" />
 * <Loader size="lg" />
 * ```
 */
function Loader({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "sm" | "default" | "lg";
}) {
  const sizes = {
    sm: "size-4 border-2",
    default: "size-8 border-4",
    lg: "size-12 border-4",
  };

  return (
    <div
      role="status"
      aria-label="Chargement"
      data-slot="loader"
      className={cn(
        "border-primary border-t-transparent rounded-full animate-spin",
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Loader };
