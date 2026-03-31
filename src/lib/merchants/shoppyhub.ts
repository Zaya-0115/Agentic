import { MerchantAdapter, Product, Category } from "./types";

const categories: Category[] = ["electronics", "fashion", "toys", "home", "books"];
const BRANDS = ["Apple", "Samsung", "Nike", "Dyson", "Lego", "Canon"];

export const shoppyhubAdapter: MerchantAdapter = {
  name: "ShoppyHub",
  source: "shoppyhub",
  type: "crossborder",
  async search(query: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 250 + Math.random() * 350));
    return Array.from({ length: 3 }, (_, i) => {
      const onSale = Math.random() > 0.5;
      const price = +(12 + Math.random() * 90).toFixed(2);
      return {
        id: `shoppyhub-${Date.now()}-${i}`,
        title: `${query} - ShoppyHub Global`,
        description: `International ${query} with global shipping`,
        price: onSale ? +(price * 0.78).toFixed(2) : price,
        originalPrice: onSale ? price : undefined,
        currency: "USD",
        image: `https://placehold.co/400x400/1A8FE3/white?text=${encodeURIComponent(query.slice(0, 10))}`,
        url: `https://shoppyhub.mn/product/shoppyhub-${i}`,
        source: "shoppyhub" as const,
        merchantName: "ShoppyHub.mn",
        brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
        category: categories[i % categories.length],
        rating: +(3.4 + Math.random() * 1.6).toFixed(1),
        reviewCount: Math.floor(80 + Math.random() * 600),
        onSale,
        shipping: { cost: +(3 + Math.random() * 10).toFixed(2), estimatedDays: 5 + Math.floor(Math.random() * 10), freeShipping: Math.random() > 0.6 },
        inStock: Math.random() > 0.2,
      };
    });
  },
};
