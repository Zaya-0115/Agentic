"use client";
import { Product } from "@/lib/merchants/types";

function fmt(n: number): string {
  return n.toLocaleString("mn-MN") + "\u20AE";
}

const DELIVERY: Record<string, { time: string; policy: string }> = {
  cody: { time: "48 цагийн дотор", policy: "Буцаалт: 14 хоногийн дотор. Cody мерчантын баталгаатай." },
  zary: { time: "48 цагийн дотор", policy: "Буцаалт: 7 хоногийн дотор. Zary.mn-н стандарт хүргэлт." },
  shoppy: { time: "1-3 өдөр", policy: "Буцаалт: 14 хоногийн дотор. Shoppy.mn баталгаат худалдаа." },
  shoppyhub: { time: "7-14 өдөр", policy: "Олон улсын хүргэлт. Буцаалт: 30 хоногийн дотор." },
};

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onFavorite: (p: Product) => void;
}

export default function ProductDetail({ product, onClose, onAddToCart, onFavorite }: Props) {
  const delivery = DELIVERY[product.source] || { time: "Тодорхойгүй", policy: "" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <div className="sticky top-0 z-10 flex justify-end p-4">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-8 pb-8 -mt-4">
          {/* Source-specific layout */}
          {product.source === "cody" && <CodyLayout product={product} delivery={delivery} />}
          {product.source === "zary" && <ZaryLayout product={product} delivery={delivery} />}
          {product.source === "shoppy" && <ShoppyLayout product={product} delivery={delivery} />}
          {product.source === "shoppyhub" && <ShoppyHubLayout product={product} delivery={delivery} />}

          {/* Action buttons - shared */}
          <div className="flex gap-3 mt-6">
            <button onClick={() => onFavorite(product)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-red-300 hover:text-red-500 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              Хадгалах
            </button>
            <button onClick={() => { onAddToCart(product); onClose(); }}
              className="flex-[2] py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-medium transition-colors">
              Сагсанд нэмэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== CODY: Мерчант-focused layout ===== */
function CodyLayout({ product, delivery }: { product: Product; delivery: { time: string; policy: string } }) {
  return (
    <div className="space-y-5">
      <div className="flex gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} className="w-48 h-48 rounded-2xl object-cover bg-gray-50" />
        <div className="flex-1 space-y-2">
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">{product.merchantName}</span>
          <h2 className="text-xl font-bold text-black">{product.title}</h2>
          {product.brand && <p className="text-sm text-gray-400">Брэнд: {product.brand}</p>}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-black">{fmt(product.price)}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through">{fmt(product.originalPrice)}</span>}
            {product.onSale && <span className="text-xs text-red-500 font-medium">Хямдралтай</span>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InfoCard label="Үнэлгээ" value={product.rating ? `${product.rating} / 5 (${product.reviewCount} сэтгэгдэл)` : "Үнэлгээгүй"} />
        <InfoCard label="Нөөц" value={product.inStock ? "Байгаа" : "Дууссан"} />
        <InfoCard label="Хүргэлт" value={delivery.time} />
        <InfoCard label="Платформ" value="Cody SaaS" />
      </div>
      <p className="text-xs text-gray-400">{delivery.policy}</p>
      <p className="text-sm text-gray-600">{product.description}</p>
    </div>
  );
}

/* ===== ZARY: Fashion-focused layout ===== */
function ZaryLayout({ product, delivery }: { product: Product; delivery: { time: string; policy: string } }) {
  return (
    <div className="space-y-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.title} className="w-full h-64 rounded-2xl object-cover bg-gray-50" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">Zary.mn</span>
          {product.brand && <span className="text-xs text-gray-400">{product.brand}</span>}
          {product.onSale && <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">SALE</span>}
        </div>
        <h2 className="text-xl font-bold text-black">{product.title}</h2>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-black">{fmt(product.price)}</span>
          {product.originalPrice && <span className="text-base text-gray-400 line-through">{fmt(product.originalPrice)}</span>}
        </div>
      </div>
      <div className="flex gap-4 text-sm text-gray-500">
        <span>Хүргэлт: {delivery.time}</span>
        <span>Үнэлгээ: {product.rating ?? "-"}</span>
      </div>
      <p className="text-xs text-gray-400">{delivery.policy}</p>
      <p className="text-sm text-gray-600">{product.description}</p>
    </div>
  );
}

/* ===== SHOPPY: Deal-focused layout ===== */
function ShoppyLayout({ product, delivery }: { product: Product; delivery: { time: string; policy: string } }) {
  return (
    <div className="space-y-5">
      <div className="flex gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} className="w-40 h-40 rounded-2xl object-cover bg-gray-50" />
        <div className="flex-1">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Shoppy.mn</span>
          <h2 className="text-lg font-bold text-black mt-2">{product.title}</h2>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-emerald-600">{fmt(product.price)}</span>
            {product.originalPrice && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 line-through">{fmt(product.originalPrice)}</span>
                <span className="text-xs text-red-500 font-medium">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-emerald-50 rounded-xl p-3 text-sm text-emerald-700">
        Хүргэлт: {delivery.time} · {product.reviewCount ?? 0} сэтгэгдэл · Үнэлгээ: {product.rating ?? "-"}
      </div>
      <p className="text-xs text-gray-400">{delivery.policy}</p>
      <p className="text-sm text-gray-600">{product.description}</p>
    </div>
  );
}

/* ===== SHOPPYHUB: International layout ===== */
function ShoppyHubLayout({ product, delivery }: { product: Product; delivery: { time: string; policy: string } }) {
  return (
    <div className="space-y-5">
      <div className="flex gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title} className="w-44 h-44 rounded-2xl object-cover bg-gray-50" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">ShoppyHub.mn</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Олон улсын</span>
          </div>
          <h2 className="text-xl font-bold text-black">{product.title}</h2>
          {product.brand && <p className="text-sm text-gray-500">Брэнд: {product.brand}</p>}
          <span className="text-2xl font-bold text-black">{fmt(product.price)}</span>
          {product.originalPrice && <span className="text-sm text-gray-400 line-through ml-2">{fmt(product.originalPrice)}</span>}
        </div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Хүргэлт</span>
          <span className="font-medium text-blue-800">{delivery.time}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Хүргэлтийн төлбөр</span>
          <span className="font-medium text-blue-800">{product.shipping?.freeShipping ? "Үнэгүй" : fmt(product.shipping?.cost ?? 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Үнэлгээ</span>
          <span className="font-medium text-blue-800">{product.rating ?? "-"} ({product.reviewCount ?? 0})</span>
        </div>
      </div>
      <p className="text-xs text-gray-400">{delivery.policy}</p>
      <p className="text-sm text-gray-600">{product.description}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-black">{value}</p>
    </div>
  );
}
