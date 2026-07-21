export const siteConfig = {
  name: "Mon Petit Appart",
  description: "Application foundation",
  url: "https://monpetitappart.com",
} as const;

export const navConfig = {
  main: [
    { title: "Accueil", href: "/" },
    { title: "Guides", href: "/guides" },
    { title: "Comparatifs", href: "/comparatifs" },
    { title: "Produits", href: "/produits" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
} as const;

export const footerConfig = {
  description: "Conseils, comparatifs et guides pour réussir votre projet immobilier. Contenu éditorial indépendant et transparent.",
  quickLinks: [
    { title: "Accueil", href: "/" },
    { title: "Guides", href: "/guides" },
    { title: "Comparatifs", href: "/comparatifs" },
    { title: "Produits", href: "/produits" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
  categories: [
    { title: "Location", href: "/guides/location" },
    { title: "Achat", href: "/guides/achat" },
    { title: "Travaux", href: "/guides/travaux" },
    { title: "Financement", href: "/guides/financement" },
    { title: "Décoration", href: "/blog/decoration" },
    { title: "Investissement", href: "/comparatifs/investissement" },
  ],
  legal: [
    { title: "Mentions légales", href: "/mentions-legales" },
    { title: "Politique de confidentialité", href: "/confidentialite" },
    { title: "Cookies", href: "/cookies" },
    { title: "Transparence affiliation", href: "/transparence-affiliation" },
  ],
  socials: [
    { title: "Facebook", href: "#", icon: "facebook" },
    { title: "Twitter", href: "#", icon: "twitter" },
    { title: "Instagram", href: "#", icon: "instagram" },
    { title: "LinkedIn", href: "#", icon: "linkedin" },
    { title: "YouTube", href: "#", icon: "youtube" },
  ],
} as const;
