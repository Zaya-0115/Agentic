"use client";
import { useState } from "react";
import { CartItem, MerchantSource } from "@/lib/merchants/types";

const DELIVERY_POLICY: Record<string, { label: string; time: string; fee: number; freeAbove: number; color: string }> = {
  cody: { label: "Cody мерчант", time: "48 цагийн дотор", fee: 5000, freeAbove: 50000, color: "border-purple-200 bg-purple-50" },
  zary: { label: "Zary.mn", time: "48 цагийн дотор", fee: 3000, freeAbove: 30000, color: "border-pink-200 bg-pink-50" },
  shoppy: { label: "Shoppy.mn", time: "1-3 өдөр", fee: 5000, freeAbove: 50000, color: "border-emerald-200 bg-emerald-50" },
  shoppyhub: { label: "ShoppyHub.mn", time: "7-14 өдөр", fee: 15000, freeAbove: 100000, color: "border-blue-200 bg-blue-50" },
};

const PAYMENT_METHODS = [
  { id: "wallet", name: "Selecto хэтэвч", icon: "W", desc: "Үлдэгдэл: 342,500₮" },
  { id: "qpay", name: "QPay", icon: "Q", desc: "QR код" },
  { id: "socialpay", name: "SocialPay", icon: "S", desc: "Утасны дугаар" },
  { id: "card", name: "Карт", icon: "C", desc: "Visa / Mastercard" },
];

function fmt(n: number) { return n.toLocaleString("mn-MN") + "₮"; }

interface Props {
  items: CartItem[];
  onClose: () => void;
  onComplete: () => void;
}

export default function CheckoutView({ items, onClose, onComplete }: Props) {
  const [step, setStep] = useState<"review" | "payment" | "done">("review");
  const [selectedPayment, setSelectedPayment] = useState("wallet");

  // Group by merchant source
  const grouped = new Map<string, CartItem[]>();
  items.forEach((item) => {
    const key = item.product.source;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  });

  // Calculate per-merchant orders
  const orders = Array.from(grouped.entries()).map(([source, sourceItems], idx) => {
    const policy = DELIVERY_POLICY[source] || DELIVERY_POLICY.cody;
    const subtotal = sourceItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const deliveryFee = subtotal >= policy.freeAbove ? 0 : policy.fee;
    return {
      id: `ORD-${Date.now()}-${idx}`,
      source: source as MerchantSource,
      policy,
      items: sourceItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };
  });

  const grandTotal = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-black">
            {step === "review" ? "Захиалга баталгаажуулах" : step === "payment" ? "Төлбөр төлөх" : "Амжилттай!"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 pb-6">
          {step === "review" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">{orders.length} тусдаа захиалга үүснэ — мерчант бүр өөрийн захиалгыг хүлээн авна</p>

              {orders.map((order, idx) => (
                <div key={order.id} className={`rounded-2xl border p-4 ${order.policy.color}`}>
                  {/* Order header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">Захиалга #{idx + 1}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-gray-600">{order.policy.label}</span>
                    </div>
                    <span className="text-sm font-bold text-black">{fmt(order.total)}</span>
                  </div>

                  {/* Items */}
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 py-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-black truncate">{item.product.title}</p>
                        <p className="text-[10px] text-gray-500">{item.product.merchantName} x{item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-black">{fmt(item.product.price * item.quantity)}</span>
                    </div>
                  ))}

                  {/* Delivery policy */}
                  <div className="mt-3 pt-3 border-t border-white/50 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-600">Хүргэлт</span>
                      <span className="font-medium text-gray-800">{order.policy.time}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-600">Хүргэлтийн төлбөр</span>
                      <span className={`font-medium ${order.deliveryFee === 0 ? "text-emerald-600" : "text-gray-800"}`}>
                        {order.deliveryFee === 0 ? "Үнэгүй" : fmt(order.deliveryFee)}
                      </span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <p className="text-[10px] text-gray-400">{fmt(order.policy.freeAbove)}-с дээш захиалгад үнэгүй хүргэлт</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Grand total */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Нийт ({orders.length} захиалга)</span>
                <span className="text-2xl font-bold text-black">{fmt(grandTotal)}</span>
              </div>

              <button onClick={() => setStep("payment")}
                className="w-full py-3.5 bg-primary hover:bg-primary-light text-white font-medium rounded-xl transition-colors">
                Төлбөр төлөх
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">Төлбөрийн хэлбэр сонгоно уу</p>

              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.id} onClick={() => setSelectedPayment(m.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      selectedPayment === m.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      selectedPayment === m.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    }`}>{m.icon}</div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-black">{m.name}</p>
                      <p className="text-[10px] text-gray-400">{m.desc}</p>
                    </div>
                    {selectedPayment === m.id && (
                      <svg className="w-5 h-5 text-primary ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">Төлөх дүн</span>
                <span className="text-xl font-bold text-black">{fmt(grandTotal)}</span>
              </div>

              <button onClick={() => setStep("done")}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors">
                {fmt(grandTotal)} төлөх
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Захиалга амжилттай!</h3>
              <p className="text-sm text-gray-400 mb-6">{orders.length} захиалга мерчант бүрт илгээгдлээ</p>

              <div className="space-y-2 text-left mb-6">
                {orders.map((o, i) => (
                  <div key={o.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-black">{o.policy.label}</p>
                      <p className="text-[10px] text-gray-400">Хүргэлт: {o.policy.time}</p>
                    </div>
                    <span className="text-xs font-bold text-black">{fmt(o.total)}</span>
                  </div>
                ))}
              </div>

              <button onClick={onComplete}
                className="w-full py-3 bg-primary hover:bg-primary-light text-white font-medium rounded-xl transition-colors">
                Дуусгах
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
