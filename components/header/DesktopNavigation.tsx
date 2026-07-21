import Link from "next/link";
import { cn } from "@/lib/utils";
import { navConfig } from "@/lib/config";

interface DesktopNavigationProps {
  className?: string;
}

export function DesktopNavigation({ className }: DesktopNavigationProps) {
  return (
    <nav
      className={cn("hidden items-center gap-8 md:flex", className)}
      aria-label="Navigation principale"
    >
      {navConfig.main.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-surface-600 transition-colors duration-200 hover:text-surface-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-surface-400 dark:hover:text-surface-50"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
