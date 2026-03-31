import { Brand, Store } from "./types";

export const BRANDS: Brand[] = [
  { id: "brand-samsung", name: "Samsung", category: "Электроник" },
  { id: "brand-apple", name: "Apple", category: "Электроник" },
  { id: "brand-xiaomi", name: "Xiaomi", category: "Электроник" },
  { id: "brand-sony", name: "Sony", category: "Электроник" },
  { id: "brand-lg", name: "LG", category: "Электроник" },
  { id: "brand-nike", name: "Nike", category: "Хувцас & Спорт" },
  { id: "brand-adidas", name: "Adidas", category: "Хувцас & Спорт" },
  { id: "brand-zara", name: "Zara", category: "Хувцас" },
  { id: "brand-hm", name: "H&M", category: "Хувцас" },
  { id: "brand-uniqlo", name: "Uniqlo", category: "Хувцас" },
  { id: "brand-mango", name: "Mango", category: "Хувцас" },
  { id: "brand-ikea", name: "IKEA", category: "Гэр ахуй" },
  { id: "brand-philips", name: "Philips", category: "Гэр ахуй" },
  { id: "brand-bosch", name: "Bosch", category: "Гэр ахуй" },
  { id: "brand-dyson", name: "Dyson", category: "Гэр ахуй" },
  { id: "brand-lego", name: "Lego", category: "Тоглоом" },
  { id: "brand-canon", name: "Canon", category: "Электроник" },
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
