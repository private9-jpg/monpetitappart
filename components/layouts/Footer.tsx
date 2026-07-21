import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-zinc-500 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
