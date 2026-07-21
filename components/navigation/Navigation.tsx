import { type ReactNode } from "react";

interface NavigationProps {
  items?: Array<{ label: string; href: string }>;
  children?: ReactNode;
}

export function Navigation({ items, children }: NavigationProps) {
  return (
    <nav className="flex items-center gap-6">
      {items?.map((item) => (
        <a key={item.href} href={item.href} className="text-sm hover:underline">
          {item.label}
        </a>
      ))}
      {children}
    </nav>
  );
}
