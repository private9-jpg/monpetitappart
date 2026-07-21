"use client";

import Link from "next/link";
import { siteConfig, navConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden gap-6 text-sm md:flex">
          {navConfig.main.map((item) => (
            <Link key={item.href} href={item.href} className="text-zinc-600 transition-colors hover:text-black">
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
