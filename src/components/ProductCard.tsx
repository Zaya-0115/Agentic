"use client";
import { Product } from "@/lib/merchants/types";

const sourceColors: Record<string, string> = {
  cody: "bg-purple-500",
  zary: "bg-pink-500",
  shoppy: "bg-emerald-500",
  shoppyhub: "bg-blue-500",
};

function formatPrice(price: number): string {
  return price.toLocaleString("mn-MN") + "\u20AE";
}

export default function ProductCard({ product, onAddToCart, onFavorite }: {
  product: Product;
  onAddToCart?: (p: Product) => void;
  onFavorite?: (p: Product) => void;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 transition-all overflow-hidden group relative cursor-pointer">
      <div className="relative aspect-square bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white tracking-wide ${sourceColors[product.source] ?? "bg-gray-500"}`}>
          {product.merchantName}
        </span>
        {product.onSale && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">SALE</span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">Дууссан</span>
          </div>
        )}
        {product.inStock && (
          <div className="absolute bottom-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onFavorite && (
              <button onClick={(e) => { e.stopPropagation(); onFavorite(product); }}
                className="w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                title="Хадгалах">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            )}
            {onAddToCart && (
              <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                title="Сагслах">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-3.5 space-y-1.5">
        <h3 className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug">{product.title}</h3>
        {product.brand && (
          <span className="text-[10px] text-gray-400 font-medium">{product.brand}</span>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          {product.rating && <span className="text-yellow-500">{"★".repeat(Math.round(product.rating))}</span>}
          {product.rating && <span>{product.rating}</span>}
          {product.reviewCount && <span>({product.reviewCount})</span>}
        </div>
      </div>
    </div>
  );
}
