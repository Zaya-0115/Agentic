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
  const [balance] = useState(342500);
  const [txTab, setTxTab] = useState<"all" | "in" | "out">("all");
  const [showTopup, setShowTopup] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showLinkBank, setShowLinkBank] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardType, setNewCardType] = useState<"visa" | "master" | "unionpay">("visa");

  const [cards, setCards] = useState<Card[]>([
    { id: "1", type: "visa", name: "Хаан банк Visa", last4: "4521", expiry: "12/27" },
    { id: "2", type: "master", name: "Голомт Mastercard", last4: "8834", expiry: "06/26" },
  ]);
  const [banks, setBanks] = useState<BankAccount[]>([
    { id: "1", bank: "Хаан банк", account: "5012****3456" },
  ]);

  const filtered = txTab === "all" ? MOCK_TXS : MOCK_TXS.filter((t) => t.type === txTab);

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f7] overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-6 py-6 space-y-5">
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

        {/* Cards - collapsible */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button onClick={() => setCardsOpen(!cardsOpen)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="3" /></svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-black">Холбогдсон карт</p>
                <p className="text-[10px] text-gray-400">{cards.length} карт</p>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${cardsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>
          {cardsOpen && (
            <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-3">
              {cards.map((c) => (
                <div key={c.id} className={`bg-gradient-to-r ${CARD_COLORS[c.type]} rounded-xl p-4 text-white flex items-center justify-between`}>
                  <div>
                    <p className="text-[10px] text-white/50">{CARD_LABELS[c.type]}</p>
                    <p className="text-sm font-mono tracking-wider mt-1">{"\u2022\u2022\u2022\u2022 "}{c.last4}</p>
                    <p className="text-[10px] text-white/60 mt-1">{c.name} · {c.expiry}</p>
                  </div>
                  <button onClick={() => setCards(cards.filter((x) => x.id !== c.id))} className="text-white/30 hover:text-white/70 text-xs">Устгах</button>
                </div>
              ))}
              {!showAddCard ? (
                <button onClick={() => setShowAddCard(true)}
                  className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-medium text-gray-400 hover:border-primary hover:text-primary transition-colors">
                  + Карт нэмэх
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    {(["visa", "master", "unionpay"] as const).map((t) => (
                      <button key={t} onClick={() => setNewCardType(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${newCardType === t ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500"}`}>
                        {CARD_LABELS[t]}
                      </button>
                    ))}
                  </div>
                  <input placeholder="Картын дугаар" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40" />
                  <div className="flex gap-3">
                    <input placeholder="MM/YY" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40" />
                    <input placeholder="CVV" className="w-24 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40" />
                  </div>
                  <input placeholder="Эзэмшигчийн нэр" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40" />
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddCard(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500">Болих</button>
                    <button onClick={() => { setCards([...cards, { id: String(Date.now()), type: newCardType, name: `${CARD_LABELS[newCardType]}`, last4: String(Math.floor(1000 + Math.random() * 9000)), expiry: "01/28" }]); setShowAddCard(false); }}
                      className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-light transition-colors">Нэмэх</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bank accounts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-black">Холбогдсон данс</h3>
            <button onClick={() => setShowLinkBank(!showLinkBank)} className="text-xs text-primary font-medium hover:underline">+ Данс холбох</button>
          </div>
          {banks.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{b.bank.charAt(0)}</div>
                <div><p className="text-sm font-medium text-black">{b.bank}</p><p className="text-[10px] text-gray-400">{b.account}</p></div>
              </div>
              <span className="text-[10px] text-emerald-500 font-medium">Холбогдсон</span>
            </div>
          ))}
          {showLinkBank && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 mt-2">
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40">
                <option>Банк сонгох</option><option>Хаан банк</option><option>Голомт банк</option><option>ХХБ</option><option>Төрийн банк</option>
              </select>
              <input placeholder="Дансны дугаар" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
              <button onClick={() => { setBanks([...banks, { id: String(Date.now()), bank: "Шинэ банк", account: "****1234" }]); setShowLinkBank(false); }}
                className="w-full py-3 bg-primary text-white font-medium rounded-xl text-sm">Данс холбох</button>
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
      </div>
    </div>
  );
}
