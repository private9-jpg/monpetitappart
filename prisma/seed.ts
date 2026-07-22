import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

type UserRole = "ADMIN" | "EDITOR" | "WRITER" | "MODERATOR" | "ANALYST";

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.redirect.deleteMany();
  await prisma.conversion.deleteMany();
  await prisma.affiliateClick.deleteMany();
  await prisma.affiliateLink.deleteMany();
  await prisma.productOffer.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.productCategoryRelation.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productCluster.deleteMany();
  await prisma.cluster.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hash("admin123", 10);
  const editorPassword = await hash("editor123", 10);

  const userData: Array<{ email: string; passwordHash: string; role: UserRole }> = [
    { email: "admin@monpetitappart.fr", passwordHash: adminPassword, role: "ADMIN" },
    { email: "editor@monpetitappart.fr", passwordHash: editorPassword, role: "EDITOR" },
  ];

  await prisma.user.createMany({ data: userData,  });
  const users = await prisma.user.findMany();

  await prisma.merchant.createMany({
    data: [
      { name: "Marchand Alpha", slug: "marchand-alpha", websiteUrl: "https://marchand-alpha.example" },
      { name: "Marchand Beta", slug: "marchand-beta", websiteUrl: "https://marchand-beta.example" },
      { name: "Marchand Gamma", slug: "marchand-gamma", websiteUrl: "https://marchand-gamma.example" },
      { name: "Marchand Delta", slug: "marchand-delta", websiteUrl: "https://marchand-delta.example" },
      { name: "Marchand Epsilon", slug: "marchand-epsilon", websiteUrl: "https://marchand-epsilon.example" },
    ],
  });
  const merchants = await prisma.merchant.findMany();

  await prisma.cluster.createMany({
    data: [
      { name: "Électroménager", slug: "electromenager" },
      { name: "Mobilier", slug: "mobilier" },
    ],
  });
  const clusters = await prisma.cluster.findMany();

  await prisma.productCategory.createMany({
    data: [
      { name: "Électroménager", slug: "electromenager" },
      { name: "Mobilier", slug: "mobilier" },
      { name: "Décoration", slug: "decoration" },
    ],
  });
  const categories = await prisma.productCategory.findMany();

  const productsData = [
    {
      name: "Aspirateur XL",
      slug: "aspirateur-xl",
      description: "Aspirateur puissant pour la maison",
      priceCents: 12999,
      currency: "EUR",
      merchant: "Marchand Alpha",
      merchantId: merchants[0].id,
      affiliateUrl: "https://affiliate.example/aspirateur-xl",
      productUrl: "https://example.com/aspirateur-xl",
      imageUrl: "https://example.com/aspirateur-xl.jpg",
      isPublished: true,
    },
    {
      name: "Canapé Confort",
      slug: "canape-confort",
      description: "Canapé deux places moderne",
      priceCents: 79900,
      currency: "EUR",
      merchant: "Marchand Beta",
      merchantId: merchants[1].id,
      affiliateUrl: "https://affiliate.example/canape-confort",
      productUrl: "https://example.com/canape-confort",
      imageUrl: "https://example.com/canape-confort.jpg",
      isPublished: true,
    },
    {
      name: "Lampe de Bureau",
      slug: "lampe-de-bureau",
      description: "Lampe LED réglable",
      priceCents: 4999,
      currency: "EUR",
      merchant: "Marchand Gamma",
      merchantId: merchants[2].id,
      affiliateUrl: "https://affiliate.example/lampe-de-bureau",
      productUrl: "https://example.com/lampe-de-bureau",
      imageUrl: "https://example.com/lampe-de-bureau.jpg",
      isPublished: true,
    },
    {
      name: "Bureau Réglable",
      slug: "bureau-reglable",
      description: "Bureau assis-debout ergonomique",
      priceCents: 24900,
      currency: "EUR",
      merchant: "Marchand Delta",
      merchantId: merchants[3].id,
      affiliateUrl: "https://affiliate.example/bureau-reglable",
      productUrl: "https://example.com/bureau-reglable",
      imageUrl: "https://example.com/bureau-reglable.jpg",
      isPublished: true,
    },
    {
      name: "Four Micro-ondes",
      slug: "four-micro-ondes",
      description: "Micro-ondes compact et efficace",
      priceCents: 9990,
      currency: "EUR",
      merchant: "Marchand Epsilon",
      merchantId: merchants[4].id,
      affiliateUrl: "https://affiliate.example/four-micro-ondes",
      productUrl: "https://example.com/four-micro-ondes",
      imageUrl: "https://example.com/four-micro-ondes.jpg",
      isPublished: true,
    },
  ];

  await prisma.product.createMany({ data: productsData,  });
  const products = await prisma.product.findMany();

  await prisma.productCluster.createMany({
    data: products.map((product, index) => ({
      productId: product.id,
      clusterId: clusters[index % clusters.length].id,
    })),
  });

  await prisma.productCategoryRelation.createMany({
    data: products.flatMap((product, index) => [
      { productId: product.id, categoryId: categories[index % categories.length].id },
      { productId: product.id, categoryId: categories[(index + 1) % categories.length].id },
    ]),
  });

  await prisma.productOffer.createMany({
    data: products.map((product, index) => ({
      productId: product.id,
      merchantId: merchants[index % merchants.length].id,
      priceCents: product.priceCents ?? 0,
      currency: product.currency,
      url: product.productUrl ?? "https://example.com",
      startsAt: new Date(),
      isActive: true,
    })),
  });

  await prisma.priceHistory.createMany({
    data: products.map((product, index) => ({
      productId: product.id,
      merchantId: merchants[index % merchants.length].id,
      priceCents: product.priceCents ?? 0,
      currency: product.currency,
    })),
  });

  await prisma.article.createMany({
    data: products.flatMap((product, index) => [
      {
        title: `Guide d'achat ${index + 1}`,
        slug: `guide-${index + 1}`,
        excerpt: `Conseils et avis pour le produit ${product.name}`,
        content: `Contenu long et structuré pour l'article ${index + 1}`,
        authorId: users[0].id,
        status: "PUBLISHED",
        isFeatured: index < 2,
        publishedAt: new Date(),
      },
      {
        title: `Test produit ${index + 1}`,
        slug: `test-produit-${index + 1}`,
        excerpt: `Test approfondi du produit ${product.name}`,
        content: `Contenu long et structuré pour l'article ${index + 1}`,
        authorId: users[1].id,
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
    ]),
  });
  const articles = await prisma.article.findMany();

  const affiliateLinksData = products.flatMap((product) => [
    { productId: product.id, source: "newsletter", url: `${product.affiliateUrl}?utm_source=newsletter` },
    { productId: product.id, source: "instagram", url: `${product.affiliateUrl}?utm_source=instagram` },
    { productId: product.id, source: "search", url: `${product.affiliateUrl}?utm_source=search` },
    { productId: product.id, source: "blog", url: `${product.affiliateUrl}?utm_source=blog` },
  ]);

  await prisma.affiliateLink.createMany({ data: affiliateLinksData,  });
  const affiliateLinks = await prisma.affiliateLink.findMany();

  const affiliateClicksData = affiliateLinks.slice(0, 10).flatMap((link, index) => [
    { affiliateLinkId: link.id, source: index % 2 === 0 ? "newsletter" : "instagram", ip: "127.0.0.1" },
    { affiliateLinkId: link.id, source: index % 2 === 0 ? "search" : "blog", ip: "127.0.0.1" },
  ]);

  await prisma.affiliateClick.createMany({ data: affiliateClicksData,  });
  const affiliateClicks = await prisma.affiliateClick.findMany();

  await prisma.conversion.createMany({
    data: affiliateClicks.slice(0, 4).map((click, index) => ({
      affiliateClickId: click.id,
      productId: products[index].id,
      amountCents: products[index].priceCents ?? 0,
      currency: products[index].currency,
      status: index % 2 === 0 ? "COMPLETED" : "PENDING",
    })),
  });

  await prisma.comment.createMany({
    data: [
      { targetType: "PRODUCT", targetId: products[0].id, content: "Super produit !", isPublished: true, authorId: users[1].id },
      { targetType: "ARTICLE", targetId: articles[0].id, content: "Article intéressant.", isPublished: true, authorId: users[0].id },
    ],
  });

  await prisma.report.createMany({
    data: [
      { targetType: "PRODUCT", targetId: products[1].id, reason: "Problème de qualité", status: "OPEN", reporterId: users[0].id },
      { targetType: "ARTICLE", targetId: articles[1].id, reason: "Contenu inapproprié", status: "OPEN", reporterId: users[1].id },
    ],
  });

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: "subscriber1@example.com" },
      { email: "subscriber2@example.com" },
      { email: "subscriber3@example.com" },
    ],
  });

  await prisma.redirect.createMany({
    data: [
      { sourcePath: "/ancien-produit", destinationUrl: "https://example.com/produit" },
      { sourcePath: "/old-blog", destinationUrl: "https://example.com/blog" },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      { action: "seed", entity: "Product", entityId: products[0].id, metadata: JSON.stringify({ source: "seed" }) },
      { action: "seed", entity: "Article", entityId: articles[0].id, metadata: JSON.stringify({ source: "seed" }) },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
