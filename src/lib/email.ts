import type { Order } from "@/types";
import { formatPrice, formatDate } from "./utils";

// Only import Resend on the server
async function getResend() {
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY!);
}

const FROM = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  ? `Samui Home Clinic Pharmacy <${process.env.NEXT_PUBLIC_CONTACT_EMAIL}>`
  : "Samui Home Clinic Pharmacy <orders@samuihomeclinicpharmacy.com>";

// ---- Order Confirmation ----
export async function sendOrderConfirmation(order: Order, email: string) {
  const resend = await getResend();

  const itemsHtml = (order.items ?? [])
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;">${i.product?.name ?? "Product"}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;">${formatPrice(i.total_price)}</td>
        </tr>`
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Order Confirmed — ${order.order_number}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:24px;font-weight:800;color:#0891b2;">Samui Home Clinic Pharmacy</span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px;">Your order is confirmed!</h1>
        <p style="color:#6b7280;margin-bottom:24px;">Order number: <strong style="color:#0891b2;">${order.order_number}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr>
              <th style="text-align:left;padding-bottom:8px;font-size:12px;color:#6b7280;text-transform:uppercase;">Item</th>
              <th style="text-align:center;padding-bottom:8px;font-size:12px;color:#6b7280;text-transform:uppercase;">Qty</th>
              <th style="text-align:right;padding-bottom:8px;font-size:12px;color:#6b7280;text-transform:uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="background:#f8fafb;border-radius:12px;padding:16px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#6b7280;">Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#6b7280;">Delivery</span><span>${order.delivery_fee > 0 ? formatPrice(order.delivery_fee) : "Free"}</span></div>
          ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#6b7280;">Discount</span><span style="color:#22c55e;">-${formatPrice(order.discount)}</span></div>` : ""}
          <div style="display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;padding-top:8px;font-weight:700;"><span>Total</span><span style="color:#0891b2;">${formatPrice(order.total)}</span></div>
        </div>
        <div style="background:#ecfeff;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="margin:0;font-weight:600;color:#0891b2;">${order.fulfillment_type === "collect" ? "Click & Collect" : "Home Delivery"}</p>
          ${order.fulfillment_type === "delivery" && order.delivery_address ? `<p style="margin:4px 0 0;color:#6b7280;">${order.delivery_address.line1}${order.delivery_address.district ? `, ${order.delivery_address.district}` : ""}</p>` : ""}
        </div>
        <p style="color:#6b7280;font-size:13px;">Placed on ${formatDate(order.created_at)}</p>
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:32px;">Samui Home Clinic Pharmacy — Koh Samui, Thailand</p>
      </div>
    `,
  });
}

// ---- Dispatch Notification ----
export async function sendDispatchNotification(order: Order, email: string) {
  const resend = await getResend();

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your order ${order.order_number} is on its way!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:24px;font-weight:800;color:#0891b2;">Samui Home Clinic Pharmacy</span>
        </div>
        <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px;">Your order is on its way! 🚀</h1>
        <p style="color:#6b7280;">Order <strong style="color:#0891b2;">${order.order_number}</strong> has been dispatched and is heading to you.</p>
        <div style="background:#ecfeff;border-radius:12px;padding:16px;margin-top:24px;">
          <p style="margin:0;color:#6b7280;">Estimated delivery: within the next few hours</p>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:32px;">Samui Home Clinic Pharmacy — Koh Samui, Thailand</p>
      </div>
    `,
  });
}
