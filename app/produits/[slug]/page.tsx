import { notFound } from "next/navigation";
import { ProductTemplate } from "@/components/product/ProductTemplate";
import { getProductBySlug, getSimilarProducts, PRODUCT_BY_SLUG } from "@/components/product/ProductData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PRODUCT_BY_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = getSimilarProducts(product.id, 3);

  return <ProductTemplate product={product} similarProducts={similarProducts} />;
}
