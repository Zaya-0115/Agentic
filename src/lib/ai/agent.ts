import OpenAI from "openai";
import { searchAllMerchants, flattenAndSort } from "../merchants";
import { Product, ChatMessage } from "../merchants/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a helpful shopping assistant for an e-commerce aggregator platform.
You help users find products across these sources ONLY:
- Cody (local marketplace with 170+ merchants)
- Shoppy.mn (Mongolian marketplace)
- Zary.mn (Mongolian fashion & lifestyle)
- ShoppyHub.mn (cross-border marketplace)

RULES:
- NEVER mention, suggest, or reference any other platforms (Amazon, eBay, AliExpress, Trendyol, Walmart, etc.)
- If a user asks about other platforms, politely explain you only search the 4 sources above.
- Keep responses concise and helpful.
- When products are found, summarize the best deals, price ranges, and notable options.
- You can help with product recommendations, comparisons, and shopping advice within these platforms.`;

export async function processAgentMessage(
  userMessage: string,
  history: ChatMessage[]
): Promise<{ content: string; products: Product[] }> {
  const query = extractSearchQuery(userMessage);

  // If it looks like a product search, fetch products
  let products: Product[] = [];
  if (query) {
    const results = await searchAllMerchants(query);
    products = flattenAndSort(results, "price");
  }

  // Build conversation for OpenAI
  const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Add recent history (last 10 messages)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    chatMessages.push({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    });
  }

  // Add current message with product context
  let userContent = userMessage;
  if (products.length > 0) {
    const summary = products.slice(0, 8).map((p) =>
      `- ${p.title}: $${p.price} on ${p.source} (${p.rating}★, ${p.reviewCount} reviews${p.onSale ? ", ON SALE" : ""}${p.shipping?.freeShipping ? ", free shipping" : ""})`
    ).join("\n");
    userContent += `\n\n[Search results for "${query}" — ${products.length} products found across our platforms]\n${summary}`;
  }

  chatMessages.push({ role: "user", content: userContent });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content ??
      "I found some products for you. Check them out below!";

    return { content, products };
  } catch (error) {
    console.error("OpenAI error:", error);
    // Fallback if OpenAI fails
    return {
      content: products.length > 0
        ? `Found ${products.length} results for "${query}" across our platforms. The best price starts at $${products[0]?.price}.`
        : "Tell me what you're looking for and I'll search across Cody, Shoppy.mn, Zary.mn, and ShoppyHub.mn!",
      products,
    };
  }
}

function extractSearchQuery(message: string): string | null {
  const cleaned = message
    .replace(/^(find|search|look for|show me|compare|i want|i need|get me)\s+/i, "")
    .replace(/\s+(please|thanks|thank you|pls)$/i, "")
    .trim();
  return cleaned.length > 1 ? cleaned : null;
}
