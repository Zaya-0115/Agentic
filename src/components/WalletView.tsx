"use client";
import { useState } from "react";

const MOCK_TXS = [
  { id: "1", type: "out", desc: "Shoppy.mn - Ухаалаг цаг", amount: -89000, date: "2025-03-28" },
  { id: "2", type: "in", desc: "Хэтэвч цэнэглэлт", amount: 500000, date: "2025-03-27" },
  { id: "3", type: "out", desc: "Zary.mn - Куртка", amount: -156000, date: "2025-03-25" },
  { id: "4", type: "out", desc: "TechStore.mn - Чихэвч", amount: -45000, date: "2025-03-24" },
  { id: "5", type: "in", desc: "Буцаалт - ShoppyHub", amount: 32000, date: "2025-03-22" },
  { id: "6", type: "out", desc: "FashionHub.mn - Пүүз", amount: -120000, date: "2025-03-20" },
];

const CARDS = [
  { id: "1", name: "Хаан банк", last4: "4521", color: "from-blue-600 to-blue-800" },
  { id: "2", name: "Голомт банк", last4: "8834", color: "from-emerald-600 to-emerald-800" },
];

function fmt(n: number) { return Math.abs(n).toLocaleString("mn-MN") + "₮"; }

export default function WalletView() {
  const [balance] = useState(342500);
  const [tab, setTab] = useState<"all" | "in" | "out">("all");
  const [showTopup, setShowTopup] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const filtered = tab === "all" ? MOCK_TXS : MOCK_TXS.filter((t) => t.type === tab);

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f7]">
      <div className="max-w-2xl mx-auto w-full px-6 py-6 space-y-6">
        {/* Balance card */}
        <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 text-white">
          <p className="text-sm text-white/70">Нийт үлдэгдэл</p>
          <p className="text-4xl font-bold mt-1">{balance.toLocaleString("mn-MN")}₮</p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowTopup(!showTopup)}
              className="flex-1 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
              Цэнэглэх
            </button>
            <button onClick={() => setShowWithdraw(!showWithdraw)}
              className="flex-1 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
              Гаргах
            </button>
          </div>
        </div>

        {/* Topup modal */}
        {showTopup && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-bold text-black">Хэтэвч цэнэглэх</h3>
            <input type="number" placeholder="Дүн оруулах" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
            <div className="flex gap-2">
              {["10,000", "50,000", "100,000", "500,000"].map((a) => (
                <button key={a} className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors">{a}₮</button>
              ))}
            </div>
            <button className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors text-sm">Цэнэглэх</button>
          </div>
        )}

        {/* Withdraw modal */}
        {showWithdraw && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-bold text-black">Мөнгө гаргах</h3>
            <input type="number" placeholder="Дүн оруулах" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40">
              <option>Данс сонгох</option>
              {CARDS.map((c) => <option key={c.id}>{c.name} •••• {c.last4}</option>)}
            </select>
            <button className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors text-sm">Гаргах</button>
          </div>
        )}

        {/* Linked cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-black">Холбогдсон карт</h3>
            <button onClick={() => setShowAddCard(!showAddCard)} className="text-xs text-primary font-medium hover:underline">+ Карт нэмэх</button>
          </div>
          <div className="space-y-2">
            {CARDS.map((c) => (
              <div key={c.id} className={`bg-gradient-to-r ${c.color} rounded-xl px-4 py-3 flex items-center justify-between`}>
                <div>
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  <p className="text-white/60 text-xs">•••• •••• •••• {c.last4}</p>
                </div>
                <svg className="w-8 h-6 text-white/40" fill="currentColor" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="3" /></svg>
              </div>
            ))}
          </div>
          {showAddCard && (
            <div className="mt-3 bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-bold text-black">Шинэ карт нэмэх</h3>
              <input placeholder="Картын дугаар" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
              <div className="flex gap-3">
                <input placeholder="MM/YY" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <input placeholder="CVV" className="w-24 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
              </div>
              <input placeholder="Картын эзэмшигчийн нэр" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
              <button className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors text-sm">Карт нэмэх</button>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-sm font-bold text-black mb-3">Гүйлгээний түүх</h3>
          <div className="flex gap-1 mb-3">
            {([["all", "Бүгд"], ["in", "Орлого"], ["out", "Зарлага"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setTab(v)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${tab === v ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filtered.map((tx) => (
              <div key={tx.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === "in" ? "bg-emerald-50" : "bg-red-50"}`}>
                    <svg className={`w-4 h-4 ${tx.type === "in" ? "text-emerald-500 rotate-180" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{tx.desc}</p>
                    <p className="text-[10px] text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === "in" ? "text-emerald-600" : "text-red-500"}`}>
                  {tx.type === "in" ? "+" : "-"}{fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
