import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Spinner component for loading indicators.
 *
 * @example
 * ```tsx
 * <Spinner size="default" />
 * <Spinner size="sm" />
 * <Spinner size="lg" />
 * ```
 */
function Spinner({
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
      data-slot="spinner"
      className={cn(
        "border-primary border-t-transparent rounded-full animate-spin",
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
