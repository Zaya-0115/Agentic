"use client";
import { useState } from "react";

interface Card { id: string; type: "visa" | "master" | "unionpay"; name: string; last4: string; expiry: string; }
interface BankAccount { id: string; bank: string; account: string; }

const MOCK_TXS = [
  { id: "1", type: "out" as const, desc: "Shoppy.mn", item: "Ухаалаг цаг", amount: -89000, date: "03/28" },
  { id: "2", type: "in" as const, desc: "Цэнэглэлт", item: "Хэтэвч", amount: 500000, date: "03/27" },
  { id: "3", type: "out" as const, desc: "Zary.mn", item: "Куртка", amount: -156000, date: "03/25" },
  { id: "4", type: "out" as const, desc: "TechStore.mn", item: "Чихэвч", amount: -45000, date: "03/24" },
  { id: "5", type: "in" as const, desc: "Буцаалт", item: "ShoppyHub", amount: 32000, date: "03/22" },
  { id: "6", type: "out" as const, desc: "FashionHub.mn", item: "Пүүз", amount: -120000, date: "03/20" },
];

const CARD_BG: Record<string, string> = { visa: "from-[#1a1f71] to-[#2d35a8]", master: "from-[#eb001b] to-[#f79e1b]", unionpay: "from-[#002e6e] to-[#d40037]" };
const CARD_LABEL: Record<string, string> = { visa: "VISA", master: "Mastercard", unionpay: "UnionPay" };
function fmt(n: number) { return Math.abs(n).toLocaleString("mn-MN") + "\u20ae"; }

export default function WalletView() {
  const [balance] = useState(342500);
  const [hideBalance, setHideBalance] = useState(false);
  const [hideCards, setHideCards] = useState(false);
  const [txTab, setTxTab] = useState<"all" | "in" | "out">("all");
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [newCardType, setNewCardType] = useState<"visa" | "master" | "unionpay">("visa");
  const [cards, setCards] = useState<Card[]>([
    { id: "1", type: "visa", name: "Хаан банк", last4: "4521", expiry: "12/27" },
    { id: "2", type: "master", name: "Голомт банк", last4: "8834", expiry: "06/26" },
  ]);
  const [banks, setBanks] = useState<BankAccount[]>([{ id: "1", bank: "Хаан банк", account: "5012****3456" }]);
  const filtered = txTab === "all" ? MOCK_TXS : MOCK_TXS.filter((t) => t.type === txTab);
  const toggle = (p: string) => setActivePanel(activePanel === p ? null : p);

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f7] overflow-y-auto">
      <div className="max-w-lg mx-auto w-full px-6 py-8 space-y-6">

        {/* Balance card */}
        <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-[28px] p-7 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl translate-y-10 -translate-x-10" />
          <div className="relative z-10">
            <p className="text-white/50 text-xs font-medium tracking-wider uppercase">Нийт үлдэгдэл</p>
            <p className="text-[42px] font-bold mt-2 tracking-tight">{balance.toLocaleString("mn-MN")}<span className="text-lg ml-1 text-white/60">{"\u20ae"}</span></p>
            <div className="flex gap-3 mt-6">
              {[
                { key: "topup", label: "Цэнэглэх", icon: "M12 4.5v15m7.5-7.5h-15" },
                { key: "withdraw", label: "Гаргах", icon: "M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" },
                { key: "bank", label: "Данс", icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" },
              ].map((a) => (
                <button key={a.key} onClick={() => toggle(a.key)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${activePanel === a.key ? "bg-white/20" : "bg-white/10 hover:bg-white/15"}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={a.icon} /></svg>
                  <span className="text-[10px] font-medium text-white/70">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panels */}
        {activePanel === "topup" && (
          <Panel title="Цэнэглэх">
            <input type="number" placeholder="Дүн оруулах" className="inp" />
            <div className="flex gap-2">{["10,000", "50,000", "100,000"].map((a) => <button key={a} className="chip">{a}{"\u20ae"}</button>)}</div>
            <button className="btn-primary">Цэнэглэх</button>
          </Panel>
        )}
        {activePanel === "withdraw" && (
          <Panel title="Мөнгө гаргах">
            <input type="number" placeholder="Дүн оруулах" className="inp" />
            <select className="inp"><option>Данс сонгох</option>{banks.map((b) => <option key={b.id}>{b.bank} - {b.account}</option>)}</select>
            <button className="btn-dark">Гаргах</button>
          </Panel>
        )}
        {activePanel === "bank" && (
          <Panel title="Данс холбох">
            {banks.map((b) => (
              <div key={b.id} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-bold">{b.bank.charAt(0)}</div>
                <div className="flex-1"><p className="text-sm font-medium text-black">{b.bank}</p><p className="text-[10px] text-gray-400">{b.account}</p></div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2 space-y-3">
              <select className="inp"><option>Банк сонгох</option><option>Хаан банк</option><option>Голомт банк</option><option>ХХБ</option><option>Төрийн банк</option></select>
              <input placeholder="Дансны дугаар" className="inp" />
              <button onClick={() => { setBanks([...banks, { id: String(Date.now()), bank: "Шинэ банк", account: "****" + Math.floor(1000 + Math.random() * 9000) }]); }}
                className="btn-primary">Холбох</button>
            </div>
          </Panel>
        )}

        {/* Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black">Миний карт</h3>
              <button onClick={() => setHideCards(!hideCards)} className="text-gray-400 hover:text-gray-600 transition-colors">
                {hideCards
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              </button>
            </div>
            <button onClick={() => toggle("addcard")} className="text-xs text-primary font-medium">+ Нэмэх</button>
          </div>
          <div className="space-y-3">
            {cards.map((c, i) => (
              <div key={c.id} className={`bg-gradient-to-br ${CARD_BG[c.type]} rounded-2xl p-5 text-white relative overflow-hidden`}
                style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}>
                <div className="absolute top-3 right-4 text-white/20 text-sm font-bold tracking-wider">{CARD_LABEL[c.type]}</div>
                <p className="text-white/50 text-[10px] font-medium">{c.name}</p>
                <p className="text-base font-mono tracking-[0.25em] mt-4">{"\u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  \u2022\u2022\u2022\u2022  "}{c.last4}</p>
                <div className="flex justify-between items-end mt-4">
                  <div><p className="text-[9px] text-white/40 uppercase">Expires</p><p className="text-xs font-medium">{c.expiry}</p></div>
                  <button onClick={() => setCards(cards.filter((x) => x.id !== c.id))} className="text-[10px] text-white/30 hover:text-white/60">Устгах</button>
                </div>
              </div>
            ))}
          </div>
          {activePanel === "addcard" && (
            <Panel title="Карт нэмэх">
              <div className="flex gap-2">
                {(["visa", "master", "unionpay"] as const).map((t) => (
                  <button key={t} onClick={() => setNewCardType(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${newCardType === t ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500"}`}>{CARD_LABEL[t]}</button>
                ))}
              </div>
              <input placeholder="Картын дугаар" className="inp" />
              <div className="flex gap-3"><input placeholder="MM/YY" className="inp flex-1" /><input placeholder="CVV" className="inp w-24" /></div>
              <input placeholder="Эзэмшигчийн нэр" className="inp" />
              <button onClick={() => { setCards([...cards, { id: String(Date.now()), type: newCardType, name: CARD_LABEL[newCardType], last4: String(Math.floor(1000 + Math.random() * 9000)), expiry: "01/28" }]); setActivePanel(null); }}
                className="btn-primary">Нэмэх</button>
            </Panel>
          )}
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-sm font-bold text-black mb-3">Гүйлгээ</h3>
          <div className="flex gap-1 mb-4">
            {([["all", "Бүгд"], ["in", "Орлого"], ["out", "Зарлага"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setTxTab(v)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${txTab === v ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}>{l}</button>
            ))}
          </div>
          <div className="space-y-1">
            {filtered.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.type === "in" ? "bg-emerald-50" : "bg-gray-100"}`}>
                  <svg className={`w-4 h-4 ${tx.type === "in" ? "text-emerald-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={tx.type === "in" ? "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" : "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black">{tx.desc}</p>
                  <p className="text-[10px] text-gray-400">{tx.item} · {tx.date}</p>
                </div>
                <span className={`text-sm font-bold tabular-nums ${tx.type === "in" ? "text-emerald-600" : "text-black"}`}>
                  {tx.type === "in" ? "+" : "-"}{fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .inp { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px 16px; font-size: 14px; outline: none; }
        .inp:focus { border-color: rgba(108,60,225,0.4); }
        .btn-primary { width: 100%; padding: 12px; background: #6C3CE1; color: white; font-weight: 500; border-radius: 12px; font-size: 14px; }
        .btn-primary:hover { background: #8B5CF6; }
        .btn-dark { width: 100%; padding: 12px; background: #1a1a2e; color: white; font-weight: 500; border-radius: 12px; font-size: 14px; }
        .btn-dark:hover { background: #2d2d44; }
        .chip { flex: 1; padding: 8px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 500; color: #6b7280; }
        .chip:hover { border-color: #6C3CE1; color: #6C3CE1; }
      `}</style>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm">
      <h3 className="text-sm font-bold text-black">{title}</h3>
      {children}
    </div>
  );
}
