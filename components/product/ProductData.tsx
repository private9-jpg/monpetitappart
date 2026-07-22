import type { Product, ProductListItem } from "@/types/Product";
import { PRODUCT_BY_SLUG } from "@/lib/mocks/products";

export type { Product, ProductListItem };

export { PRODUCT_BY_SLUG };

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCT_BY_SLUG[slug];
}

export function getSimilarProducts(currentId: string, count = 3): Product[] {
  return Object.values(PRODUCT_BY_SLUG).filter((product) => product.id !== currentId).slice(0, count);
}
