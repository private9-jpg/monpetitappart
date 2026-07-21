import Link from "next/link";
import { siteConfig } from "@/lib/config";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={`font-display text-xl font-semibold tracking-tight text-surface-900 transition-colors hover:text-accent-600 dark:text-surface-50 dark:hover:text-accent-400 ${className ?? ""}`}
    >
      {siteConfig.name.replace(/\s+/g, "")}
    </Link>
  );
}
