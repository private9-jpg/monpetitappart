"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, FileText, ShoppingBag, Link2, Shield, Mail, Search, Users, ClipboardList } from "lucide-react";

const NAV = [
  { title: "Vue d'ensemble", href: "/admin", icon: BarChart3, end: true },
  { title: "Contenus", href: "/admin/contenus", icon: FileText, end: false },
  { title: "Produits", href: "/admin/produits", icon: ShoppingBag, end: false },
  { title: "Affiliation", href: "/admin/affiliation", icon: Link2, end: false },
  { title: "Modération", href: "/admin/moderation", icon: Shield, end: false },
  { title: "Newsletter", href: "/admin/newsletter", icon: Mail, end: false },
  { title: "SEO", href: "/admin/seo", icon: Search, end: false },
  { title: "Utilisateurs & rôles", href: "/admin/utilisateurs", icon: Users, end: false },
  { title: "Journal d'audit", href: "/admin/audit", icon: ClipboardList, end: false },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-4 md:block">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Administration</p>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Navigation admin">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.end ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon className="size-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
