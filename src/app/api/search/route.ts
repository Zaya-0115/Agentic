import { NextRequest, NextResponse } from "next/server";
import { searchAllMerchants, flattenAndSort } from "@/lib/merchants";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const sort = req.nextUrl.searchParams.get("sort") as "price" | "rating" | null;

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const results = await searchAllMerchants(query);
  const products = flattenAndSort(results, sort ?? "price");

  return NextResponse.json({ query, results, products });
}
