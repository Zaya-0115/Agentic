"use client";
import { useState, useMemo } from "react";
import { useChat } from "@/hooks/useChat";
import { useCart } from "@/hooks/useCart";
import { Filters, Product, ChatMessage, MerchantSource, Category, SortOption, CartItem } from "@/lib/merchants/types";
import ProductCard from "./ProductCard";
import Sidebar from "./Sidebar";
import ChatView from "./ChatView";
import { BRANDS as BRAND_DATA, STORES, getBrandsByCategory, getStoresByPlatform } from "@/lib/merchants/brands";
import SiteFooter from "./Footer";

const ALL_SOURCES: MerchantSource[] = ["cody", "zary", "shoppy", "shoppyhub"];
const BRANDS_LIST = ["Cody", "Shoppy.mn", "Zary.mn", "ShoppyHub.mn"];
const DEFAULT_FILTERS: Filters = {
  category: "all", onSale: false, minRating: 0,
  priceRange: [0, 1000], sources: ALL_SOURCES, brand: "", sortBy: "relevance",
};
const FC = [
  { label: "Куртка", bg: "from-violet-200 to-purple-100" },
  { label: "Пүүз", bg: "from-pink-200 to-rose-100" },
  { label: "Цаг", bg: "from-emerald-200 to-teal-100" },
  { label: "Цүнх", bg: "from-blue-200 to-sky-100" },
  { label: "Гэрэл", bg: "from-amber-200 to-yellow-100" },
  { label: "Утас", bg: "from-red-200 to-orange-100" },
  { label: "Чихэвч", bg: "from-indigo-200 to-violet-100" },
  { label: "Даашинз", bg: "from-fuchsia-200 to-pink-100" },
];

const BROWSE_COLLECTIONS = [
  { title: "Гэрийн тав тухтай бараа", desc: "HomeStyle, IKEA, Philips", bg: "from-amber-700 to-amber-900", img: "https://picsum.photos/seed/home-collection/600/200" },
  { title: "Загварлаг хувцас", desc: "Zara, H&M, Nike, Adidas", bg: "from-gray-700 to-gray-900", img: "https://picsum.photos/seed/fashion-collection/600/200" },
  { title: "Шинэ технологи", desc: "Samsung, Apple, Xiaomi, Sony", bg: "from-violet-700 to-violet-900", img: "https://picsum.photos/seed/tech-collection/600/200" },
];

const BROWSE_CATEGORIES: { label: string; color: string; value: Category; items: string[] }[] = [
  { label: "Гоо сайхан", color: "bg-pink-500", value: "beauty", items: ["Арьс арчилгаа", "Нүүр будалт", "Үнэртэн"] },
  { label: "Хувцас", color: "bg-blue-600", value: "fashion", items: ["Эмэгтэй", "Эрэгтэй", "Хүүхдийн"] },
  { label: "Гэр ахуй", color: "bg-orange-500", value: "home", items: ["Тавилга", "Гал тогоо", "Чимэглэл"] },
  { label: "Электроник", color: "bg-emerald-600", value: "electronics", items: ["Утас", "Зөөврийн", "Дагалдах"] },
  { label: "Спорт", color: "bg-teal-500", value: "sports", items: ["Гүйлт", "Фитнесс", "Гадаа"] },
];

const TOP_BRANDS = [
  { name: "Samsung", color: "bg-blue-100 text-blue-700" },
  { name: "Nike", color: "bg-orange-100 text-orange-700" },
  { name: "Apple", color: "bg-gray-100 text-gray-700" },
  { name: "Adidas", color: "bg-black/5 text-black" },
  { name: "Xiaomi", color: "bg-orange-100 text-orange-600" },
  { name: "Zara", color: "bg-black/5 text-black" },
  { name: "H&M", color: "bg-red-100 text-red-700" },
  { name: "IKEA", color: "bg-blue-100 text-blue-600" },
  { name: "Sony", color: "bg-gray-100 text-gray-700" },
  { name: "Dyson", color: "bg-purple-100 text-purple-700" },
];

export default function ChatInterface() {
  const { messages, products, isLoading, sendMessage } = useChat();
  const cart = useCart();
  const [input, setInput] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activePage, setActivePage] = useState("home");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
    setFilters(DEFAULT_FILTERS);
    setActivePage("listing");
  };
  const searchFor = (q: string) => {
    sendMessage(q);
    setFilters(DEFAULT_FILTERS);
    setActivePage("listing");
  };
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.brand) set.add(p.brand); });
    return Array.from(set).sort();
  }, [products]);
  const filtered = useMemo(() => {
    let r = [...products];
    if (filters.category !== "all") r = r.filter((p) => p.category === filters.category);
    if (filters.onSale) r = r.filter((p) => p.onSale);
    if (filters.minRating > 0) r = r.filter((p) => (p.rating ?? 0) >= filters.minRating);
    r = r.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    r = r.filter((p) => filters.sources.includes(p.source));
    if (filters.brand) r = r.filter((p) => p.brand === filters.brand);
    switch (filters.sortBy) {
      case "price-low": r.sort((a, b) => a.price - b.price); break;
      case "price-high": r.sort((a, b) => b.price - a.price); break;
      case "rating": r.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "reviews": r.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)); break;
    }
    return r;
  }, [products, filters]);
  const lastMsg = [...messages].reverse().find((m: ChatMessage) => m.role === "assistant");
  const updateFilter = (partial: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...partial }));
  const renderPage = () => {
    if (activePage === "listing" && (products.length > 0 || isLoading)) {
      return <ResultsView input={input} setInput={setInput} isLoading={isLoading}
        handleSubmit={handleSubmit} lastMsg={lastMsg} filtered={filtered}
        filters={filters} updateFilter={updateFilter} onAddToCart={cart.addToCart} allBrands={allBrands} />;
    }
    if (activePage === "listing") {
      return <BrowseView searchFor={searchFor} />;
    }
    if (activePage === "chat") {
      return <ChatView onAddToCart={cart.addToCart} />;
    }
    if (activePage === "cart") {
      return <CartView items={cart.items} totalPrice={cart.totalPrice}
        onRemove={cart.removeFromCart} onUpdateQty={cart.updateQuantity} />;
    }
    if (activePage === "brands") return <BrandsView searchFor={searchFor} />;
    if (activePage === "favorites") return <PlaceholderPage title="Хадгалсан" desc="Танд таалагдсан бараануудыг энд хадгалагдана." />;
    return <LandingView input={input} setInput={setInput} isLoading={isLoading} handleSubmit={handleSubmit} />;
  };
  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar active={activePage} onNavigate={setActivePage} cartCount={cart.totalItems} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">{renderPage()}</main>
        {cart.notification && (
          <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-slide-in max-w-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-black truncate">{cart.notification}</p>
              <p className="text-[10px] text-gray-400">Сагсанд нэмэгдлээ</p>
            </div>
          </div>
        )}
      </div>
      {activePage !== "home" && activePage !== "cart" && activePage !== "chat" && (
        <div className="fixed bottom-0 left-16 right-0 z-30 flex justify-center pb-5 pt-3 pointer-events-none">
          <form onSubmit={handleSubmit} className="w-full max-w-xl mx-6 pointer-events-auto">
            <div className="relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Та юу хайж байгаа вэ? Энд бичээрэй."
                className="w-full bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-full px-6 py-4 pr-14 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 shadow-xl shadow-gray-300/20 transition-all"
                disabled={isLoading} />
              <button type="submit" disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary hover:bg-primary-light disabled:opacity-30 text-white flex items-center justify-center transition-colors">
                <ArrIcon />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ==================== BROWSE VIEW ==================== */
function BrowseView({ searchFor }: {
  searchFor: (q: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 space-y-10">
          {/* Featured collections */}
          <section>
            <h2 className="text-lg font-bold text-black mb-4">Онцлох цуглуулга</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BROWSE_COLLECTIONS.map((c, i) => (
                <button key={i} onClick={() => searchFor(c.title)}
                  className="relative h-40 rounded-2xl overflow-hidden group text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-white font-semibold text-sm">{c.title}</h3>
                    <p className="text-white/60 text-xs mt-0.5">{c.desc}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrIcon />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Browse categories */}
          <section>
            <h2 className="text-lg font-bold text-black mb-4">Ангилал үзэх</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {BROWSE_CATEGORIES.map((cat) => (
                <button key={cat.value} onClick={() => searchFor(cat.label)}
                  className={`${cat.color} rounded-2xl p-4 text-left text-white hover:opacity-90 transition-opacity h-32 flex flex-col justify-between`}>
                  <span className="text-sm font-semibold">{cat.label}</span>
                  <div className="flex gap-1 mt-auto">
                    {cat.items.map((item, j) => (
                      <span key={j} className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">{item}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Top brands */}
          <section>
            <h2 className="text-lg font-bold text-black mb-4">Топ брэндүүд</h2>
            <div className="flex flex-wrap gap-2">
              {TOP_BRANDS.map((b) => (
                <button key={b.name} onClick={() => searchFor(b.name)}
                  className={`${b.color} px-4 py-2.5 rounded-xl text-sm font-medium hover:shadow-md transition-all`}>
                  {b.name}
                </button>
              ))}
            </div>
          </section>

          {/* Trending searches */}
          <section>
            <h2 className="text-lg font-bold text-black mb-4">Эрэлттэй хайлтууд</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Ухаалаг цаг", "Чихэвч", "Өвлийн куртка", "Гүйлтийн пүүз", "Арьс арчилгаа", "Зөөврийн компьютер", "Гэрийн чимэглэл", "Хүүхдийн тоглоом"].map((q) => (
                <button key={q} onClick={() => searchFor(q)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-primary/40 hover:text-primary hover:shadow-sm transition-all text-left">
                  {q}
                </button>
              ))}
            </div>
          </section>

          <SiteFooter />
        </div>
      </div>


    </div>
  );
}

/* ==================== OTHER VIEWS ==================== */
function BrandsView({ searchFor }: { searchFor: (q: string) => void }) {
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-8 w-full">
        {STORES.map((store) => {
          const isFollowing = following.has(store.id);
          const products = Array.from({ length: 6 }, (_, i) => ({
            id: `${store.id}-p${i}`,
            title: `${store.category} #${i + 1}`,
            image: `https://picsum.photos/seed/${store.id}-${i}/300/300`,
            price: Math.floor(15000 + Math.random() * 85000),
            rating: +(3.5 + Math.random() * 1.5).toFixed(1),
            reviews: Math.floor(50 + Math.random() * 2000),
            discount: Math.random() > 0.5 ? Math.floor(10 + Math.random() * 30) : 0,
          }));
          return (
            <div key={store.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Store header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/seed/${store.id}-logo/80/80`} alt={store.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                  <div>
                    <h3 className="text-sm font-bold text-black">{store.name}</h3>
                    <p className="text-[11px] text-gray-400">{store.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(store.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isFollowing
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
                    }`}>
                    {isFollowing ? "Дагаж байна" : "Дагах"}
                  </button>
                  <button onClick={() => searchFor(store.name)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-gray-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Horizontal product scroll */}
              <div className="flex gap-3 px-5 pb-5 overflow-x-auto scrollbar-hide">
                {products.map((p) => (
                  <button key={p.id} onClick={() => searchFor(store.name)}
                    className="shrink-0 w-40 text-left group">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {p.discount > 0 && (
                        <span className="absolute top-2 left-2 text-[10px] font-semibold bg-red-500 text-white px-1.5 py-0.5 rounded">{p.discount}% off</span>
                      )}
                      <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-800 font-medium truncate">{p.title}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <span className="text-yellow-500">{"★".repeat(Math.round(p.rating))}</span>
                      <span>({p.reviews.toLocaleString()})</span>
                    </div>
                    <p className="text-sm font-bold text-black">{p.price.toLocaleString()}₮</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <SiteFooter />
      </div>
    </div>
  );
}

function PlaceholderPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-black mb-2">{title}</h2>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function CartView({ items, totalPrice, onRemove, onUpdateQty }: {
  items: CartItem[]; totalPrice: number;
  onRemove: (id: string) => void; onUpdateQty: (id: string, qty: number) => void;
}) {
  if (items.length === 0) return <PlaceholderPage title="Сагс хоосон байна" desc="Бараа хайж сагслаарай." />;

  const DELIVERY: Record<string, { label: string; time: string; color: string }> = {
    cody: { label: "Cody мэрчант", time: "48 цагийн дотор", color: "text-purple-600 bg-purple-50" },
    zary: { label: "Zary.mn", time: "48 цагийн дотор", color: "text-pink-600 bg-pink-50" },
    shoppy: { label: "Shoppy.mn", time: "1-3 өдөр", color: "text-emerald-600 bg-emerald-50" },
    shoppyhub: { label: "ShoppyHub.mn", time: "7-14 өдөр", color: "text-blue-600 bg-blue-50" },
  };

  const grouped = new Map<string, CartItem[]>();
  items.forEach((item) => {
    const key = item.product.source;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  });

  const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";

  return (
    <div className="flex-1 flex flex-col">
      <header className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="text-xl font-bold text-black">Миний сагс</h2>
        <p className="text-xs text-gray-400 mt-1">{items.reduce((s, i) => s + i.quantity, 0)} бараа · {grouped.size} платформ</p>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-4 space-y-6">
          {Array.from(grouped.entries()).map(([source, sourceItems]) => {
            const d = DELIVERY[source] || { label: source, time: "", color: "text-gray-600 bg-gray-50" };
            const subtotal = sourceItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
            return (
              <div key={source} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.color}`}>{d.label}</span>
                    {d.time && <span className="text-[11px] text-gray-400">{"Хүргэлт"}: {d.time}</span>}
                  </div>
                  <span className="text-sm font-semibold text-black">{fmt(subtotal)}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {sourceItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product.image} alt={item.product.title} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-black truncate">{item.product.title}</h3>
                        <p className="text-xs text-gray-400">{item.product.merchantName}</p>
                        <p className="text-sm font-bold text-black mt-0.5">{fmt(item.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs">-</button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs">+</button>
                      </div>
                      <button onClick={() => onRemove(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">{"Нийт дүн"}</span>
            <span className="text-2xl font-bold text-black">{fmt(totalPrice)}</span>
          </div>
          <button className="w-full py-3.5 bg-primary hover:bg-primary-light text-white font-medium rounded-xl transition-colors">{"Төлбөр төлөх"}</button>
        </div>
      </footer>
    </div>
  );
}

function LandingView({ input, setInput, isLoading, handleSubmit }: {
  input: string; setInput: (v: string) => void; isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="flex flex-col relative bg-gradient-to-b from-[#f8f7ff] to-[#f5f5f7]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FC.map((c, i) => {
          const pos = ["top-[8%] left-[5%]","top-[5%] right-[7%]","top-[40%] left-[2%]","top-[35%] right-[2%]",
            "bottom-[15%] left-[7%]","bottom-[18%] right-[6%]","top-[18%] left-[25%]","top-[15%] right-[25%]"];
          const anm = ["animate-float","animate-float-delayed","animate-float-slow","animate-float",
            "animate-float-delayed","animate-float-slow","animate-float","animate-float-slow"];
          const sz: Array<"sm"|"md"|"lg"> = ["lg","md","md","lg","sm","md","sm","sm"];
          return <div key={i} className={`absolute ${pos[i]} ${anm[i]}`}><BubbleCard label={c.label} bg={c.bg} size={sz[i]} /></div>;
        })}
        <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[15%] w-72 h-72 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
      </div>
      <div className="min-h-[80vh] flex flex-col items-center justify-center relative z-10 px-6">
        <h1 className="text-7xl font-bold text-black tracking-tight mb-3">Sel<span className="text-primary">ec</span>to</h1>
        <p className="text-gray-400 text-sm mb-8">AI-powered shopping across all platforms</p>
        <form onSubmit={handleSubmit} className="w-full max-w-xl mb-8">
          <div className="relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Та юу хайж байгаа вэ? Энд бичээрэй"
              className="w-full bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-full px-6 py-4 pr-14 text-base text-black placeholder:text-gray-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 shadow-xl shadow-gray-200/40 transition-all"
              disabled={isLoading} />
            <button type="submit" disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary hover:bg-primary-light disabled:opacity-30 text-white flex items-center justify-center transition-colors">
              <ArrIcon />
            </button>
          </div>
        </form>
        <div className="w-full max-w-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-5 py-4">
          <p className="text-sm font-medium text-black/80 mb-1">Санамж</p>
          <p className="text-xs text-gray-500 leading-relaxed">Хайлтаа илүү нарийвчлан бичвэл илүү сайн үр дүн гарна. Барааны нэр, онцлог шинж чанар, үнийн хүрээ зэргийг оруулна уу.</p>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed italic">{'"50,000-аас доош үнэтэй, усны хамгаалалттай ухаалаг цаг" гэх мэт.'}</p>
        </div>
      </div>
      <div className="relative z-10"><SiteFooter /></div>
      <div className="shrink-0 py-4 border-t border-gray-100/50 bg-white/40 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...BRANDS_LIST, ...BRANDS_LIST, ...BRANDS_LIST, ...BRANDS_LIST].map((b, i) => (
            <span key={i} className="mx-8 text-lg font-semibold text-gray-300 select-none">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ==================== RESULTS VIEW ==================== */
const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "Бүгд" }, { value: "electronics", label: "Электроник" },
  { value: "fashion", label: "Хувцас" }, { value: "home", label: "Гэр ахуй" },
  { value: "beauty", label: "Гоо сайхан" }, { value: "sports", label: "Спорт" },
  { value: "toys", label: "Тоглоом" }, { value: "books", label: "Ном" },
  { value: "automotive", label: "Авто" },
];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Хамааралтай" }, { value: "price-low", label: "Үнэ: Бага-Их" },
  { value: "price-high", label: "Үнэ: Их-Бага" }, { value: "rating", label: "Өндөр үнэлгээ" },
  { value: "reviews", label: "Их сэтгэгдэл" },
];
const RATING_OPTIONS = [
  { value: 0, label: "Бүгд" }, { value: 3, label: "3+ од" },
  { value: 4, label: "4+ од" }, { value: 5, label: "5 од" },
];
const PLATFORM_LABELS: Record<string, string> = {
  cody: "Cody", zary: "Zary.mn", shoppy: "Shoppy.mn", shoppyhub: "ShoppyHub.mn",
};

function ResultsView({ input, setInput, isLoading, handleSubmit, lastMsg, filtered, filters, updateFilter, onAddToCart, allBrands }: {
  input: string; setInput: (v: string) => void; isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void; lastMsg: ChatMessage | undefined;
  filtered: Product[]; filters: Filters; updateFilter: (p: Partial<Filters>) => void;
  onAddToCart: (p: Product) => void; allBrands: string[];
}) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="shrink-0 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 pt-3 pb-1">
          <span className="text-2xl font-bold text-black tracking-tight">Sel<span className="text-primary">ec</span>to</span>
          <span className="text-xs text-gray-400 ml-3">{filtered.length} {"үр дүн"}</span>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center gap-2 flex-wrap">
            <FDrop label="Ангилал" onChange={(v) => updateFilter({ category: v as Category })}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </FDrop>
            <FDrop label="Эрэмбэлэх" onChange={(v) => updateFilter({ sortBy: v as SortOption })}>
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </FDrop>
            <FDrop label="Үнэлгээ" onChange={(v) => updateFilter({ minRating: Number(v) })}>
              {RATING_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </FDrop>
            <FDrop label="Үнэ" onChange={(v) => {
              const ranges: Record<string, [number, number]> = { "all": [0, 1000], "0-25": [0, 25], "25-50": [25, 50], "50-100": [50, 100], "100-200": [100, 200], "200+": [200, 1000] };
              updateFilter({ priceRange: ranges[v] || [0, 1000] });
            }}>
              <option value="all">Бүх үнэ</option><option value="0-25">$25 хүртэл</option><option value="25-50">$25-$50</option>
              <option value="50-100">$50-$100</option><option value="100-200">$100-$200</option><option value="200+">$200+</option>
            </FDrop>
            <button onClick={() => updateFilter({ onSale: !filters.onSale })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filters.onSale ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>Хямдрал</button>
            <FDrop label="Платформ" onChange={(v) => { if (v === "all") { updateFilter({ sources: ALL_SOURCES }); return; } updateFilter({ sources: [v as MerchantSource] }); }}>
              <option value="all">Бүх платформ</option>
              {ALL_SOURCES.map(s => <option key={s} value={s}>{PLATFORM_LABELS[s]}</option>)}
            </FDrop>
            {allBrands.length > 0 && (
              <FDrop label="Брэнд" onChange={(v) => updateFilter({ brand: v === "all" ? "" : v })}>
                <option value="all">Бүх брэнд</option>
                {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </FDrop>
            )}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {lastMsg && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-white border border-gray-100 text-sm text-black/70 shadow-sm"
              dangerouslySetInnerHTML={{ __html: lastMsg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black">$1</strong>') }} />
          )}
          {isLoading && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="flex gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.15s]" /><span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.3s]" /></span>Хайж байна...</div>
            </div>
          )}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((p: Product) => (<ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />))}
            </div>
          ) : (<p className="text-center py-16 text-gray-400 text-sm">Таны шүүлтүүрт тохирох бараа олдсонгүй.</p>)}
          <SiteFooter />
        </div>
      </div>

    </div>
  );
}

/* ==================== HELPERS ==================== */
function FDrop({ label, onChange, children }: { label: string; onChange: (v: string) => void; children: React.ReactNode; }) {
  return (
    <div className="relative">
      <select onChange={(e) => onChange(e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-full pl-3 pr-7 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 focus:outline-none focus:border-primary/40 cursor-pointer">
        <option value="">{label}</option>{children}
      </select>
      <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
    </div>
  );
}
function ArrIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
}
const BUBBLE_SIZES = { sm: "w-20 h-20", md: "w-28 h-28", lg: "w-36 h-36" };
const LABEL_SIZES = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" };
function BubbleCard({ label, bg, size = "md" }: { label: string; bg: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`${BUBBLE_SIZES[size]} rounded-full bg-gradient-to-br ${bg} shadow-lg shadow-gray-200/40 backdrop-blur-sm flex items-center justify-center border border-white/60`}>
      <span className={`${LABEL_SIZES[size]} font-medium text-gray-600`}>{label}</span>
    </div>
  );
}
