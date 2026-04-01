"use client";
import { useState, useCallback, createContext, useContext, ReactNode } from "react";

export type Lang = "mn" | "en";

const T: Record<string, Record<Lang, string>> = {
  "nav.home": { mn: "Нүүр", en: "Home" },
  "nav.listing": { mn: "Хайх", en: "Browse" },
  "nav.cart": { mn: "Сагс", en: "Cart" },
  "nav.favorites": { mn: "Хадгалсан", en: "Saved" },
  "nav.wallet": { mn: "Хэтэвч", en: "Wallet" },
  "nav.logout": { mn: "Гарах", en: "Logout" },
  "home.placeholder": { mn: "Та юу хайж байгаа вэ? Энд бичээрэй", en: "What are you looking for? Type here" },
  "browse.featured": { mn: "Онцлох дэлгүүр", en: "Featured stores" },
  "browse.top": { mn: "Топ борлуулалт", en: "Top selling" },
  "browse.search_store": { mn: "Дэлгүүр хайх...", en: "Search store..." },
  "results.count": { mn: "үр дүн", en: "results" },
  "results.searching": { mn: "Хайж байна...", en: "Searching..." },
  "results.no_match": { mn: "Таны шүүлтүүрт тохирох бараа олдсонгүй.", en: "No products match your filters." },
  "filter.category": { mn: "Ангилал", en: "Category" },
  "filter.sort": { mn: "Эрэмбэлэх", en: "Sort" },
  "filter.rating": { mn: "Үнэлгээ", en: "Rating" },
  "filter.price": { mn: "Үнэ", en: "Price" },
  "filter.sale": { mn: "Хямдрал", en: "Sale" },
  "filter.platform": { mn: "Платформ", en: "Platform" },
  "filter.brand": { mn: "Брэнд", en: "Brand" },
  "filter.all": { mn: "Бүгд", en: "All" },
  "filter.all_price": { mn: "Бүх үнэ", en: "All prices" },
  "filter.all_platform": { mn: "Бүх платформ", en: "All platforms" },
  "filter.all_brand": { mn: "Бүх брэнд", en: "All brands" },
  "cart.empty": { mn: "Сагс хоосон байна", en: "Cart is empty" },
  "cart.empty_desc": { mn: "Бараа хайж сагслаарай.", en: "Search and add products." },
  "cart.my_cart": { mn: "Миний сагс", en: "My cart" },
  "cart.delivery": { mn: "Хүргэлт", en: "Delivery" },
  "cart.total": { mn: "Нийт дүн", en: "Total" },
  "cart.pay": { mn: "Төлбөр төлөх", en: "Pay now" },
  "cart.added": { mn: "Сагсанд нэмэгдлээ", en: "Added to cart" },
  "profile.orders": { mn: "Захиалгууд", en: "Orders" },
  "profile.info": { mn: "Хувийн мэдээлэл", en: "Personal info" },
  "profile.address": { mn: "Хүргэлтийн хаяг", en: "Delivery address" },
  "profile.settings": { mn: "Тохиргоо", en: "Settings" },
  "profile.feedback": { mn: "Санал хүсэлт", en: "Feedback" },
  "profile.language": { mn: "Хэл", en: "Language" },
  "profile.edit": { mn: "Засах", en: "Edit" },
  "profile.save": { mn: "Хадгалах", en: "Save" },
  "profile.cancel": { mn: "Болих", en: "Cancel" },
  "profile.send": { mn: "Илгээх", en: "Send" },
  "profile.feedback_placeholder": { mn: "Санал хүсэлтээ бичнэ үү...", en: "Write your feedback..." },
  "profile.feedback_sent": { mn: "Баярлалаа! Санал хүсэлт илгээгдлээ.", en: "Thank you! Feedback sent." },
  "chat.placeholder": { mn: "Бараа хайх, зураг хавсаргах...", en: "Search products, attach image..." },
  "chat.welcome": { mn: "Сайн байна уу! Ямар бараа хайж байгаагаа бичээрэй.", en: "Hello! Tell me what you're looking for." },
  "chat.new": { mn: "Шинэ чат", en: "New chat" },
  "wallet.balance": { mn: "Нийт үлдэгдэл", en: "Total balance" },
  "wallet.topup": { mn: "Цэнэглэх", en: "Top up" },
  "wallet.withdraw": { mn: "Гаргах", en: "Withdraw" },
  "wallet.bank": { mn: "Данс", en: "Bank" },
  "wallet.cards": { mn: "Миний карт", en: "My cards" },
  "wallet.add_card": { mn: "Нэмэх", en: "Add" },
  "wallet.transactions": { mn: "Гүйлгээ", en: "Transactions" },
  "wallet.income": { mn: "Орлого", en: "Income" },
  "wallet.expense": { mn: "Зарлага", en: "Expense" },
};

interface LangContextType {
  lang: Lang;
  t: (key: string) => string;
  switchLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "mn",
  t: (key) => key,
  switchLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") return (localStorage.getItem("lang") as Lang) || "mn";
    return "mn";
  });

  const t = useCallback((key: string): string => T[key]?.[lang] || key, [lang]);

  const switchLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== "undefined") localStorage.setItem("lang", newLang);
  }, []);

  return <LangContext.Provider value={{ lang, t, switchLang }}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  return useContext(LangContext);
}
