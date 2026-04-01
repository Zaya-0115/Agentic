"use client";
import { useState, useCallback } from "react";
import { Product } from "@/lib/merchants/types";

export interface FavAlbum {
  id: string;
  name: string;
  productIds: string[];
}

export function useFavorites() {
  const [items, setItems] = useState<Product[]>([]);
  const [albums, setAlbums] = useState<FavAlbum[]>([
    { id: "all", name: "Бүгд", productIds: [] },
  ]);

  const addFavorite = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
    setAlbums((prev) => prev.map((a) => ({ ...a, productIds: a.productIds.filter((id) => id !== productId) })));
  }, []);

  const isFavorite = useCallback((productId: string) => items.some((p) => p.id === productId), [items]);

  const toggleFavorite = useCallback((product: Product) => {
    if (isFavorite(product.id)) removeFavorite(product.id);
    else addFavorite(product);
  }, [isFavorite, removeFavorite, addFavorite]);

  const createAlbum = useCallback((name: string) => {
    setAlbums((prev) => [...prev, { id: `album-${Date.now()}`, name, productIds: [] }]);
  }, []);

  const deleteAlbum = useCallback((albumId: string) => {
    if (albumId === "all") return;
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
  }, []);

  const addToAlbum = useCallback((albumId: string, productId: string) => {
    setAlbums((prev) => prev.map((a) => a.id === albumId && !a.productIds.includes(productId)
      ? { ...a, productIds: [...a.productIds, productId] } : a));
  }, []);

  const removeFromAlbum = useCallback((albumId: string, productId: string) => {
    setAlbums((prev) => prev.map((a) => a.id === albumId ? { ...a, productIds: a.productIds.filter((id) => id !== productId) } : a));
  }, []);

  return { items, albums, addFavorite, removeFavorite, isFavorite, toggleFavorite, createAlbum, deleteAlbum, addToAlbum, removeFromAlbum };
}
