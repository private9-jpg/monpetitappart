import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Alert component following shadcn/ui conventions.
 *
 * @example
 * ```tsx
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>
 *     This is an alert with a title and description.
 *   </AlertDescription>
 * </Alert>
 * ```
 */
function Alert({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(
        "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm",
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
