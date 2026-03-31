import { Brand, Store } from "./types";

export const BRANDS: Brand[] = [
  { id: "brand-samsung", logo: "https://picsum.photos/seed/samsung-logo/80/80", name: "Samsung", category: "Электроник" },
  { id: "brand-apple", logo: "https://picsum.photos/seed/apple-logo/80/80", name: "Apple", category: "Электроник" },
  { id: "brand-xiaomi", logo: "https://picsum.photos/seed/xiaomi-logo/80/80", name: "Xiaomi", category: "Электроник" },
  { id: "brand-sony", logo: "https://picsum.photos/seed/sony-logo/80/80", name: "Sony", category: "Электроник" },
  { id: "brand-lg", logo: "https://picsum.photos/seed/lg-logo/80/80", name: "LG", category: "Электроник" },
  { id: "brand-nike", logo: "https://picsum.photos/seed/nike-logo/80/80", name: "Nike", category: "Хувцас & Спорт" },
  { id: "brand-adidas", logo: "https://picsum.photos/seed/adidas-logo/80/80", name: "Adidas", category: "Хувцас & Спорт" },
  { id: "brand-zara", logo: "https://picsum.photos/seed/zara-logo/80/80", name: "Zara", category: "Хувцас" },
  { id: "brand-hm", logo: "https://picsum.photos/seed/hm-logo/80/80", name: "H&M", category: "Хувцас" },
  { id: "brand-uniqlo", logo: "https://picsum.photos/seed/uniqlo-logo/80/80", name: "Uniqlo", category: "Хувцас" },
  { id: "brand-mango", logo: "https://picsum.photos/seed/mango-logo/80/80", name: "Mango", category: "Хувцас" },
  { id: "brand-ikea", logo: "https://picsum.photos/seed/ikea-logo/80/80", name: "IKEA", category: "Гэр ахуй" },
  { id: "brand-philips", logo: "https://picsum.photos/seed/philips-logo/80/80", name: "Philips", category: "Гэр ахуй" },
  { id: "brand-bosch", logo: "https://picsum.photos/seed/bosch-logo/80/80", name: "Bosch", category: "Гэр ахуй" },
  { id: "brand-dyson", logo: "https://picsum.photos/seed/dyson-logo/80/80", name: "Dyson", category: "Гэр ахуй" },
  { id: "brand-lego", logo: "https://picsum.photos/seed/lego-logo/80/80", name: "Lego", category: "Тоглоом" },
  { id: "brand-canon", logo: "https://picsum.photos/seed/canon-logo/80/80", name: "Canon", category: "Электроник" },
];

export const STORES: Store[] = [
  // Cody SaaS merchants
  { id: "store-techstore", name: "TechStore.mn", platform: "cody", url: "https://techstore.mn", category: "Электроник" },
  { id: "store-fashionhub", name: "FashionHub.mn", platform: "cody", url: "https://fashionhub.mn", category: "Хувцас" },
  { id: "store-homestyle", name: "HomeStyle.mn", platform: "cody", url: "https://homestyle.mn", category: "Гэр ахуй" },
  { id: "store-gadgetworld", name: "GadgetWorld.mn", platform: "cody", url: "https://gadgetworld.mn", category: "Электроник" },
  { id: "store-sportzone", name: "SportZone.mn", platform: "cody", url: "https://sportzone.mn", category: "Спорт" },
  { id: "store-beautybox", name: "BeautyBox.mn", platform: "cody", url: "https://beautybox.mn", category: "Гоо сайхан" },
  { id: "store-kidsplay", name: "KidsPlay.mn", platform: "cody", url: "https://kidsplay.mn", category: "Тоглоом" },
  { id: "store-autoparts", name: "AutoParts.mn", platform: "cody", url: "https://autoparts.mn", category: "Авто" },
  // Platform stores
  { id: "store-zary", name: "Zary.mn", platform: "zary", url: "https://zary.mn", category: "Хувцас & Гоо сайхан" },
  { id: "store-shoppy", name: "Shoppy.mn", platform: "shoppy", url: "https://shoppy.mn", category: "Бүх төрөл" },
  { id: "store-shoppyhub", name: "ShoppyHub.mn", platform: "shoppyhub", url: "https://shoppyhub.mn", category: "Олон улсын" },
];

export function getBrandsByCategory(): Map<string, Brand[]> {
  const map = new Map<string, Brand[]>();
  BRANDS.forEach((b) => {
    if (!map.has(b.category)) map.set(b.category, []);
    map.get(b.category)!.push(b);
  });
  return map;
}

export function getStoresByPlatform(): Map<string, Store[]> {
  const map = new Map<string, Store[]>();
  STORES.forEach((s) => {
    const key = s.platform === "cody" ? "Cody (мерчантууд)" : s.name;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  });
  return map;
}
