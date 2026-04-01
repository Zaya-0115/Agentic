"use client";
import { useState } from "react";
import { useLanguage, Lang } from "@/hooks/useLanguage";

const MOCK_ORDERS = [
  { id: "ORD-2401", status: "delivered", store: "Shoppy.mn", items: "Ухаалаг цаг x1", total: 89000, date: "2025-03-28" },
  { id: "ORD-2398", status: "shipping", store: "TechStore.mn", items: "Чихэвч x1, Кабель x2", total: 67000, date: "2025-03-26" },
  { id: "ORD-2395", status: "processing", store: "Zary.mn", items: "Куртка x1", total: 156000, date: "2025-03-25" },
  { id: "ORD-2390", status: "delivered", store: "FashionHub.mn", items: "Пүүз x1", total: 120000, date: "2025-03-20" },
  { id: "ORD-2385", status: "cancelled", store: "ShoppyHub.mn", items: "Цүнх x1", total: 45000, date: "2025-03-18" },
];

const STATUS: Record<string, { label: string; color: string }> = {
  processing: { label: "Бэлтгэж байна", color: "text-amber-600 bg-amber-50" },
  shipping: { label: "Хүргэлтэнд", color: "text-blue-600 bg-blue-50" },
  delivered: { label: "Хүргэгдсэн", color: "text-emerald-600 bg-emerald-50" },
  cancelled: { label: "Цуцлагдсан", color: "text-red-500 bg-red-50" },
};

function fmt(n: number) { return n.toLocaleString("mn-MN") + "\u20ae"; }

export default function ProfileView() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState("all");
  const [user, setUser] = useState({
    name: "Ариунзаяа",
    email: "ariunzaya@example.com",
    phone: "9911-2233",
    address: "Улаанбаатар, БЗД, 3-р хороо",
  });
  const [editing, setEditing] = useState(false);
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwStep, setPwStep] = useState<"form" | "otp" | "done">("form");
  const [otpCode, setOtpCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [addresses, setAddresses] = useState([
    { id: "1", label: "Гэр", address: "Улаанбаатар, БЗД, 3-р хороо" },
    { id: "2", label: "Оффис", address: "Улаанбаатар, СБД, Сөүлийн гудамж 21" },
  ]);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddr, setNewAddr] = useState("");
  const { lang, t, switchLang } = useLanguage();
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const filteredOrders = orderFilter === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === orderFilter);

  const MENU = [
    { key: "orders", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25", label: "Захиалгууд" },
    { key: "info", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", label: "Хувийн мэдээлэл" },
    { key: "address", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", label: "Хүргэлтийн хаяг" },
    { key: "feedback", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z", label: t("profile.feedback") },
    { key: "settings", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "Тохиргоо" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f5f5f7] overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Захиалга", value: MOCK_ORDERS.length },
            { label: "Хүргэгдсэн", value: MOCK_ORDERS.filter((o) => o.status === "delivered").length },
            { label: "Идэвхтэй", value: MOCK_ORDERS.filter((o) => o.status === "shipping" || o.status === "processing").length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-black">{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {MENU.map((m) => (
            <button key={m.key} onClick={() => setActiveSection(activeSection === m.key ? null : m.key)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeSection === m.key ? "bg-primary/5 border border-primary/20" : "bg-white border border-gray-100 hover:border-gray-200"}`}>
              <svg className={`w-5 h-5 ${activeSection === m.key ? "text-primary" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={m.icon} /></svg>
              <span className={`text-sm font-medium ${activeSection === m.key ? "text-primary" : "text-black"}`}>{m.label}</span>
              <svg className={`w-4 h-4 ml-auto text-gray-300 transition-transform ${activeSection === m.key ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
          ))}
        </div>

        {/* Orders section */}
        {activeSection === "orders" && (
          <div className="space-y-3">
            <div className="flex gap-1">
              {[["all", "Бүгд"], ["processing", "Бэлтгэж байна"], ["shipping", "Хүргэлтэнд"], ["delivered", "Хүргэгдсэн"], ["cancelled", "Цуцлагдсан"]].map(([v, l]) => (
                <button key={v} onClick={() => setOrderFilter(v)}
                  className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${orderFilter === v ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}>{l}</button>
              ))}
            </div>
            {filteredOrders.map((o) => {
              const s = STATUS[o.status];
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-400">{o.id}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                  </div>
                  <p className="text-sm font-medium text-black">{o.store}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{o.items}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400">{o.date}</span>
                    <span className="text-sm font-bold text-black">{fmt(o.total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Personal info */}
        {activeSection === "info" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            {editing ? (
              <>
                <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Нэр" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Имэйл" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="Утас" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500">Болих</button>
                  <button onClick={() => setEditing(false)} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium">Хадгалах</button>
                </div>
              </>
            ) : (
              <>
                {[["Нэр", user.name], ["Имэйл", user.email], ["Утас", user.phone]].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">{l}</span>
                    <span className="text-sm font-medium text-black">{v}</span>
                  </div>
                ))}
                <button onClick={() => setEditing(true)} className="w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">Засах</button>
              </>
            )}

            {/* Password */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Нууц үг</p>
                  <p className="text-sm font-medium text-black">••••••••</p>
                </div>
                <button onClick={() => { setShowPwChange(!showPwChange); setPwStep("form"); setOtpCode(""); setNewPw(""); setConfirmPw(""); }}
                  className="text-xs text-primary font-medium">Солих</button>
              </div>

              {showPwChange && (
                <div className="mt-3 space-y-3">
                  {pwStep === "form" && (
                    <>
                      <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                        placeholder="Шинэ нууц үг" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                      <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                        placeholder="Нууц үг давтах" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                      {newPw && confirmPw && newPw !== confirmPw && (
                        <p className="text-xs text-red-500">Нууц үг таарахгүй байна</p>
                      )}
                      <button onClick={() => { if (newPw && newPw === confirmPw && newPw.length >= 6) setPwStep("otp"); }}
                        disabled={!newPw || newPw !== confirmPw || newPw.length < 6}
                        className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-40">OTP код илгээх</button>
                      <p className="text-[10px] text-gray-400 text-center">Хамгийн багадаа 6 тэмдэгт</p>
                    </>
                  )}
                  {pwStep === "otp" && (
                    <>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-blue-600">{user.phone} дугаар руу OTP код илгээлээ</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        {[0, 1, 2, 3].map((i) => (
                          <input key={i} maxLength={1} className="w-12 h-12 border border-gray-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:border-primary"
                            value={otpCode[i] || ""} onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              const next = otpCode.split("");
                              next[i] = val;
                              setOtpCode(next.join("").slice(0, 4));
                              if (val && e.target.nextElementSibling) (e.target.nextElementSibling as HTMLInputElement).focus();
                            }} />
                        ))}
                      </div>
                      <button onClick={() => { if (otpCode.length === 4) setPwStep("done"); }}
                        disabled={otpCode.length !== 4}
                        className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-40">Баталгаажуулах</button>
                    </>
                  )}
                  {pwStep === "done" && (
                    <div className="text-center py-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <p className="text-sm font-medium text-black">Нууц үг амжилттай солигдлоо</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Address */}
        {activeSection === "address" && (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">{a.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.address}</p>
                </div>
                <button onClick={() => setAddresses(addresses.filter((x) => x.id !== a.id))} className="text-gray-300 hover:text-red-500 mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {!showAddAddr ? (
              <button onClick={() => setShowAddAddr(true)}
                className="w-full py-3 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-400 hover:border-primary hover:text-primary transition-colors">
                + Хаяг нэмэх
              </button>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Гарчиг (жнь: Гэр, Оффис)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <input value={newAddr} onChange={(e) => setNewAddr(e.target.value)} placeholder="Хаяг"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40" />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddAddr(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500">Болих</button>
                  <button onClick={() => { if (newLabel && newAddr) { setAddresses([...addresses, { id: String(Date.now()), label: newLabel, address: newAddr }]); setNewLabel(""); setNewAddr(""); setShowAddAddr(false); } }}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium">Нэмэх</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {activeSection === "feedback" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            {feedbackSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <p className="text-sm font-medium text-black">{t("profile.feedback_sent")}</p>
              </div>
            ) : (
              <>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t("profile.feedback_placeholder")} rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/40" />
                <button onClick={() => { setFeedbackSent(true); setFeedback(""); setTimeout(() => setFeedbackSent(false), 3000); }}
                  disabled={!feedback.trim()}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-primary-light transition-colors">{t("profile.send")}</button>
              </>
            )}
          </div>
        )}

        {/* Settings - Language */}
        {activeSection === "settings" && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-2">{t("profile.language")}</p>
              <div className="flex gap-2">
                {([["mn", "Монгол"], ["en", "English"]] as [Lang, string][]).map(([code, label]) => (
                  <button key={code} onClick={() => switchLang(code)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${lang === code ? "bg-primary text-white" : "border border-gray-200 text-gray-500 hover:border-primary hover:text-primary"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 flex items-center justify-between">
              <span className="text-sm text-black">{"Мэдэгдэл"}</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 flex items-center justify-between">
              <span className="text-sm text-black">{"Нууцлал"}</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
