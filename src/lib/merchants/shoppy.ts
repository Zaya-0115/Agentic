import { MerchantAdapter, Product, Category } from "./types";

const categories: Category[] = ["electronics", "home", "toys", "books", "automotive"];
const BRANDS = ["Samsung", "LG", "Xiaomi", "Philips", "Sony", "Bosch"];

export const shoppyAdapter: MerchantAdapter = {
  name: "Shoppy",
  source: "shoppy",
  type: "local",
  async search(query: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 100 + Math.random() * 200));
    return Array.from({ length: 3 }, (_, i) => {
      const onSale = Math.random() > 0.55;
      const price = +(10 + Math.random() * 120).toFixed(2);
      return {
        id: `shoppy-${Date.now()}-${i}`,
        title: `${query} - Shoppy Deal`,
        description: `Best price ${query} on Shoppy`,
        price: onSale ? +(price * 0.7).toFixed(2) : price,
        originalPrice: onSale ? price : undefined,
        currency: "USD",
        image: `https://picsum.photos/seed/shoppy-${i}/400/400`,
        url: `https://shoppy.mn/product/shoppy-${i}`,
        source: "shoppy" as const,
        merchantName: "Shoppy.mn",
        brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
        category: categories[i % categories.length],
        rating: +(3.2 + Math.random() * 1.8).toFixed(1),
        reviewCount: Math.floor(100 + Math.random() * 1000),
        onSale,
        shipping: { cost: +(Math.random() * 5).toFixed(2), estimatedDays: 1 + Math.floor(Math.random() * 3), freeShipping: Math.random() > 0.3 },
        inStock: Math.random() > 0.05,
      };
    });
  },
};
