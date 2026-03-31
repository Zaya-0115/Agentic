import { searchAllMerchants, flattenAndSort } from "../merchants";
import { Product, ChatMessage } from "../merchants/types";

export async function processAgentMessage(
  userMessage: string,
  history: ChatMessage[]
): Promise<{ content: string; products: Product[] }> {
  const query = extractSearchQuery(userMessage);

  let products: Product[] = [];
  if (query) {
    const results = await searchAllMerchants(query);
    products = flattenAndSort(results, "price");
  }

  // Try OpenAI if key is available
  if (process.env.OPENAI_API_KEY && query) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const summary = products.slice(0, 8).map((p) =>
        `- ${p.title}: ${p.price}₮ on ${p.source} (${p.rating}★${p.onSale ? ", SALE" : ""})`
      ).join("\n");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a shopping assistant for Selecto. Only search Cody, Shoppy.mn, Zary.mn, ShoppyHub.mn. Keep responses concise. Respond in Mongolian when possible." },
          ...history.slice(-6).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user", content: `${userMessage}\n\n[${products.length} results for "${query}"]\n${summary}` },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return { content: completion.choices[0]?.message?.content ?? buildFallbackSummary(query, products), products };
    } catch {
      // Fallback if OpenAI fails
    }
  }

  return {
    content: query ? buildFallbackSummary(query, products) : "Та юу хайж байгаагаа бичнэ үү!",
    products,
  };
}

function buildFallbackSummary(query: string, products: Product[]): string {
  if (products.length === 0) return `"${query}" хайлтаар бараа олдсонгүй.`;
  const cheapest = products[0];
  const sources = new Set(products.map((p) => p.source)).size;
  let s = `"${query}" — **${products.length}** бараа, **${sources}** платформоос олдлоо.`;
  if (cheapest) s += ` Хамгийн бага үнэ: **${cheapest.price.toLocaleString()}₮** (${cheapest.merchantName}).`;
  return s;
}

function extractSearchQuery(message: string): string | null {
  const cleaned = message
    .replace(/^(find|search|look for|show me|compare|i want|i need|get me|хайх|олох|харуулах)\s+/i, "")
    .replace(/\s+(please|thanks|pls|баярлалаа)$/i, "")
    .trim();
  return cleaned.length > 1 ? cleaned : null;
}
