"use client";
import { useState } from "react";
import { Product } from "@/lib/merchants/types";
import { FavAlbum } from "@/hooks/useFavorites";
import ProductCard from "./ProductCard";

function fmt(n: number) { return n.toLocaleString("mn-MN") + "₮"; }

interface Props {
  items: Product[];
  albums: FavAlbum[];
  onRemove: (id: string) => void;
  onCreateAlbum: (name: string) => void;
  onDeleteAlbum: (id: string) => void;
  onAddToAlbum: (albumId: string, productId: string) => void;
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
}

export default function FavoritesView({ items, albums, onRemove, onCreateAlbum, onDeleteAlbum, onAddToAlbum, onAddToCart, onProductClick }: Props) {
  const [activeAlbum, setActiveAlbum] = useState("all");
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [newName, setNewName] = useState("");
  const [assignProduct, setAssignProduct] = useState<string | null>(null);

  const displayItems = activeAlbum === "all"
    ? items
    : items.filter((p) => albums.find((a) => a.id === activeAlbum)?.productIds.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
          </div>
          <h2 className="text-lg font-semibold text-black mb-1">Хадгалсан бараа байхгүй</h2>
          <p className="text-sm text-gray-400">Бараан дээрх зүрхэн дээр дарж хадгалаарай</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f7] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full px-6 py-6 space-y-5">
        {/* Albums */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {albums.map((a) => (
            <button key={a.id} onClick={() => setActiveAlbum(a.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeAlbum === a.id ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}>
              {a.name} {a.id === "all" ? `(${items.length})` : `(${a.productIds.length})`}
            </button>
          ))}
          <button onClick={() => setShowNewAlbum(true)}
            className="shrink-0 px-3 py-2 rounded-full border border-dashed border-gray-300 text-xs text-gray-400 hover:border-primary hover:text-primary transition-colors">
            +
          </button>
        </div>

        {/* New album input */}
        {showNewAlbum && (
          <div className="flex gap-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Album нэр"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40" />
            <button onClick={() => { if (newName.trim()) { onCreateAlbum(newName.trim()); setNewName(""); setShowNewAlbum(false); } }}
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium">Үүсгэх</button>
            <button onClick={() => setShowNewAlbum(false)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500">×</button>
          </div>
        )}

        {/* Delete album button */}
        {activeAlbum !== "all" && (
          <button onClick={() => { onDeleteAlbum(activeAlbum); setActiveAlbum("all"); }}
            className="text-xs text-red-400 hover:text-red-600">Album устгах</button>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayItems.map((p) => (
            <div key={p.id} className="relative">
              <div onClick={() => onProductClick(p)}>
                <ProductCard product={p} onAddToCart={onAddToCart} />
              </div>
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                {/* Assign to album */}
                <button onClick={() => setAssignProduct(assignProduct === p.id ? null : p.id)}
                  className="w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary text-[10px]">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
                </button>
                {/* Remove */}
                <button onClick={() => onRemove(p.id)}
                  className="w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 text-[10px]">×</button>
              </div>
              {/* Album assign dropdown */}
              {assignProduct === p.id && albums.length > 1 && (
                <div className="absolute top-10 right-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 min-w-[120px]">
                  {albums.filter((a) => a.id !== "all").map((a) => (
                    <button key={a.id} onClick={() => { onAddToAlbum(a.id, p.id); setAssignProduct(null); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">{a.name}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {displayItems.length === 0 && activeAlbum !== "all" && (
          <p className="text-center py-12 text-gray-400 text-sm">Энэ album-д бараа байхгүй</p>
        )}
      </div>
    </div>
  );
}
