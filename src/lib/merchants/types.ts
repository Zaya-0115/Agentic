export type MerchantSource =
  | "cody"
  | "zary"
  | "shoppy"
  | "shoppyhub";

export type Category =
  | "all"
  | "electronics"
  | "fashion"
  | "home"
  | "beauty"
  | "sports"
  | "toys"
  | "books"
  | "automotive";

export type SortOption =
  | "relevance"
  | "price-low"
  | "price-high"
  | "rating"
  | "reviews"
  | "newest";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  url: string;
  source: MerchantSource;
  /** For Cody SaaS: the merchant website name. For others: same as source display name */
  merchantName: string;
  brand?: string;
  category: Category;
  rating?: number;
  reviewCount?: number;
  onSale: boolean;
  shipping?: {
    cost: number;
    estimatedDays: number;
    freeShipping: boolean;
  };
  inStock: boolean;
}

export interface Filters {
  category: Category;
  onSale: boolean;
  minRating: number;
  priceRange: [number, number];
  sources: MerchantSource[];
  brand: string;
  sortBy: SortOption;
}

export interface SearchResult {
  source: MerchantSource;
  products: Product[];
  error?: string;
}

export interface MerchantAdapter {
  name: string;
  source: MerchantSource;
  type: "local" | "crossborder";
  search(query: string): Promise<Product[]>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  timestamp: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  platform: MerchantSource;
  url: string;
  category: string;
}
