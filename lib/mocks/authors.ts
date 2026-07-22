import type { Author, AuthorCard } from "@/types/Author";

export const AUTHORS: AuthorCard[] = [
  {
    id: "1",
    name: "Marie Dubois",
    role: "Rédactrice en chef",
    bio: "Experte en immobilier depuis 12 ans, Marie décrypte les tendances du marché et accompagne les futurs acquéreurs avec pédagogie.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    articles: 86,
    followers: "12,4k",
  },
  {
    id: "2",
    name: "Thomas Leroy",
    role: "Consultant juridique",
    bio: "Ancien notaire, Thomas vulgarise le droit immobilier pour rendre la location accessible à tous.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    articles: 54,
    followers: "8,7k",
  },
  {
    id: "3",
    name: "Sophie Martin",
    role: "Architecte d'intérieur",
    bio: "Sophie explore les liens entre espace, bien-être et design minimaliste.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    articles: 42,
    followers: "15,1k",
  },
];

export const AUTHORS_BY_ID: Record<string, Author> = {
  "1": {
    id: "1",
    name: "Marie Dubois",
    role: "Rédactrice en chef",
    bio: "Experte en immobilier depuis 12 ans, Marie décrypte les tendances du marché et accompagne les futurs acquéreurs avec pédagogie.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    articles: 86,
    followers: "12,4k",
    socials: {
      twitter: "#",
      linkedin: "#",
      website: "#",
    },
  },
  "2": {
    id: "2",
    name: "Thomas Leroy",
    role: "Consultant juridique",
    bio: "Ancien notaire, Thomas vulgarise le droit immobilier pour rendre la location accessible à tous.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    articles: 54,
    followers: "8,7k",
    socials: {
      linkedin: "#",
    },
  },
  "3": {
    id: "3",
    name: "Sophie Martin",
    role: "Architecte d'intérieur",
    bio: "Sophie explore les liens entre espace, bien-être et design minimaliste.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    articles: 42,
    followers: "15,1k",
    socials: {
      website: "#",
    },
  },
};
