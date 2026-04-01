"use client";
import { useState } from "react";
import { Product } from "@/lib/merchants/types";

function fmt(n: number) { return n.toLocaleString("mn-MN") + "\u20ae"; }

const DELIVERY: Record<string, { time: string; policy: string }> = {
  cody: { time: "48 цагийн дотор", policy: "Буцаалт 14 хоногийн дотор" },
  zary: { time: "48 цагийн дотор", policy: "Буцаалт 7 хоногийн дотор" },
  shoppy: { time: "1-3 өдөр", policy: "Буцаалт 14 хоногийн дотор" },
  shoppyhub: { time: "7-14 өдөр", policy: "Олон улсын хүргэлт. Буцаалт 30 хоног" },
};

const VARIANTS = ["S", "M", "L", "XL"];

interface Props {
  product: Product;
  similarProducts: Product[];
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onFavorite: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
}

export default function ProductDetail({ product, similarProducts, onClose, onAddToCart, onFavorite, onSelectProduct }: Props) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("M");
  const [shared, setShared] = useState(false);
  const d = DELIVERY[product.source] || { time: "Тодорхойгүй", policy: "" };
  const imgs = [
    product.image,
    `https://picsum.photos/seed/${product.id}-2/400/400`,
    `https://picsum.photos/seed/${product.id}-3/400/400`,
  ];
  const [activeImg, setActiveImg] = useState(0);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.title, text: product.description }); } catch {}
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <div className="flex justify-end p-4 pb-0">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* Top: images + info */}
          <div className="flex gap-8 flex-col sm:flex-row">
            {/* Images */}
            <div className="sm:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgs[activeImg]} alt={product.title} className="w-full aspect-square rounded-2xl object-cover bg-gray-50" />
              <div className="flex gap-2 mt-3">
                {imgs.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${activeImg === i ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="sm:w-1/2 space-y-4">
              <div>
                <span className="text-xs text-gray-400">{product.merchantName}</span>
                <h2 className="text-xl font-bold text-black mt-1">{product.title}</h2>
                {product.brand && <p className="text-sm text-gray-500 mt-1">{product.brand}</p>}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className={`text-3xl font-bold ${product.onSale ? "text-red-500" : "text-black"}`}>{fmt(product.price)}</span>
                {product.originalPrice && <span className="text-base text-gray-400 line-through">{fmt(product.originalPrice)}</span>}
                {product.onSale && product.originalPrice && (
                  <span className="text-sm text-red-500 font-medium">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm">
                {product.rating && <span className="text-yellow-500">{"★".repeat(Math.round(product.rating))}</span>}
                {product.rating && <span className="text-gray-500">{product.rating}</span>}
                {product.reviewCount && <span className="text-gray-400">({product.reviewCount} сэтгэгдэл)</span>}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-sm text-gray-600">{product.inStock ? "Нөөцөд байгаа" : "Дууссан"}</span>
              </div>

              {/* Variants */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Хэмжээ</p>
                <div className="flex gap-2">
                  {VARIANTS.map((v) => (
                    <button key={v} onClick={() => setSelectedVariant(v)}
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${selectedVariant === v ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Тоо ширхэг</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">-</button>
                  <span className="text-base font-medium w-8 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Хүргэлт</span>
                  <span className="font-medium text-black">{d.time}</span>
                </div>
                <p className="text-[11px] text-gray-400">{d.policy}</p>
              </div>

              {/* Store */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${product.source}-logo/80/80`} alt={product.merchantName} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black">{product.merchantName}</p>
                  <p className="text-[11px] text-gray-400">{product.source === "cody" ? "Cody SaaS мэрчант" : product.source === "shoppyhub" ? "Олон улсын" : "Монгол платформ"}</p>
                </div>
                <button onClick={() => { onClose(); onSelectProduct({ ...product, title: product.merchantName }); }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors">
                  {"Дэлгүүр үзэх"}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => onFavorite(product)}
                  className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                </button>
                <button onClick={handleShare}
                  className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-colors">
                  {shared ? <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>}
                </button>
                <button onClick={() => { onAddToCart(product, qty); onClose(); }}
                  className="flex-1 py-3 bg-primary hover:bg-primary-light text-white font-medium rounded-xl transition-colors text-sm">
                  Сагсанд нэмэх
                </button>
                <button onClick={() => { onAddToCart(product, qty); onClose(); }}
                  className="flex-1 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-sm">
                  Худалдан авах
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-black mb-2">Тайлбар</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
          </div>

          {/* Similar products */}
          {similarProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-black mb-3">Ижил төстэй бараа</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {similarProducts.map((p) => (
                  <button key={p.id} onClick={() => onSelectProduct(p)} className="shrink-0 w-36 text-left group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} className="w-full aspect-square rounded-xl object-cover bg-gray-50 group-hover:scale-105 transition-transform" />
                    <p className="text-xs font-medium text-black truncate mt-1.5">{p.title}</p>
                    <p className="text-[10px] text-gray-400">{p.merchantName}</p>
                    <p className={`text-sm font-bold ${p.onSale ? "text-red-500" : "text-black"}`}>{fmt(p.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
