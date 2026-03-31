import { MerchantAdapter, Product, Category } from "./types";

const categories: Category[] = ["fashion", "beauty", "home", "sports"];
const BRANDS = ["Zara", "H&M", "Mango", "Uniqlo", "Nike", "Adidas"];

export const zaryAdapter: MerchantAdapter = {
  name: "Zary",
  source: "zary",
  type: "local",
  async search(query: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 150 + Math.random() * 250));
    return Array.from({ length: 3 }, (_, i) => {
      const onSale = Math.random() > 0.5;
      const price = +(15 + Math.random() * 150).toFixed(2);
      return {
        id: `zary-${Date.now()}-${i}`,
        title: `${query} - Zary Collection`,
        description: `Trendy ${query} from Zary's curated selection`,
        price: onSale ? +(price * 0.8).toFixed(2) : price,
        originalPrice: onSale ? price : undefined,
        currency: "USD",
        image: `https://placehold.co/400x400/E14B6C/white?text=${encodeURIComponent(query.slice(0, 10))}`,
        url: `https://zary.mn/product/zary-${i}`,
        source: "zary" as const,
        merchantName: "Zary.mn",
        brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
        category: categories[i % categories.length],
        rating: +(3.8 + Math.random() * 1.2).toFixed(1),
        reviewCount: Math.floor(30 + Math.random() * 300),
        onSale,
        shipping: { cost: 0, estimatedDays: 2 + Math.floor(Math.random() * 3), freeShipping: true },
        inStock: true,
      };
    });
  },
};
