export interface Merchant {
  id: string;
  name: string;
  slug: string;
  websiteUrl?: string;
  description?: string;
}

export interface MerchantOffer {
  id: string;
  merchant: string;
  merchantId?: string;
  price: string;
  oldPrice?: string;
  unit: string;
  availability: string;
  href: string;
  isActive?: boolean;
  bestPrice?: boolean;
}
