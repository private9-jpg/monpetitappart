import Link from "next/link";
import { siteConfig, footerConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    youtube: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  };

  return (
    <Button variant="ghost" size="icon" asChild className="text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
      <Link href={footerConfig.socials.find((s) => s.icon === name)?.href ?? "#"} aria-label={name}>
        {icons[name]}
      </Link>
    </Button>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight text-surface-900 dark:text-surface-50">
              {siteConfig.name.replace(/\s+/g, "")}
            </Link>
            <p className="text-sm leading-relaxed text-surface-600 dark:text-surface-400">{footerConfig.description}</p>
            <div className="flex items-center gap-1">
              {footerConfig.socials.map((social) => (
                <SocialIcon key={social.icon} name={social.icon} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50">Liens rapides</h3>
            <ul className="flex flex-col gap-3">
              {footerConfig.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50">Catégories</h3>
            <ul className="flex flex-col gap-3">
              {footerConfig.categories.map((category) => (
                <li key={category.href}>
                  <Link href={category.href} className="text-sm text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50">Légal</h3>
            <ul className="flex flex-col gap-3">
              {footerConfig.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-surface-600 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-surface-200 py-6 sm:flex-row dark:border-surface-800">
          <p className="text-sm text-surface-500 dark:text-surface-400">&copy; {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-xs text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-xs text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
              Confidentialité
            </Link>
            <Link href="/cookies" className="text-xs text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
              Cookies
            </Link>
            <Link href="/transparence-affiliation" className="text-xs text-surface-500 transition-colors hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50">
              Affiliation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
