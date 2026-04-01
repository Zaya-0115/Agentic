"use client";
import { useState } from "react";

interface Card { id: string; type: "visa" | "master" | "unionpay"; name: string; last4: string; expiry: string; }
interface BankAccount { id: string; bank: string; account: string; }

const MOCK_TXS = [
  { id: "1", type: "out" as const, desc: "Shoppy.mn - Ухаалаг цаг", amount: -89000, date: "2025-03-28" },
  { id: "2", type: "in" as const, desc: "Хэтэвч цэнэглэлт", amount: 500000, date: "2025-03-27" },
  { id: "3", type: "out" as const, desc: "Zary.mn - Куртка", amount: -156000, date: "2025-03-25" },
  { id: "4", type: "out" as const, desc: "TechStore.mn - Чихэвч", amount: -45000, date: "2025-03-24" },
  { id: "5", type: "in" as const, desc: "Буцаалт - ShoppyHub", amount: 32000, date: "2025-03-22" },
  { id: "6", type: "out" as const, desc: "FashionHub.mn - Пүүз", amount: -120000, date: "2025-03-20" },
];

const CARD_COLORS: Record<string, string> = { visa: "from-blue-600 to-blue-800", master: "from-orange-500 to-red-600", unionpay: "from-red-700 to-red-900" };
const CARD_LABELS: Record<string, string> = { visa: "VISA", master: "Mastercard", unionpay: "UnionPay" };

function fmt(n: number) { return Math.abs(n).toLocaleString("mn-MN") + "\u20ae"; }

export default function WalletView() {
  const [activeTab, setActiveTab] = useState<"wallet" | "cards">("wallet");
  const [balance] = useState(342500);
  const [txTab, setTxTab] = useState<"all" | "in" | "out">("all");
  const [showTopup, setShowTopup] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showLinkBank, setShowLinkBank] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const [cards, setCards] = useState<Card[]>([
    { id: "1", type: "visa", name: "Хаан банк Visa", last4: "4521", expiry: "12/27" },
    { id: "2", type: "master", name: "Голомт Mastercard", last4: "8834", expiry: "06/26" },
  ]);
  const [banks, setBanks] = useState<BankAccount[]>([
    { id: "1", bank: "Хаан банк", account: "5012****3456" },
  ]);

  const [newCardType, setNewCardType] = useState<"visa" | "master" | "unionpay">("visa");
  const filtered = txTab === "all" ? MOCK_TXS : MOCK_TXS.filter((t) => t.type === txTab);

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f7] overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-6 py-6 space-y-6">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100">
          <button onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "wallet" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-black"}`}>
            Хэтэвч
          </button>
          <button onClick={() => setActiveTab("cards")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "cards" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-black"}`}>
            Карт
          </button>
        </div>

        {activeTab === "wallet" ? (
          <>
            {/* Balance */}
            <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 text-white">
              <p className="text-sm text-white/70">Хэтэвчний үлдэгдэл</p>
              <p className="text-4xl font-bold mt-1">{balance.toLocaleString("mn-MN")}{"\u20ae"}</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setShowTopup(!showTopup); setShowWithdraw(false); }}
                  className="flex-1 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">Цэнэглэх</button>
                <button onClick={() => { setShowWithdraw(!showWithdraw); setShowTopup(false); }}
                  className="flex-1 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">Гаргах</button>
              </div>
            </div>

            {showTopup && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <h3 className="text-sm font-bold text-black">Цэнэглэх</h3>
                <input type="number" placeholder="Дүн" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <div className="flex gap-2">
                  {["10,000", "50,000", "100,000", "500,000"].map((a) => (
                    <button key={a} className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors">{a}{"\u20ae"}</button>
                  ))}
                </div>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40">
                  <option>Холбогдсон данснаас</option>
                  {banks.map((b) => <option key={b.id}>{b.bank} - {b.account}</option>)}
                </select>
                <button className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors text-sm">Цэнэглэх</button>
              </div>
            )}

            {showWithdraw && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <h3 className="text-sm font-bold text-black">Мөнгө гаргах</h3>
                <input type="number" placeholder="Дүн" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40">
                  <option>Данс сонгох</option>
                  {banks.map((b) => <option key={b.id}>{b.bank} - {b.account}</option>)}
                </select>
                <button className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors text-sm">Гаргах</button>
              </div>
            )}

            {/* Linked bank accounts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-black">Холбогдсон данс</h3>
                <button onClick={() => setShowLinkBank(!showLinkBank)} className="text-xs text-primary font-medium hover:underline">+ Данс холбох</button>
              </div>
              {banks.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{b.bank.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium text-black">{b.bank}</p>
                      <p className="text-[10px] text-gray-400">{b.account}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-medium">Холбогдсон</span>
                </div>
              ))}
              {showLinkBank && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 mt-2">
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40">
                    <option>Банк сонгох</option>
                    <option>Хаан банк</option><option>Голомт банк</option><option>ХХБ</option><option>Төрийн банк</option><option>Худалдаа хөгжлийн банк</option>
                  </select>
                  <input placeholder="Дансны дугаар" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                  <button onClick={() => { setBanks([...banks, { id: String(Date.now()), bank: "Шинэ банк", account: "****1234" }]); setShowLinkBank(false); }}
                    className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors text-sm">Данс холбох</button>
                </div>
              )}
            </div>

            {/* Transactions */}
            <div>
              <h3 className="text-sm font-bold text-black mb-3">Гүйлгээний түүх</h3>
              <div className="flex gap-1 mb-3">
                {([["all", "Бүгд"], ["in", "Орлого"], ["out", "Зарлага"]] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setTxTab(v)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${txTab === v ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-500"}`}>{l}</button>
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
                      <div><p className="text-sm font-medium text-black">{tx.desc}</p><p className="text-[10px] text-gray-400">{tx.date}</p></div>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === "in" ? "text-emerald-600" : "text-red-500"}`}>{tx.type === "in" ? "+" : "-"}{fmt(tx.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Cards tab */}
            <div className="space-y-3">
              {cards.map((c) => (
                <div key={c.id} className={`bg-gradient-to-r ${CARD_COLORS[c.type]} rounded-2xl p-5 text-white relative overflow-hidden`}>
                  <div className="absolute top-4 right-4 text-white/30 text-lg font-bold">{CARD_LABELS[c.type]}</div>
                  <p className="text-white/60 text-xs mb-6">{c.name}</p>
                  <p className="text-lg font-mono tracking-widest">{"\u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  "}{c.last4}</p>
                  <div className="flex justify-between mt-4">
                    <div><p className="text-[10px] text-white/50">EXPIRES</p><p className="text-sm font-medium">{c.expiry}</p></div>
                    <button className="text-white/40 hover:text-white/80 text-xs">Устгах</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add card */}
            <button onClick={() => setShowAddCard(!showAddCard)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-medium text-gray-400 hover:border-primary hover:text-primary transition-colors">
              + Шинэ карт нэмэх
            </button>

            {showAddCard && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <h3 className="text-sm font-bold text-black">Карт нэмэх</h3>
                <div className="flex gap-2">
                  {(["visa", "master", "unionpay"] as const).map((t) => (
                    <button key={t} onClick={() => setNewCardType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${newCardType === t ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500"}`}>
                      {CARD_LABELS[t]}
                    </button>
                  ))}
                </div>
                <input placeholder="Картын дугаар" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <div className="flex gap-3">
                  <input placeholder="MM/YY" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                  <input placeholder="CVV" className="w-24 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                </div>
                <input placeholder="Эзэмшигчийн нэр" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <button onClick={() => { setCards([...cards, { id: String(Date.now()), type: newCardType, name: `Шинэ ${CARD_LABELS[newCardType]}`, last4: String(Math.floor(1000 + Math.random() * 9000)), expiry: "01/28" }]); setShowAddCard(false); }}
                  className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors text-sm">Карт нэмэх</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
