// ============================================================
// Pay Solutions (Payso) API wrapper
// Docs: https://api-docs.paysolutions.asia/
// ============================================================

const PAYSO_API_BASE = "https://apis.paysolutions.asia";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    apikey: process.env.PAYSO_API_KEY!,
    secretkey: process.env.PAYSO_SECRET_KEY!,
  };
}

// ---- Types ----

export interface PaysoOrderPayload {
  merchantID: string;
  invoiceNo: string;           // our order_number
  description: string;
  amount: number;              // in THB
  currencyCode: string;        // "THB"
  paymentChannel: string[];    // ["PP"] for PromptPay, ["CC"] for card
  frontendReturnUrl: string;
  backendReturnUrl: string;    // webhook
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface PaysoOrderResponse {
  respCode: string;
  respDesc: string;
  invoiceNo: string;
  paymentToken?: string;     // redirect token
  qrCode?: string;           // PromptPay QR (base64 or URL)
  webPaymentUrl?: string;    // redirect URL for card
}

export interface PaysoVerifyResponse {
  respCode: string;
  respDesc: string;
  invoiceNo: string;
  transactionID?: string;
  amount?: number;
  paymentStatus?: string;    // "000" = success
}

// ---- Create a PromptPay payment order ----
export async function createPromptPayOrder(payload: PaysoOrderPayload): Promise<PaysoOrderResponse> {
  const res = await fetch(`${PAYSO_API_BASE}/order/orderdetailpost`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      ...payload,
      merchantID: process.env.PAYSO_MERCHANT_ID!,
      paymentChannel: ["PP"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Payso API error: ${res.status}`);
  }

  return res.json() as Promise<PaysoOrderResponse>;
}

// ---- Create a card payment order (redirect) ----
export async function createCardOrder(payload: PaysoOrderPayload): Promise<PaysoOrderResponse> {
  const res = await fetch(`${PAYSO_API_BASE}/order/orderdetailpost`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      ...payload,
      merchantID: process.env.PAYSO_MERCHANT_ID!,
      paymentChannel: ["CC"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Payso API error: ${res.status}`);
  }

  return res.json() as Promise<PaysoOrderResponse>;
}

// ---- Verify payment status ----
export async function verifyPayment(invoiceNo: string): Promise<PaysoVerifyResponse> {
  const res = await fetch(`${PAYSO_API_BASE}/payment/inquiry`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      merchantID: process.env.PAYSO_MERCHANT_ID!,
      invoiceNo,
    }),
  });

  if (!res.ok) {
    throw new Error(`Payso verify error: ${res.status}`);
  }

  return res.json() as Promise<PaysoVerifyResponse>;
}

// ---- Check if a webhook callback is a successful payment ----
export function isPaymentSuccess(payload: PaysoVerifyResponse): boolean {
  return payload.paymentStatus === "000" || payload.respCode === "0000";
}
