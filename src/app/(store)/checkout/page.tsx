"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Store, CreditCard, QrCode, Upload, Tag, Coins } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckoutSteps } from "@/components/store/CheckoutSteps";
import type { DeliverySettings, Profile } from "@/types";

type FulfillmentType = "delivery" | "collect";
type PaymentMethod = "promptpay" | "card";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, hasPrescriptionItem } = useCartStore();
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("promptpay");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [loyaltyToRedeem, setLoyaltyToRedeem] = useState(0);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    line1: "", line2: "", district: "", province: "Surat Thani", postal_code: "84320",
  });

  const sub = subtotal();
  const deliveryFee = fulfillment === "collect" ? 0 : (settings ? (settings.free_over && sub >= settings.free_over ? 0 : settings.fee) : 80);
  const discount = promoApplied?.discount ?? 0;
  const loyaltyDiscount = loyaltyToRedeem * 0.1; // 1 point = ฿0.10
  const total = Math.max(0, sub + deliveryFee - discount - loyaltyDiscount);

  const needsPrescription = hasPrescriptionItem();

  useEffect(() => {
    const supabase = createClient();
    supabase.from("delivery_settings").select("*").single().then(({ data }) => setSettings(data as DeliverySettings));
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data as Profile);
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items, router]);

  async function applyPromo() {
    if (!promoCode.trim()) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", promoCode.trim().toUpperCase())
      .single();
    if (error || !data) { toast.error("Invalid promo code"); return; }
    const promo = data as { discount_type: string; discount_value: number; min_order: number | null; expires_at: string | null; uses_remaining: number | null };
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) { toast.error("Promo code expired"); return; }
    if (promo.min_order && sub < promo.min_order) { toast.error(`Minimum order ${formatPrice(promo.min_order)} for this code`); return; }
    const disc = promo.discount_type === "percentage" ? (sub * promo.discount_value) / 100 : promo.discount_value;
    setPromoApplied({ code: promoCode.toUpperCase(), discount: disc });
    toast.success(`Promo applied! You save ${formatPrice(disc)}`);
  }

  async function handlePlaceOrder() {
    if (fulfillment === "delivery" && !address.line1) { toast.error("Please enter your delivery address"); return; }
    if (needsPrescription && !prescriptionFile) { toast.error("Please upload your prescription"); return; }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login?next=/checkout"); return; }

      let prescriptionUrl: string | null = null;
      if (prescriptionFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("prescriptions")
          .upload(`${user.id}/${Date.now()}-${prescriptionFile.name}`, prescriptionFile);
        if (uploadError) throw uploadError;
        prescriptionUrl = supabase.storage.from("prescriptions").getPublicUrl(uploadData.path).data.publicUrl;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          fulfillment_type: fulfillment,
          address: fulfillment === "delivery" ? address : null,
          promo_code: promoApplied?.code ?? null,
          loyalty_points_to_redeem: loyaltyToRedeem,
          payment_method: paymentMethod,
          prescription_url: prescriptionUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      clearCart();

      if (paymentMethod === "promptpay" && data.qrCode) {
        router.push(`/checkout/payment?order=${data.orderNumber}&qr=${encodeURIComponent(data.qrCode)}&method=promptpay`);
      } else if (data.webPaymentUrl) {
        window.location.href = data.webPaymentUrl;
      } else {
        router.push(`/checkout/confirmation?order=${data.orderNumber}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <CheckoutSteps currentStep={2} />
      <h1 className="page-title mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left — Form */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Fulfillment */}
          <div className="card p-5">
            <h2 className="font-bold mb-4">Delivery Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["delivery", "collect"] as FulfillmentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFulfillment(type)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    fulfillment === type
                      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                  }`}
                >
                  {type === "delivery" ? (
                    <MapPin className="w-6 h-6 text-[var(--color-primary-600)]" />
                  ) : (
                    <Store className="w-6 h-6 text-[var(--color-primary-600)]" />
                  )}
                  <span className="font-semibold text-sm capitalize">{type === "collect" ? "Click & Collect" : "Home Delivery"}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {type === "delivery" ? (deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)) : "Free — ready in 30 mins"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          {fulfillment === "delivery" && (
            <div className="card p-5">
              <h2 className="font-bold mb-4">Delivery Address</h2>
              <div className="flex flex-col gap-3">
                <Input label="Address line 1" value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} required placeholder="House / villa number, street name" />
                <Input label="Address line 2 (optional)" value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} placeholder="Village, moo" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="District / Area" value={address.district} onChange={(e) => setAddress((a) => ({ ...a, district: e.target.value }))} placeholder="Bo Put, Chaweng…" />
                  <Input label="Postal code" value={address.postal_code} onChange={(e) => setAddress((a) => ({ ...a, postal_code: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* Prescription upload */}
          {needsPrescription && (
            <div className="card p-5">
              <h2 className="font-bold mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[var(--color-warning)]" />
                Upload Prescription
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                Your cart contains items that require a valid prescription.
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setPrescriptionFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-primary-600)] file:text-white file:text-sm file:font-semibold hover:file:bg-[var(--color-primary-700)] cursor-pointer"
              />
              {prescriptionFile && (
                <p className="text-xs text-success mt-2">✓ {prescriptionFile.name} uploaded</p>
              )}
            </div>
          )}

          {/* Payment method */}
          <div className="card p-5">
            <h2 className="font-bold mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["promptpay", "card"] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === method
                      ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                  }`}
                >
                  {method === "promptpay" ? (
                    <QrCode className="w-5 h-5 text-[var(--color-primary-600)]" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-[var(--color-primary-600)]" />
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-sm">{method === "promptpay" ? "PromptPay" : "Credit / Debit Card"}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{method === "promptpay" ? "Scan QR code" : "Visa, Mastercard"}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Summary */}
        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>

            {/* Items */}
            <ul className="flex flex-col gap-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <li key={item.product_id} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text)] truncate max-w-[200px]">{item.name} × {item.quantity}</span>
                  <span className="font-semibold shrink-0 ml-2">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            {/* Promo code */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide flex items-center gap-1 mb-1.5">
                <Tag className="w-3 h-3" />
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="input-base text-sm py-2 flex-1"
                  disabled={!!promoApplied}
                />
                <Button variant="secondary" size="sm" onClick={applyPromo} disabled={!!promoApplied}>
                  Apply
                </Button>
              </div>
              {promoApplied && (
                <p className="text-xs text-success mt-1">✓ Code &quot;{promoApplied.code}&quot; applied</p>
              )}
            </div>

            {/* Loyalty points */}
            {profile && profile.loyalty_balance > 0 && (
              <div className="mb-4">
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide flex items-center gap-1 mb-1.5">
                  <Coins className="w-3 h-3" />
                  Loyalty Points ({profile.loyalty_balance} pts = {formatPrice(profile.loyalty_balance * 0.1)})
                </label>
                <input
                  type="range"
                  min={0}
                  max={profile.loyalty_balance}
                  value={loyaltyToRedeem}
                  onChange={(e) => setLoyaltyToRedeem(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary-600)]"
                />
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Redeeming {loyaltyToRedeem} pts = {formatPrice(loyaltyToRedeem * 0.1)} off
                </p>
              </div>
            )}

            {/* Totals */}
            <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-2 mb-5">
              <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">Subtotal</span><span>{formatPrice(sub)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--color-text-secondary)]">Delivery</span><span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-success"><span>Promo discount</span><span>-{formatPrice(discount)}</span></div>}
              {loyaltyDiscount > 0 && <div className="flex justify-between text-sm text-success"><span>Loyalty discount</span><span>-{formatPrice(loyaltyDiscount)}</span></div>}
              <div className="flex justify-between font-bold text-lg border-t border-[var(--color-border)] pt-2 mt-1">
                <span>Total</span>
                <span className="text-[var(--color-primary-700)]">{formatPrice(total)}</span>
              </div>
            </div>

            <Button onClick={handlePlaceOrder} loading={loading} className="w-full">
              Place Order — {formatPrice(total)}
            </Button>

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-3">
              Secure payment powered by Pay Solutions Thailand
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
