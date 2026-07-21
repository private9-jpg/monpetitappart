"use client";

import { Button } from "@/components/ui/button";
import { DesktopNavigation } from "@/components/header/DesktopNavigation";
import { Logo } from "@/components/header/Logo";
import { MobileNavigation } from "@/components/header/MobileNavigation";
import { Search, Newspaper, Mail } from "lucide-react";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md transition-all duration-300 dark:border-surface-800 dark:bg-surface-950/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <DesktopNavigation className="flex-1 justify-center" />

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="icon" aria-label="Rechercher">
              <Search className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Newspaper className="size-4" />
              <span>Newsletter</span>
            </Button>
            <Button variant="default" size="sm" className="gap-2">
              <Mail className="size-4" />
              <span>Contact</span>
            </Button>
          </div>

          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
