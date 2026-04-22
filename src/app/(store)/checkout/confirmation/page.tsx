import Link from "next/link";
import { CheckCircle, Package, Truck, Store, ArrowRight, Download, Share2 } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ order?: string; total?: string; method?: string }>;
}

function getEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { order: orderNumber, total, method } = await searchParams;
  const totalAmount = total ? Number(total) : null;
  const isCollect = method === "collect";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Progress */}
      <div className="flex items-center gap-0 mb-10">
        {["Delivery", "Payment", "Confirmed"].map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-green-700 hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-0.5 mx-3 rounded bg-green-400" />}
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        {/* Success header */}
        <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(135deg,#F0FFF4,#DCFCE7)" }}>
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Order Confirmed!</h1>
          <p className="text-gray-600 text-sm">Thank you for your order. We&apos;ve sent a confirmation to your email.</p>
          {orderNumber && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white rounded-full border border-green-200 shadow-sm">
              <span className="text-xs text-gray-500">Order number:</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{orderNumber}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="px-6 py-6 flex flex-col gap-4 border-t border-gray-100">
          {/* Delivery estimate */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            {isCollect ? (
              <Store className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
            ) : (
              <Truck className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-bold text-blue-900 text-sm">
                {isCollect ? "Ready for Collection" : "Estimated Delivery"}
              </p>
              <p className="text-blue-700 font-semibold text-base mt-0.5">
                {isCollect ? "Ready in 30 minutes" : getEstimatedDelivery()}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                {isCollect
                  ? "123 Chaweng Beach Road, Koh Samui — present your order number on arrival"
                  : "Our pharmacist will prepare your order and dispatch it as soon as possible"}
              </p>
            </div>
          </div>

          {/* Order value */}
          {totalAmount && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <Package className="w-6 h-6 text-gray-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Order Total Paid</p>
                <p className="font-extrabold text-xl text-gray-900">฿{totalAmount.toLocaleString()}</p>
              </div>
              <span className="badge badge-success text-xs font-bold">Paid</span>
            </div>
          )}

          {/* What happens next */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">What happens next?</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {[
                { step: "1", title: "Pharmacist Review", desc: "Our licensed pharmacist reviews and prepares your order", time: "Within 15 mins" },
                { step: "2", title: "Order Dispatched", desc: "Your order is handed to our delivery driver", time: "Within 1 hour" },
                { step: "3", title: isCollect ? "Ready to Collect" : "Delivered", desc: isCollect ? "We'll call when your order is ready" : "Our driver delivers to your address", time: isCollect ? "30 minutes" : getEstimatedDelivery() },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 shrink-0" style={{ background: "var(--color-ios-blue)" }}>
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold whitespace-nowrap">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <Link href="/account/orders"
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:brightness-105"
            style={{ background: "var(--color-ios-blue)" }}>
            Track My Order <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Receipt
            </button>
            <button className="py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
          <Link href="/shop"
            className="text-center text-sm font-semibold text-blue-600 hover:underline py-2">
            Continue Shopping →
          </Link>
        </div>
      </div>

      {/* Loyalty points earned */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
        <div className="text-2xl">⭐</div>
        <div>
          <p className="font-bold text-amber-900 text-sm">Loyalty Points Earned!</p>
          <p className="text-amber-700 text-xs mt-0.5">
            You earned <strong>{Math.floor((totalAmount ?? 0) / 10)} points</strong> on this order. Keep shopping to unlock rewards.
          </p>
        </div>
      </div>
    </div>
  );
}
