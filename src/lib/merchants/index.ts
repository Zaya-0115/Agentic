import { MerchantAdapter, Product, SearchResult } from "./types";
import { codyAdapter } from "./cody";
import { zaryAdapter } from "./zary";
import { shoppyAdapter } from "./shoppy";
import { shoppyhubAdapter } from "./shoppyhub";

export const merchants: MerchantAdapter[] = [
  codyAdapter,
  zaryAdapter,
  shoppyAdapter,
  shoppyhubAdapter,
];

/**
 * Search all merchants in parallel and return aggregated results.
 */
export async function searchAllMerchants(query: string): Promise<SearchResult[]> {
  const results = await Promise.allSettled(
    merchants.map(async (merchant) => {
      const products = await merchant.search(query);
      return { source: merchant.source, products } as SearchResult;
    })
  );

  return results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { source: merchants[i].source, products: [], error: String(r.reason) }
  );
}

/**
 * Flatten all search results into a single sorted product list.
 */
export function flattenAndSort(
  results: SearchResult[],
  sortBy: "price" | "rating" = "price"
): Product[] {
  const all = results.flatMap((r) => r.products);
  return all.sort((a, b) =>
    sortBy === "price" ? a.price - b.price : (b.rating ?? 0) - (a.rating ?? 0)
  );
}

export type { Product, SearchResult, MerchantSource, MerchantAdapter, Filters, Category, SortOption } from "./types";
