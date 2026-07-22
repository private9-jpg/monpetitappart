export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  articles?: number;
  followers?: string;
}

export interface AuthorCard {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  articles: number;
  followers: string;
}
