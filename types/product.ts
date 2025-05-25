export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  thumbnailUrl: string;
  images: string[];
  demoVideo?: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  onSale?: boolean;
  version: string;
  developer: string;
  releaseDate: string;
  license: string;
  platforms: string[];
  sales: number;
  keyFeatures?: string[];
  specifications: Record<string, string>[];
  requirements: Record<string, string[]>;
  reviews: ProductReview[];
  sellerId: string;
}

export interface ProductReview {
  id: string;
  username: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
}