"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { navConfig, siteConfig } from "@/lib/config";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export function MobileNavigation() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-4 mt-4 max-h-[85svh]">
        <DrawerHeader className="flex flex-row items-center justify-between text-left">
          <DrawerTitle className="sr-only">Menu de navigation</DrawerTitle>
          <Logo />
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Fermer le menu">
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="Navigation mobile">
          {navConfig.main.map((item) => (
            <DrawerClose key={item.href} asChild>
              <Link
                href={item.href}
                className="flex items-center rounded-md px-3 py-3 text-base font-medium text-surface-700 transition-colors hover:bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-surface-300 dark:hover:bg-surface-800"
              >
                {item.title}
              </Link>
            </DrawerClose>
          ))}
        </nav>

        <div className="flex flex-col gap-3 px-4 pb-8">
          <DrawerClose asChild>
            <Button variant="default" className="w-full">
              Newsletter
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Contact
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
