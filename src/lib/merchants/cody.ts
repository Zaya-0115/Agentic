import { MerchantAdapter, Product, Category } from "./types";

const categories: Category[] = ["electronics", "fashion", "home", "beauty", "sports", "toys"];
const CODY_MERCHANTS = [
  "TechStore.mn", "FashionHub.mn", "HomeStyle.mn", "GadgetWorld.mn",
  "SportZone.mn", "BeautyBox.mn", "KidsPlay.mn", "AutoParts.mn",
];
const BRANDS = ["Samsung", "Nike", "Adidas", "Apple", "Xiaomi", "Zara", "H&M", "IKEA"];

export const codyAdapter: MerchantAdapter = {
  name: "Cody",
  source: "cody",
  type: "local",

  async search(query: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    return Array.from({ length: 5 }, (_, i) => {
      const onSale = Math.random() > 0.6;
      const price = +(20 + Math.random() * 180).toFixed(2);
      const merchant = CODY_MERCHANTS[i % CODY_MERCHANTS.length];
      return {
        id: `cody-${Date.now()}-${i}`,
        title: `${query} - ${merchant}`,
        description: `${query} from ${merchant} (powered by Cody)`,
        price: onSale ? +(price * 0.75).toFixed(2) : price,
        originalPrice: onSale ? price : undefined,
        currency: "USD",
        image: `https://picsum.photos/seed/cody-${i}/400/400`,
        url: `https://${merchant.toLowerCase()}/product/cody-${i}`,
        source: "cody" as const,
        merchantName: merchant,
        brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
        category: categories[i % categories.length],
        rating: +(3.5 + Math.random() * 1.5).toFixed(1),
        reviewCount: Math.floor(50 + Math.random() * 500),
        onSale,
        shipping: {
          cost: Math.random() > 0.5 ? 0 : +(2 + Math.random() * 8).toFixed(2),
          estimatedDays: 1 + Math.floor(Math.random() * 4),
          freeShipping: Math.random() > 0.5,
        },
        inStock: Math.random() > 0.1,
      };
    });
  },
};
