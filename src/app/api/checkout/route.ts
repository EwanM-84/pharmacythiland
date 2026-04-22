import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerClient } from "@/lib/supabase/server";
import { createPromptPayOrder, createCardOrder } from "@/lib/payso";
import { generateOrderNumber } from "@/lib/utils";
import type { CheckoutPayload, OrderItem } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutPayload & {
      prescription_url?: string;
      promo_code?: string | null;
    };

    const supabaseServer = await createServerClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // ---- Validate products & calculate totals ----
    const productIds = body.items.map((i) => i.product_id);
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id,name,price,stock_qty,requires_prescription")
      .in("id", productIds);

    if (productError) throw productError;

    // Verify stock & prices
    for (const item of body.items) {
      const product = products?.find((p: { id: string; stock_qty: number; price: number }) => p.id === item.product_id);
      if (!product || product.stock_qty < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      }
    }

    // ---- Delivery settings ----
    const { data: deliverySettings } = await supabase
      .from("delivery_settings")
      .select("*")
      .single();

    const subtotal = body.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee =
      body.fulfillment_type === "collect"
        ? 0
        : deliverySettings?.free_over && subtotal >= deliverySettings.free_over
        ? 0
        : (deliverySettings?.fee ?? 80);

    // ---- Promo code ----
    let discount = 0;
    if (body.promo_code) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", body.promo_code)
        .single();
      if (promo) {
        const p = promo as { discount_type: string; discount_value: number; min_order: number | null };
        discount =
          p.discount_type === "percentage"
            ? (subtotal * p.discount_value) / 100
            : p.discount_value;
        // Decrement uses
        await supabase
          .from("promo_codes")
          .update({ uses_remaining: (promo as { uses_remaining: number }).uses_remaining - 1 } as any)
          .eq("code", body.promo_code);
      }
    }

    // ---- Loyalty redemption ----
    const loyaltyDiscount = (body.loyalty_points_to_redeem ?? 0) * 0.1;
    if (body.loyalty_points_to_redeem && body.loyalty_points_to_redeem > 0) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("loyalty_balance")
        .eq("id", user.id)
        .single();
      const bal = (profile as { loyalty_balance: number } | null)?.loyalty_balance ?? 0;
      if (body.loyalty_points_to_redeem > bal) {
        return NextResponse.json({ error: "Insufficient loyalty points" }, { status: 400 });
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount - loyaltyDiscount);
    const orderNumber = generateOrderNumber();

    // ---- Create order ----
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          profile_id: user.id,
          status: "pending",
          fulfillment_type: body.fulfillment_type,
          subtotal,
          delivery_fee: deliveryFee,
          discount: discount + loyaltyDiscount,
          total,
          delivery_address: body.address ?? null,
          prescription_url: body.prescription_url ?? null,
          promo_code: body.promo_code ?? null,
        } as any,
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // ---- Create order items ----
    const orderItems: Omit<OrderItem, "id" | "product">[] = body.items.map((i) => ({
      order_id: (order as { id: string }).id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.price,
      total_price: i.price * i.quantity,
    }));

    await supabase.from("order_items").insert(orderItems as any[]);

    // Deduct stock
    for (const item of body.items) {
      const product = products?.find((p: { id: string; stock_qty: number }) => p.id === item.product_id);
      if (product) {
        await supabase
          .from("products")
          .update({ stock_qty: product.stock_qty - item.quantity } as any)
          .eq("id", item.product_id);
      }
    }

    // Deduct loyalty points
    if (body.loyalty_points_to_redeem && body.loyalty_points_to_redeem > 0) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("loyalty_balance")
        .eq("id", user.id)
        .single();
      const bal = (profile as { loyalty_balance: number } | null)?.loyalty_balance ?? 0;
      await supabase
        .from("profiles")
        .update({ loyalty_balance: bal - body.loyalty_points_to_redeem } as any)
        .eq("id", user.id);
      await supabase.from("loyalty_points").insert([{
        profile_id: user.id,
        order_id: (order as { id: string }).id,
        action: "redeemed",
        points: -body.loyalty_points_to_redeem,
        balance: bal - body.loyalty_points_to_redeem,
      } as any]);
    }

    // ---- Log cart event ----
    await supabase.from("cart_events").insert(
      body.items.map((i) => ({
        profile_id: user.id,
        product_id: i.product_id,
        action: "checkout",
        quantity: i.quantity,
      } as any))
    );

    // ---- Initiate Payso payment ----
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samuihomepharmacy.netlify.app";
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name,phone")
      .eq("id", user.id)
      .single();

    const paysoPayload = {
      merchantID: process.env.PAYSO_MERCHANT_ID!,
      invoiceNo: orderNumber,
      description: `Order ${orderNumber} — Samui Home Clinic Pharmacy`,
      amount: total,
      currencyCode: "THB",
      paymentChannel: [body.payment_method === "promptpay" ? "PP" : "CC"],
      frontendReturnUrl: `${siteUrl}/checkout/confirmation?order=${orderNumber}`,
      backendReturnUrl: `${siteUrl}/api/webhooks/payso`,
      customerName: (profile as { full_name: string | null } | null)?.full_name ?? undefined,
      customerEmail: user.email,
      customerPhone: (profile as { phone: string | null } | null)?.phone ?? undefined,
    };

    let paymentResponse;
    if (body.payment_method === "promptpay") {
      paymentResponse = await createPromptPayOrder(paysoPayload);
    } else {
      paymentResponse = await createCardOrder(paysoPayload);
    }

    // Create pending payment record
    await supabase.from("payments").insert([{
      order_id: (order as { id: string }).id,
      provider: "payso",
      method: body.payment_method,
      status: "pending",
      amount: total,
      currency: "THB",
      raw_response: paymentResponse as any,
    } as any]);

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: (order as { id: string }).id,
      qrCode: paymentResponse.qrCode ?? null,
      webPaymentUrl: paymentResponse.webPaymentUrl ?? null,
    });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
