import type { Product, ProductListItem } from "@//types/Product";
import Image from "next/image";
import Link from "next/link";
import { SiteLayout } from "@/components/layouts/SiteLayout";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCardGrid } from "@/components/product/ProductCard";
import { AffiliateCTA } from "@/components/affiliate/AffiliateCTA";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { Newsletter } from "@/components/newsletter/Newsletter";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Check, X, ArrowLeft } from "lucide-react";

export type ClientProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: string;
  oldPrice?: string;
  unit: string;
  imageUrl?: string;
  images: string[];
  rating: number;
  reviews: number;
  merchant?: string;
  merchantId?: string;
  affiliateUrl: string;
  productUrl?: string;
  isPublished?: boolean;
  publishedAt?: string;
  features?: { label: string; value: string }[];
  advantages?: string[];
  disadvantages?: string[];
  offers?: {
    merchant: string;
    merchantId?: string;
    price: string;
    oldPrice?: string;
    unit: string;
    href: string;
  }[];
  categories?: string[];
  affiliate?: {
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
  };
};

interface ProductTemplateProps {
  product: ClientProduct;
  similarProducts: ClientProduct[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Note ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-accent-500 text-accent-500" : "text-surface-300"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ProductTemplate({ product, similarProducts }: ProductTemplateProps) {
  return (
    <SiteLayout>
      <div className="flex flex-col">
        <Section className="pt-8">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
              <Link href="/" className="hover:text-surface-900 dark:hover:text-surface-50">Accueil</Link>
              <span aria-hidden="true">/</span>
              <Link href="/produits" className="hover:text-surface-900 dark:hover:text-surface-50">Produits</Link>
              <span aria-hidden="true">/</span>
              <span className="text-surface-900 dark:text-surface-50">{product.name}</span>
            </nav>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <ProductGallery images={product.images} productName={product.name} />

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <Badge variant="outline" className="w-fit text-xs">Produit</Badge>
                  <h1 className="font-display text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl lg:text-5xl dark:text-surface-50">
                    {product.name}
                  </h1>
                  <p className="text-base text-surface-600 dark:text-surface-400">{product.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <StarRating rating={product.rating} />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{product.reviews} avis</span>
                </div>

                <div className="flex items-end gap-3">
                  <span className="text-3xl font-semibold text-surface-900 dark:text-surface-50">{product.price} {product.unit}</span>
                  {product.oldPrice && (
                    <span className="text-base text-surface-500 line-through">{product.oldPrice} {product.unit}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-900 dark:text-surface-50">Caractéristiques</h3>
                  <ul className="flex flex-col gap-2">
                    {product.features?.map((feature) => (
                      <li key={feature.label} className="flex items-center justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">{feature.label}</span>
                        <span className="font-medium text-surface-900 dark:text-surface-50">{feature.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Avantages</h3>
                    <ul className="flex flex-col gap-2">
                      {(product.advantages ?? []).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                          <Check className="mt-0.5 size-4 text-emerald-600 dark:text-emerald-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">Inconvénients</h3>
                    <ul className="flex flex-col gap-2">
                      {(product.disadvantages ?? []).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                          <X className="mt-0.5 size-4 text-red-600 dark:text-red-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-surface-900 dark:text-surface-50">
                Offres disponibles
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Marchand</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Prix</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-surface-900 sm:px-6 dark:text-surface-50">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(product.offers ?? []).map((offer, index) => (
                      <tr key={index} className="border-b border-surface-100 last:border-b-0 dark:border-surface-800">
                        <td className="px-4 py-4 text-sm font-medium text-surface-900 sm:px-6 dark:text-surface-50">{offer.merchant}</td>
                        <td className="px-4 py-4 text-sm text-surface-700 dark:text-surface-300">
                          {offer.price} {offer.unit}
                          {offer.oldPrice && <span className="ml-2 text-xs text-surface-500 line-through">{offer.oldPrice} {offer.unit}</span>}
                        </td>
                        <td className="px-4 py-4 text-right sm:px-6">
                          <Button size="sm" asChild>
                            <a href={offer.href}>Voir l&apos;offre</a>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-7xl">
            {product.affiliate && (
              <AffiliateCTA
                product={{
                  id: String(product.id),
                  name: product.name,
                  description: product.description ?? "",
                  price: product.price,
                  oldPrice: product.oldPrice,
                  unit: product.unit,
                  rating: product.rating,
                  reviews: product.reviews,
                  image: product.imageUrl ?? product.images[0] ?? "",
                  href: product.affiliate.href,
                }}
              />
            )}
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-7xl">
            <ProductCardGrid />
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-7xl">
            <Newsletter />
          </div>
        </Section>
      </div>
    </SiteLayout>
  );
}
