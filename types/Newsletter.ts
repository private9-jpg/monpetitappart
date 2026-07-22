export interface Newsletter {
  id: string | number;
  title: string;
  description: string;
  image: string;
  cta: string;
  subscribers: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt?: string;
  unsubscribedAt?: string;
}
