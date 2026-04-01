"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Product } from "@/lib/merchants/types";

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
  showPayment?: boolean;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMsg[];
  createdAt: number;
}

const PAYMENT_METHODS = [
  { id: "qpay", name: "QPay", icon: "Q" },
  { id: "socialpay", name: "SocialPay", icon: "S" },
  { id: "card", name: "Карт", icon: "💳" },
  { id: "monpay", name: "MonPay", icon: "M" },
];

function fmt(n: number) { return n.toLocaleString("mn-MN") + "₮"; }
function timeStr(ts: number) {
  return new Date(ts).toLocaleDateString("mn-MN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("chat_sessions") || "[]"); } catch { return []; }
}
function saveSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("chat_sessions", JSON.stringify(sessions));
}

interface Props { onAddToCart: (p: Product) => void; }

export default function ChatView({ onAddToCart }: Props) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = loadSessions();
    setSessions(s);
    if (s.length > 0) {
      setActiveId(s[0].id);
    } else {
      // Auto-create first chat
      const session: ChatSession = {
        id: `chat-${Date.now()}`,
        title: "Шинэ чат",
        messages: [{ id: "welcome", role: "assistant", text: "Сайн байна уу! Ямар бараа хайж байгаагаа бичээрэй.", timestamp: Date.now() }],
        createdAt: Date.now(),
      };
      setSessions([session]);
      saveSessions([session]);
      setActiveId(session.id);
    }
  }, []);

  const activeSession = sessions.find((s) => s.id === activeId);
  const messages = activeSession?.messages || [];

  const updateSession = useCallback((id: string, msgs: ChatMsg[]) => {
    setSessions((prev) => {
      const next = prev.map((s) => s.id === id ? { ...s, messages: msgs, title: msgs.find((m) => m.role === "user")?.text.slice(0, 30) || s.title } : s);
      saveSessions(next);
      return next;
    });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const newChat = () => {
    const session: ChatSession = {
      id: `chat-${Date.now()}`,
      title: "Шинэ чат",
      messages: [{ id: "welcome", role: "assistant", text: "Сайн байна уу! Ямар бараа хайж байгаагаа бичээрэй.", timestamp: Date.now() }],
      createdAt: Date.now(),
    };
    setSessions((prev) => { const next = [session, ...prev]; saveSessions(next); return next; });
    setActiveId(session.id);
    setShowHistory(false);
    setPaymentDone(false);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => { const next = prev.filter((s) => s.id !== id); saveSessions(next); return next; });
    if (activeId === id) setActiveId(sessions.find((s) => s.id !== id)?.id || null);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !activeId) return;
    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", text, timestamp: Date.now() };
    const newMsgs = [...messages, userMsg];
    updateSession(activeId, newMsgs);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.map((m) => ({ role: m.role, content: m.text })) }),
      });
      const data = await res.json();
      const aMsg: ChatMsg = { id: `a-${Date.now()}`, role: "assistant", text: data.content || "Бараа олдлоо!", products: data.products?.length > 0 ? data.products : undefined, timestamp: Date.now() };
      updateSession(activeId, [...newMsgs, aMsg]);
    } catch {
      updateSession(activeId, [...newMsgs, { id: `e-${Date.now()}`, role: "assistant", text: "Алдаа гарлаа.", timestamp: Date.now() }]);
    } finally { setIsLoading(false); }
  };

  const handleAddToCart = (p: Product) => {
    onAddToCart(p);
    if (!activeId) return;
    const msg: ChatMsg = { id: `sys-${Date.now()}`, role: "assistant", text: `"${p.title}" сагсанд нэмэгдлээ. Төлбөр төлөх бол "Төлбөр төлөх" гэж бичээрэй.`, timestamp: Date.now() };
    updateSession(activeId, [...messages, msg]);
  };

  const handlePayment = () => {
    if (!activeId) return;
    const msg: ChatMsg = { id: `pay-${Date.now()}`, role: "assistant", text: "Төлбөрийн хэлбэрээ сонгоно уу:", showPayment: true, timestamp: Date.now() };
    updateSession(activeId, [...messages, msg]);
  };

  const confirmPayment = (method: string) => {
    if (!activeId) return;
    setPaymentDone(true);
    const name = PAYMENT_METHODS.find((m) => m.id === method)?.name || method;
    const msg: ChatMsg = { id: `done-${Date.now()}`, role: "assistant", text: `${name}-ээр төлбөр амжилттай! Захиалга бэлтгэгдэж байна.`, timestamp: Date.now() };
    updateSession(activeId, [...messages, msg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim().toLowerCase();
    if (t.includes("төлбөр") || t.includes("төлөх")) { handlePayment(); setInput(""); }
    else sendMessage(input);
  };

  // No active session - show new chat prompt
  if (!activeId && sessions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f5f5f7]">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
        </div>
        <p className="text-gray-500 text-sm mb-4">AI худалдааны туслахтай ярилцаарай</p>
        <button onClick={newChat} className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors">Шинэ чат эхлүүлэх</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-[#f5f5f7]">
      {/* History sidebar */}
      <div className={`${showHistory ? "w-64" : "w-0"} shrink-0 bg-white border-r border-gray-100 overflow-hidden transition-all duration-200`}>
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-black">Түүх</span>
          <button onClick={newChat} className="text-xs text-primary font-medium hover:underline">+ Шинэ</button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          {sessions.map((s) => (
            <div key={s.id} onClick={() => { setActiveId(s.id); setPaymentDone(false); }}
              className={`px-3 py-2.5 cursor-pointer border-b border-gray-50 flex items-center justify-between group ${activeId === s.id ? "bg-primary/5" : "hover:bg-gray-50"}`}>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-black truncate">{s.title}</p>
                <p className="text-[10px] text-gray-400">{timeStr(s.createdAt)}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="shrink-0 px-4 py-2.5 flex items-center gap-2 border-b border-gray-100 bg-white">
          <button onClick={() => setShowHistory(!showHistory)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <span className="text-sm font-medium text-black truncate flex-1">{activeSession?.title || "Чат"}</span>
          <button onClick={newChat} className="text-xs text-primary font-medium hover:underline">+ Шинэ чат</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={`flex items-end ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "user" && (
                    <div className="order-2 w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shrink-0 ml-2">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </div>
                  )}
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shrink-0 mr-2">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-white rounded-br-md" : "bg-white border border-gray-100 text-black/80 rounded-bl-md shadow-sm"}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-300 mt-1 px-1">{timeStr(msg.timestamp)}</span>
                  </div>
                </div>
                {msg.products && (
                  <div className="mt-3 grid grid-cols-2 gap-2 max-w-[80%]">
                    {msg.products.slice(0, 6).map((p) => (
                      <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.title} className="w-full aspect-square object-cover" />
                        <div className="p-2.5">
                          <p className="text-xs font-medium text-black truncate">{p.title}</p>
                          <p className="text-[10px] text-gray-400">{p.merchantName}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-sm font-bold text-black">{fmt(p.price)}</span>
                            <button onClick={() => handleAddToCart(p)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {msg.showPayment && !paymentDone && (
                  <div className="mt-3 max-w-[80%] grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button key={m.id} onClick={() => confirmPayment(m.id)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-primary/40 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">{m.icon}</div>
                        <span className="text-sm font-medium text-black">{m.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shrink-0 mr-2">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.15s]" /><span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.3s]" /></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Бараа хайх, сагслах, төлбөр төлөх..."
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 pr-12 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 shadow-sm"
                disabled={isLoading} />
              <button type="submit" disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-30 text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
