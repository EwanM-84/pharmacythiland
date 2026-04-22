import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isPaymentSuccess } from "@/lib/payso";
import { sendOrderConfirmation } from "@/lib/email";
import type { Order } from "@/types";

// Payso posts to this URL when payment is confirmed
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      invoiceNo?: string;
      respCode?: string;
      paymentStatus?: string;
      transactionID?: string;
      amount?: number;
    };

    const invoiceNo = body.invoiceNo;
    if (!invoiceNo) {
      return NextResponse.json({ error: "Missing invoiceNo" }, { status: 400 });
    }

    const success = isPaymentSuccess({ respCode: body.respCode ?? "", respDesc: "", paymentStatus: body.paymentStatus, invoiceNo });

    const supabase = createAdminClient();

    // Find order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, items:order_items(*, product:products(name,price,cost_price)), profile:profiles(full_name,phone)")
      .eq("order_number", invoiceNo)
      .single();

    if (orderError || !order) {
      console.error("Order not found for webhook:", invoiceNo);
      return NextResponse.json({ ok: true }); // Don't expose 404 to Payso
    }

    const typedOrder = order as unknown as Order;

    if (success) {
      // Update payment status
      await supabase
        .from("payments")
        .update({ status: "paid", transaction_id: body.transactionID ?? null, raw_response: body as any } as any)
        .eq("order_id", typedOrder.id);

      // Update order status
      await supabase
        .from("orders")
        .update({ status: "confirmed" } as any)
        .eq("id", typedOrder.id);

      // Award loyalty points (1 point per ฿10 spent)
      const pointsEarned = Math.floor(typedOrder.total / 10);
      if (pointsEarned > 0) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("loyalty_balance")
          .eq("id", typedOrder.profile_id)
          .single();
        const currentBalance = (profile as { loyalty_balance: number } | null)?.loyalty_balance ?? 0;
        const newBalance = currentBalance + pointsEarned;

        await supabase
          .from("profiles")
          .update({ loyalty_balance: newBalance } as any)
          .eq("id", typedOrder.profile_id);

        await supabase.from("loyalty_points").insert([{
          profile_id: typedOrder.profile_id,
          order_id: typedOrder.id,
          action: "earned",
          points: pointsEarned,
          balance: newBalance,
        } as any]);
      }

      // Send confirmation email
      const { data: userRecord } = await supabase.auth.admin.getUserById(typedOrder.profile_id);
      const email = userRecord?.user?.email;
      if (email) {
        try {
          const enrichedOrder: Order = {
            ...typedOrder,
            status: "confirmed",
          };
          await sendOrderConfirmation(enrichedOrder, email);
        } catch (emailErr) {
          console.error("Email send failed:", emailErr);
          // Don't fail the webhook for email errors
        }
      }
    } else {
      // Payment failed
      await supabase
        .from("payments")
        .update({ status: "failed", raw_response: body as any } as any)
        .eq("order_id", typedOrder.id);

      await supabase
        .from("orders")
        .update({ status: "cancelled" } as any)
        .eq("id", typedOrder.id);
    }

    // Payso expects a 200 response
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Payso webhook error:", err);
    return NextResponse.json({ ok: true }); // Always 200 to Payso
  }
}
