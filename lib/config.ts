export const siteConfig = {
  name: "Mon Petit Appart",
  description: "Application foundation",
  url: "https://monpetitappart.com",
} as const;

export const navConfig = {
  main: [
    { title: "Accueil", href: "/" },
    { title: "Guides", href: "/guides" },
    { title: "Produits", href: "/produits" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
} as const;
