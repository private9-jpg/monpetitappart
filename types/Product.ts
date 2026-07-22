export interface Product {
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
  offers?: ProductOffer[];
  categories?: string[];
  affiliate?: {
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
  };
}

export interface ProductOffer {
  merchant: string;
  merchantId?: string;
  price: string;
  oldPrice?: string;
  unit: string;
  href: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  unit: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string | null;
  href: string;
}
