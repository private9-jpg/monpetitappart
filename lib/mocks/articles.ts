import type { Article, ArticleListItem } from "@/types/Article";
import { AUTHORS_BY_ID } from "./authors";

export const ARTICLES: ArticleListItem[] = [
  {
    id: 1,
    title: "Comment choisir son premier appartement",
    excerpt: "Les critères essentiels pour ne pas se tromper lors de votre première acquisition immobilière.",
    category: "Guide",
    date: "2026-07-15",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    author: {
      name: "Marie Dubois",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
  },
  {
    id: 2,
    title: "Les 10 erreurs à éviter en location",
    excerpt: "Pièges, arnaques et mauvaises surprises : soyez vigilant à chaque étape de votre dossier.",
    category: "Conseils",
    date: "2026-07-10",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    author: {
      name: "Thomas Leroy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 3,
    title: "Optimiser son espace : astuces minimalistes",
    excerpt: "Maximisez chaque mètre carré sans sacrifier le style ni le confort.",
    category: "Décoration",
    date: "2026-07-05",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    author: {
      name: "Sophie Martin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
  },
  {
    id: 4,
    title: "Assurance loyer impayé : mode d'emploi",
    excerpt: "Comprendre les garanties, les plafonds et les exclusions pour bien protéger votre investissement.",
    category: "Assurance",
    date: "2026-06-28",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    author: {
      name: "Lucas Bernard",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
  },
  {
    id: 5,
    title: "Aménager un studio de 20m²",
    excerpt: "Toutes les astuces pour gagner en confort sans perdre en espace.",
    category: "Aménagement",
    date: "2026-06-20",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    author: {
      name: "Emma Petit",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
  },
  {
    id: 6,
    title: "Déménagement pas cher : le guide complet",
    excerpt: "Budget, calendrier, astuces : tout pour réussir votre déménagement sans se ruiner.",
    category: "Déménagement",
    date: "2026-06-12",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    author: {
      name: "Hugo Martin",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e:w=200&q=80",
    },
  },
];

export const ARTICLE_BY_SLUG: Record<string, Article> = {
  "comment-choisir-son-premier-appartement": {
    id: "1",
    slug: "comment-choisir-son-premier-appartement",
    title: "Comment choisir son premier appartement",
    description: "Les critères essentiels pour ne pas se tromper lors de votre première acquisition immobilière.",
    excerpt: "Les critères essentiels pour ne pas se tromper lors de votre première acquisition immobilière.",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80",
    author: {
      ...AUTHORS_BY_ID["1"],
      socials: AUTHORS_BY_ID["1"].socials ?? {},
    },
    date: "2026-07-15",
    readTime: "8 min",
    content: {
      html: `
        <h2>Pourquoi bien choisir son premier appartement ?</h2>
        <p>Le premier achat immobilier est souvent le plus important. Une mauvaise décision peut avoir des conséquences financières pendant des années.</p>
        <h3>Les critères à prioriser</h3>
        <p>Localisation, budget, surface, état du bien et potentibilité doivent être évalués avant toute visite.</p>
        <h2>Le budget : prix et frais annexes</h2>
        <p>Au-delà du prix d'achat, prévoyez les frais de notaire, les travaux et une marge de sécurité.</p>
        <h3>Comment calculer sa capacité d'emprunt</h3>
        <p>Les banques prennent généralement en compte le taux d'endettement et l'apport personnel.</p>
      `,
      headings: [
        { id: "pourquoi-bien-choisir-son-premier-appartement", text: "Pourquoi bien choisir son premier appartement ?", level: 2 },
        { id: "les-criteres-a-prioriser", text: "Les critères à prioriser", level: 3 },
        { id: "le-budget-prix-et-frais-annexes", text: "Le budget : prix et frais annexes", level: 2 },
        { id: "comment-calculer-sa-capacite-d-emprunt", text: "Comment calculer sa capacité d'emprunt", level: 3 },
      ],
    },
    affiliate: {
      title: "Préparez votre projet",
      description: "Comparez les offres de prêt et trouvez le meilleur taux pour votre premier achat.",
      ctaLabel: "Voir les offres",
      href: "#",
    },
    relatedArticleIds: ["2", "5", "6"],
  },
  "les-10-erreurs-a-eviter-en-location": {
    id: "2",
    slug: "les-10-erreurs-a-eviter-en-location",
    title: "Les 10 erreurs à éviter en location",
    description: "Pièges, arnaques et mauvaises surprises : soyez vigilant à chaque étape de votre dossier.",
    excerpt: "Pièges, arnaques et mauvaises surprises : soyez vigilant à chaque étape de votre dossier.",
    category: "Conseils",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa:w=1600&q=80",
    author: {
      ...AUTHORS_BY_ID["2"],
      socials: AUTHORS_BY_ID["2"].socials ?? {},
    },
    date: "2026-07-10",
    readTime: "5 min",
    content: {
      html: `
        <h2>Pourquoi éviter ces erreurs ?</h2>
        <p>Une erreur dans votre dossier peut coûter cher : perte du bien, frais supplémentaires ou recours juridiques.</p>
        <h3>Erreur n°1 : négliger la vérification du propriétaire</h3>
        <p>Vérifiez toujours l'identité du propriétaire ou de son mandataire avant de signer.</p>
        <h2>Comment se protéger ?</h2>
        <p>Conservez toutes les preuves et lisez chaque clause du bail en détail.</p>
      `,
      headings: [
        { id: "pourquoi-eviter-ces-erreurs", text: "Pourquoi éviter ces erreurs ?", level: 2 },
        { id: "erreur-n1-negliger-la-verification-du-proprietaire", text: "Erreur n°1 : négliger la vérification du propriétaire", level: 3 },
        { id: "comment-se-proteger", text: "Comment se protéger ?", level: 2 },
      ],
    },
    affiliate: undefined,
    relatedArticleIds: ["7", "11"],
  },
};

export const FALLBACK_ARTICLES: Article[] = [
  {
    id: "5",
    slug: "amenager-un-studio-de-20m2",
    title: "Aménager un studio de 20m²",
    description: "Toutes les astuces pour gagner en confort sans perdre en espace.",
    excerpt: "Toutes les astuces pour gagner en confort sans perdre en espace.",
    category: "Aménagement",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    author: {
      ...AUTHORS_BY_ID["3"],
      socials: AUTHORS_BY_ID["3"].socials ?? {},
    },
    date: "2026-06-20",
    readTime: "7 min",
    content: {
      html: `
        <h2>Aménager un petit espace</h2>
        <p>Chaque mètre carré compte dans un studio de 20m².</p>
        <h3>Meubles multifonctions</h3>
        <p>Privilégiez les meubles qui cumulent plusieurs fonctions pour optimiser l'espace.</p>
      `,
      headings: [
        { id: "amenager-un-petit-espace", text: "Aménager un petit espace", level: 2 },
        { id: "meubles-multifonctions", text: "Meubles multifonctions", level: 3 },
      ],
    },
    affiliate: {
      title: "Inspirez-vous",
      description: "Retrouvez notre sélection de mobilier pour petits espaces.",
      ctaLabel: "Voir la sélection",
      href: "#",
    },
    relatedArticleIds: ["3", "9"],
  },
];
