import type { CollectionConfig } from "payload";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";

const ArticleTypes = [
  { label: "GUIDE", value: "GUIDE" },
  { label: "COMPARATIF", value: "COMPARATIF" },
  { label: "PRODUIT", value: "PRODUIT" },
  { label: "BLOG", value: "BLOG" },
  { label: "OUTIL", value: "OUTIL" },
  { label: "PILIER", value: "PILIER" },
];

const StatusOptions = [
  { label: "Brouillon", value: "DRAFT" },
  { label: "Publié", value: "PUBLISHED" },
  { label: "Archivé", value: "ARCHIVED" },
  { label: "Inactif", value: "INACTIVE" },
];

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: "Utilisateur",
    plural: "Utilisateurs",
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "password",
      type: "text",
      required: true,
    },
    {
      name: "firstName",
      type: "text",
      required: false,
    },
    {
      name: "lastName",
      type: "text",
      required: false,
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "ADMIN", value: "ADMIN" },
        { label: "EDITOR", value: "EDITOR" },
        { label: "WRITER", value: "WRITER" },
        { label: "MODERATOR", value: "MODERATOR" },
        { label: "ANALYST", value: "ANALYST" },
      ],
      defaultValue: "WRITER",
      required: true,
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Actif",
      defaultValue: true,
    },
  ],
};

const Merchants: CollectionConfig = {
  slug: "merchants",
  labels: {
    singular: "Marchand",
    plural: "Marchands",
  },
  timestamps: true,
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "affiliateNetwork",
      label: "Réseau d'affiliation",
      type: "text",
    },
    {
      name: "identifier",
      label: "Identifiant",
      type: "text",
    },
    {
      name: "trackingParams",
      label: "Paramètres de tracking",
      type: "textarea",
    },
    {
      name: "commission",
      type: "number",
      admin: {
        description: "Commission en pourcentage ou valeur fixe",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Actif",
      defaultValue: true,
    },
  ],
};

const AffiliateLinks: CollectionConfig = {
  slug: "affiliate-links",
  labels: {
    singular: "Lien affilié",
    plural: "Liens affiliés",
  },
  timestamps: true,
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "label",
      label: "Libellé",
      type: "text",
      required: true,
    },
    {
      name: "targetUrl",
      label: "URL cible",
      type: "text",
      required: true,
    },
    {
      name: "merchant",
      type: "relationship",
      relationTo: "merchants",
      required: true,
    },
    {
      name: "fallbackUrl",
      label: "Fallback",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Actif", value: "ACTIVE" },
        { label: "Inactif", value: "INACTIVE" },
      ],
      defaultValue: "ACTIVE",
    },
    {
      name: "lastCheckedAt",
      label: "Dernier contrôle",
      type: "date",
    },
    {
      name: "lastHttpCode",
      label: "Dernier code HTTP",
      type: "number",
    },
    {
      name: "clickCount",
      label: "Nombre de clics",
      type: "number",
      defaultValue: 0,
    },
  ],
};

const ProductOffers: CollectionConfig = {
  slug: "product-offers",
  labels: {
    singular: "Offre produit",
    plural: "Offres produits",
  },
  timestamps: true,
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
    {
      name: "affiliateLink",
      type: "relationship",
      relationTo: "affiliate-links",
      required: true,
    },
    {
      name: "price",
      type: "number",
      required: true,
    },
    {
      name: "currency",
      label: "Devise",
      type: "text",
      defaultValue: "EUR",
      required: true,
    },
    {
      name: "availability",
      label: "Disponibilité",
      type: "select",
      options: [
        { label: "En stock", value: "IN_STOCK" },
        { label: "En rupture", value: "OUT_OF_STOCK" },
        { label: "Sur commande", value: "BACKORDER" },
      ],
      defaultValue: "IN_STOCK",
    },
    {
      name: "priority",
      label: "Priorité",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "recordedAt",
      label: "Date du relevé",
      type: "date",
      required: true,
    },
  ],
};

const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Produit",
    plural: "Produits",
  },
  timestamps: true,
  fields: [
    {
      name: "name",
      label: "Nom",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "brand",
      label: "Marque",
      type: "text",
    },
    {
      name: "category",
      label: "Catégorie",
      type: "text",
    },
    {
      name: "shortDescription",
      label: "Description courte",
      type: "textarea",
    },
    {
      name: "longDescription",
      label: "Description longue",
      type: "richText",
    },
    {
      name: "features",
      label: "Caractéristiques",
      type: "textarea",
    },
    {
      name: "strengths",
      label: "Points forts",
      type: "textarea",
    },
    {
      name: "weaknesses",
      label: "Points faibles",
      type: "textarea",
    },
    {
      name: "editorRating",
      label: "Note rédactionnelle",
      type: "number",
      min: 0,
      max: 10,
    },
    {
      name: "images",
      label: "Images",
      type: "array",
      fields: [
        {
          name: "url",
          type: "text",
          label: "URL de l'image",
        },
      ],
    },
    {
      name: "status",
      type: "select",
      options: StatusOptions,
      defaultValue: "DRAFT",
    },
    {
      name: "mainOffer",
      label: "Offre principale",
      type: "relationship",
      relationTo: "product-offers",
    },
    {
      name: "offers",
      label: "Offres",
      type: "relationship",
      relationTo: "product-offers",
      hasMany: true,
    },
  ],
};

const Articles: CollectionConfig = {
  slug: "articles",
  labels: {
    singular: "Article",
    plural: "Articles",
  },
  timestamps: true,
  fields: [
    {
      name: "title",
      label: "Titre",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "excerpt",
      label: "Chapo",
      type: "textarea",
    },
    {
      name: "content",
      label: "Contenu",
      type: "richText",
      required: true,
    },
    {
      name: "type",
      type: "select",
      options: ArticleTypes,
      defaultValue: "BLOG",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: StatusOptions,
      defaultValue: "DRAFT",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "cluster",
      type: "text",
    },
    {
      name: "seoTitle",
      label: "SEO title",
      type: "text",
    },
    {
      name: "metaDescription",
      label: "Meta description",
      type: "textarea",
    },
    {
      name: "ogImage",
      label: "Image OG",
      type: "text",
    },
    {
      name: "canonical",
      label: "Canonical",
      type: "text",
    },
    {
      name: "indexable",
      label: "Indexable",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "publishedAt",
      label: "Date de publication",
      type: "date",
    },
    {
      name: "lastCheckedAt",
      label: "Date de dernière vérification",
      type: "date",
    },
  ],
};

const Comments: CollectionConfig = {
  slug: "comments",
  labels: {
    singular: "Commentaire",
    plural: "Commentaires",
  },
  timestamps: true,
  fields: [
    {
      name: "article",
      type: "relationship",
      relationTo: "articles",
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
    },
    {
      name: "parentComment",
      type: "relationship",
      relationTo: "comments",
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email privé",
      type: "email",
      required: true,
      admin: {
        description: "Ne pas afficher publiquement",
      },
    },
    {
      name: "rating",
      label: "Note",
      type: "number",
      min: 0,
      max: 5,
    },
    {
      name: "content",
      label: "Contenu",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Publié", value: "PUBLISHED" },
        { label: "En attente", value: "PENDING" },
        { label: "Rejeté", value: "REJECTED" },
      ],
      defaultValue: "PENDING",
    },
    {
      name: "spamScore",
      label: "Score anti-spam",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "rejectionReason",
      label: "Motif de rejet",
      type: "textarea",
    },
    {
      name: "ipHash",
      label: "IP hashée",
      type: "text",
    },
    {
      name: "userAgent",
      label: "User agent",
      type: "text",
    },
    {
      name: "optInResponse",
      label: "Opt-in pour recevoir une réponse",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3000",
  secret: process.env.PAYLOAD_SECRET || "change-me",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: [
    Users,
    Articles,
    Products,
    Merchants,
    AffiliateLinks,
    ProductOffers,
    Comments,
  ],
});
