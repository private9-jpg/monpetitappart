import type { CollectionConfig } from "payload";

const Products: any = {
  slug: "products",
  labels: {
    singular: "Produit",
    plural: "Produits",
  },
  auth: false,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
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
      name: "description",
      type: "textarea",
    },
    {
      name: "priceCents",
      type: "number",
    },
    {
      name: "currency",
      type: "text",
      defaultValue: "EUR",
    },
    {
      name: "merchant",
      type: "text",
    },
    {
      name: "affiliateUrl",
      type: "text",
      required: true,
    },
    {
      name: "productUrl",
      type: "text",
    },
    {
      name: "imageUrl",
      type: "text",
    },
    {
      name: "rating",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "publishedAt",
      type: "date",
    },
  ],
};

const Articles: any = {
  slug: "articles",
  labels: {
    singular: "Article",
    plural: "Articles",
  },
  auth: false,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
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
      type: "textarea",
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Archived", value: "ARCHIVED" },
      ],
      defaultValue: "DRAFT",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "featuredAt",
      type: "date",
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "publishedAt",
      type: "date",
    },
  ],
};

const Users: any = {
  slug: "users",
  labels: {
    singular: "Utilisateur",
    plural: "Utilisateurs",
  },
  auth: true,
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "password",
      type: "password",
      required: true,
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Editor", value: "EDITOR" },
        { label: "Author", value: "AUTHOR" },
      ],
      defaultValue: "AUTHOR",
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};

export default {
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3000",
  mongoURL: process.env.MONGODB_URI || "mongodb://localhost:27017/monpetitappart",
  secret: process.env.PAYLOAD_SECRET || "change-me",
  collections: [Products, Articles, Users],
} as any;
