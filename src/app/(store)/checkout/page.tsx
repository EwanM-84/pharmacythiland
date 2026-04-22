"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Store, CreditCard, Lock, ChevronRight,
  CheckCircle, Shield, Truck, Tag
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

type Step = 1 | 2 | 3;
type Fulfillment = "delivery" | "collect";
type PayMethod = "card" | "applepay" | "paypal" | "promptpay";

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
}
function detectCardType(num: string): string {
  const n = num.replace(/\s/g, "");
  if (n.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "unknown";
}

function StepIndicator({ step }: { step: Step }) {
  const steps = ["Delivery", "Payment", "Review"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const idx = (i + 1) as Step;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={s} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? "bg-green-500 text-white" : active ? "text-white" : "bg-gray-200 text-gray-500"}`}
                style={active ? { background: "var(--color-ios-blue)" } : {}}>
                {done ? <CheckCircle className="w-4 h-4" /> : idx}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${active ? "text-blue-700" : done ? "text-green-700" : "text-gray-400"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 rounded ${step > idx ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>(1);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    firstName: "", lastName: "", line1: "", line2: "",
    district: "", province: "Surat Thani", postal: "84320", phone: "",
  });
  const [card, setCard] = useState({
    number: "", name: "", expiry: "", cvv: "", saveCard: false,
  });

  const sub = subtotal();
  const deliveryFee = fulfillment === "collect" ? 0 : (sub >= 500 ? 0 : 80);
  const promoDiscount = promoApplied?.discount ?? 0;
  const total = Math.max(0, sub + deliveryFee - promoDiscount);
  const cardType = detectCardType(card.number);

  const PROMO_CODES: Record<string, number> = { "SAMUI10": sub * 0.10, "SAVE50": 50, "WELCOME": 100, "NHS20": sub * 0.20 };

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    const discount = PROMO_CODES[code];
    if (!discount) { alert("Invalid promo code. Try: SAMUI10, SAVE50, WELCOME"); return; }
    setPromoApplied({ code, discount: Math.round(discount) });
  }

  async function placeOrder() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2800));
    clearCart();
    const orderNum = `SHP-${Date.now().toString(36).toUpperCase()}`;
    router.push(`/checkout/confirmation?order=${orderNum}&total=${total}&method=${payMethod}`);
  }

  if (items.length === 0 && !processing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-12">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some products before checking out.</p>
          <Link href="/shop" className="btn-primary px-6 py-3 rounded-xl inline-flex">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-5 shadow-2xl max-w-sm w-full mx-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="spinner w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">Processing your payment</p>
              <p className="text-sm text-gray-500 mt-1">Please wait, do not close this window…</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5" /> 256-bit SSL encrypted
            </div>
          </div>
        </div>
      )}

      <StepIndicator step={step} />

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ── LEFT FORM ── */}
        <div className="lg:col-span-3 flex flex-col gap-5">

          {/* ── STEP 1: Delivery ── */}
          {step === 1 && (
            <>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Delivery Method</h2>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  {(["delivery", "collect"] as Fulfillment[]).map((type) => (
                    <button key={type} onClick={() => setFulfillment(type)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${fulfillment === type ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                      {type === "delivery" ? <Truck className={`w-6 h-6 ${fulfillment === type ? "text-blue-600" : "text-gray-400"}`} /> : <Store className={`w-6 h-6 ${fulfillment === type ? "text-blue-600" : "text-gray-400"}`} />}
                      <span className={`font-bold text-sm ${fulfillment === type ? "text-blue-700" : "text-gray-700"}`}>
                        {type === "delivery" ? "Home Delivery" : "Click & Collect"}
                      </span>
                      <span className="text-xs text-gray-500">{type === "delivery" ? (deliveryFee === 0 ? "FREE" : `฿${deliveryFee}`) : "Free — 30 mins"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {fulfillment === "delivery" && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <h2 className="font-bold text-gray-900">Delivery Address</h2>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">First Name *</label>
                        <input value={address.firstName} onChange={(e) => setAddress((a) => ({ ...a, firstName: e.target.value }))}
                          placeholder="John" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Last Name *</label>
                        <input value={address.lastName} onChange={(e) => setAddress((a) => ({ ...a, lastName: e.target.value }))}
                          placeholder="Smith" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Address Line 1 *</label>
                      <input value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                        placeholder="Villa / house number, street name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Address Line 2 (optional)</label>
                      <input value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
                        placeholder="Village, Moo" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">District / Area *</label>
                        <input value={address.district} onChange={(e) => setAddress((a) => ({ ...a, district: e.target.value }))}
                          placeholder="Chaweng, Bo Put…" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Postal Code</label>
                        <input value={address.postal} onChange={(e) => setAddress((a) => ({ ...a, postal: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number *</label>
                      <input value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                        placeholder="+66 XX XXX XXXX" type="tel" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
                </div>
              )}

              {fulfillment === "collect" && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Store className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-blue-900">Collection Point</p>
                      <p className="text-sm text-blue-700 mt-1">Samui Home Clinic Pharmacy<br />123 Chaweng Beach Road, Koh Samui<br />Surat Thani 84320</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Ready for collection in 30 minutes after order confirmation.</p>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:brightness-105"
                style={{ background: "var(--color-ios-blue)" }}>
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-600" /> Payment Method</h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500"><Lock className="w-3.5 h-3.5" /> Secure checkout</div>
                </div>
                <div className="p-5">
                  {/* Method selector */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {([
                      { id: "card" as const, label: "Credit / Debit Card", icon: "💳" },
                      { id: "applepay" as const, label: "Apple Pay", icon: "" },
                      { id: "paypal" as const, label: "PayPal", icon: "" },
                      { id: "promptpay" as const, label: "PromptPay QR", icon: "📱" },
                    ] as { id: PayMethod; label: string; icon: string }[]).map((m) => (
                      <button key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${payMethod === m.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-blue-300"}`}>
                        {m.id === "applepay" ? (
                          <svg viewBox="0 0 50 20" className="h-5 w-auto" fill="currentColor"><text y="16" fontSize="16" fontWeight="bold" fontFamily="-apple-system">Pay</text></svg>
                        ) : m.id === "paypal" ? (
                          <span className="font-black text-blue-700 text-xs">Pay<span className="text-blue-400">Pal</span></span>
                        ) : (
                          <span className="text-lg leading-none">{m.icon}</span>
                        )}
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Card form */}
                  {payMethod === "card" && (
                    <div className="flex flex-col gap-4">
                      {/* Card number */}
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Card Number</label>
                        <div className="relative">
                          <input
                            value={card.number}
                            onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-xl text-sm font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 tracking-widest"
                          />
                          {/* Card type icons */}
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            {cardType === "visa" && (
                              <div className="px-2 py-0.5 bg-blue-700 rounded text-white text-[10px] font-black tracking-wider">VISA</div>
                            )}
                            {cardType === "mastercard" && (
                              <div className="flex">
                                <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                                <div className="w-5 h-5 rounded-full bg-yellow-400 -ml-2 opacity-90" />
                              </div>
                            )}
                            {cardType === "amex" && (
                              <div className="px-2 py-0.5 bg-blue-500 rounded text-white text-[10px] font-black">AMEX</div>
                            )}
                            {cardType === "unknown" && (
                              <div className="flex gap-1">
                                <div className="px-1.5 py-0.5 bg-blue-700 rounded text-white text-[9px] font-black">VISA</div>
                                <div className="flex">
                                  <div className="w-4 h-4 rounded-full bg-red-500" />
                                  <div className="w-4 h-4 rounded-full bg-yellow-400 -ml-1.5" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Cardholder Name</label>
                        <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
                          placeholder="JOHN SMITH"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 uppercase tracking-wider" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Expiry Date</label>
                          <input value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                            placeholder="MM / YY" maxLength={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 tracking-widest" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1.5">CVV / CVC</label>
                          <div className="relative">
                            <input value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                              placeholder="•••"
                              type="password" maxLength={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          </div>
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={card.saveCard} onChange={(e) => setCard((c) => ({ ...c, saveCard: e.target.checked }))}
                          className="w-4 h-4 accent-blue-600 rounded" />
                        <span className="text-sm text-gray-700">Save this card for future purchases</span>
                      </label>
                    </div>
                  )}

                  {/* Apple Pay */}
                  {payMethod === "applepay" && (
                    <div className="flex flex-col items-center gap-4 py-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-2xl">🍎</span>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">Apple Pay</p>
                        <p className="text-sm text-gray-500 mt-1">You&apos;ll be prompted to confirm payment using Face ID or Touch ID</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400"><Lock className="w-3.5 h-3.5" /> Payment secured by Apple</div>
                    </div>
                  )}

                  {/* PayPal */}
                  {payMethod === "paypal" && (
                    <div className="flex flex-col items-center gap-4 py-6">
                      <div className="text-4xl font-black text-blue-700">Pay<span className="text-blue-400">Pal</span></div>
                      <p className="text-sm text-gray-500 text-center">You will be redirected to PayPal to complete your payment securely.</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400"><Shield className="w-3.5 h-3.5" /> Buyer Protection included</div>
                    </div>
                  )}

                  {/* PromptPay QR */}
                  {payMethod === "promptpay" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-40 h-40 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                        <svg viewBox="0 0 200 200" className="w-36 h-36">
                          <rect width="200" height="200" fill="white"/>
                          {/* Fake QR code pattern */}
                          {Array.from({length:7}).map((_,r)=>Array.from({length:7}).map((_,c)=>{
                            const border=[0,6].includes(r)||[0,6].includes(c);
                            const inner=r>=1&&r<=5&&c>=1&&c<=5&&([0,4].includes(r-1)||[0,4].includes(c-1));
                            const fill=border||inner;
                            return fill?<rect key={`${r}-${c}`} x={10+c*26} y={10+r*26} width="24" height="24" fill="#000"/>:null;
                          }))}
                          {Array.from({length:7}).map((_,r)=>Array.from({length:7}).map((_,c)=>{
                            const border=[0,6].includes(r)||[0,6].includes(c);
                            const inner=r>=1&&r<=5&&c>=1&&c<=5&&([0,4].includes(r-1)||[0,4].includes(c-1));
                            const fill=border||inner;
                            return fill?<rect key={`br-${r}-${c}`} x={10+c*26} y={110+r*26} width="24" height="24" fill="#000"/>:null;
                          }))}
                          {[60,90,110,140,160,40,70,100,130].map((x,i)=>[60,80,120,140,50,90,110,130,60].map((y,j)=>(i+j)%3===0?<rect key={`d-${i}-${j}`} x={x} y={y} width="16" height="16" fill="#000"/>:null))}
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900">Scan with your banking app</p>
                        <p className="text-sm text-gray-500 mt-1">Open PromptPay in any Thai banking app and scan the QR code to pay <strong>฿{total.toLocaleString()}</strong></p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["SCB", "KBank", "Bangkok Bank", "Krungthai", "TTB"].map((b) => (
                          <span key={b} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SSL badges */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><Lock className="w-3.5 h-3.5 text-green-600" /> SSL Encrypted</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><Shield className="w-3.5 h-3.5 text-blue-600" /> PCI DSS Compliant</div>
                    {["VISA","MC","AMEX"].map((b) => (
                      <div key={b} className="px-2 py-0.5 border border-gray-200 rounded text-[10px] font-bold text-gray-500">{b}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(3)}
                  className="flex-[3] py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:brightness-105"
                  style={{ background: "var(--color-ios-blue)" }}>
                  Review Order <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Review ── */}
          {step === 3 && (
            <>
              {/* Delivery summary */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /> Delivery Details</h2>
                  <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline font-semibold">Change</button>
                </div>
                <div className="p-5 text-sm text-gray-700">
                  {fulfillment === "delivery" ? (
                    <>
                      <p className="font-semibold">{address.firstName} {address.lastName}</p>
                      <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                      <p>{address.district}, {address.province} {address.postal}</p>
                      <p className="text-gray-500 mt-1">{address.phone}</p>
                    </>
                  ) : (
                    <p>Click &amp; Collect — 123 Chaweng Beach Road, Koh Samui</p>
                  )}
                </div>
              </div>

              {/* Payment summary */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-600" /> Payment Method</h2>
                  <button onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline font-semibold">Change</button>
                </div>
                <div className="p-5 text-sm text-gray-700">
                  {payMethod === "card" && <p>💳 Card ending in {card.number.slice(-4) || "••••"}</p>}
                  {payMethod === "applepay" && <p>🍎 Apple Pay</p>}
                  {payMethod === "paypal" && <p>PayPal</p>}
                  {payMethod === "promptpay" && <p>📱 PromptPay QR</p>}
                </div>
              </div>

              {/* Items review */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Order Items ({items.length})</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.product_id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">💊</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm shrink-0">฿{(item.price * item.quantity).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button onClick={placeOrder}
                  className="flex-[3] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-95"
                  style={{ background: "var(--color-primary-600)", color: "#fff" }}>
                  <Lock className="w-4 h-4" /> Place Order — ฿{total.toLocaleString()}
                </button>
              </div>

              <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Secure payment powered by Pay Solutions Thailand. Your data is 256-bit encrypted.
              </p>
            </>
          )}
        </div>

        {/* ── ORDER SUMMARY SIDEBAR ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-gray-100" style={{ background: "#F7F9FB" }}>
              <h2 className="font-bold text-gray-900">Order Summary</h2>
            </div>

            {/* Items */}
            <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50">
              {items.map((item) => (
                <li key={item.product_id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">💊</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900 shrink-0">฿{(item.price * item.quantity).toLocaleString()}</p>
                </li>
              ))}
            </ul>

            {/* Promo code */}
            <div className="px-4 pt-3 pb-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-1 mb-1.5"><Tag className="w-3 h-3" /> Promo Code</label>
              <div className="flex gap-2">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code" disabled={!!promoApplied}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-400 font-mono uppercase" />
                <button onClick={applyPromo} disabled={!!promoApplied}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-40"
                  style={{ background: "var(--color-ios-blue)" }}>Apply</button>
              </div>
              {promoApplied && (
                <p className="text-xs text-green-700 mt-1 font-semibold">✓ &ldquo;{promoApplied.code}&rdquo; applied — saving ฿{promoApplied.discount.toLocaleString()}</p>
              )}
              {!promoApplied && <p className="text-[11px] text-gray-400 mt-1">Try: SAMUI10, SAVE50, WELCOME</p>}
            </div>

            {/* Totals */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({items.reduce((s,i)=>s+i.quantity,0)})</span>
                <span className="font-medium">฿{sub.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className={deliveryFee === 0 ? "text-green-700 font-semibold" : "font-medium"}>
                  {deliveryFee === 0 ? "FREE" : `฿${deliveryFee}`}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Promo savings</span><span>−฿{promoDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-1">
                <span>Order Total</span>
                <span className="text-blue-700">฿{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="px-4 pb-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 justify-center pt-1">
                <Lock className="w-3 h-3" /> SSL Encrypted · PCI DSS Compliant
              </div>
              {deliveryFee === 0 ? (
                <div className="flex items-center gap-1.5 text-[11px] text-green-700 bg-green-50 rounded-lg px-3 py-2 font-semibold">
                  <Truck className="w-3.5 h-3.5" /> You qualify for FREE delivery!
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <Truck className="w-3.5 h-3.5" /> Add ฿{(500 - sub).toLocaleString()} more for FREE delivery
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
