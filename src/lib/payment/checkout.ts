import { apiRequest } from "@/lib/api/client";
import { CHECKOUT_STORAGE_KEY } from "@/lib/orders/types";
import { openRazorpayCheckout, RazorpaySuccessResponse } from "@/lib/payment/razorpay";

export const CHECKOUT_IDEMPOTENCY_KEY = "dc_checkout_idempotency";
export const PAYMENT_RESULT_KEY = "dc_payment_result";

export interface CheckoutInitiateResponse {
  checkout_batch_id: string;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount_paise: number;
  currency: string;
  description: string;
  order_count: number;
  prefill?: { name?: string; contact?: string };
}

export interface CheckoutVerifyResponse {
  checkout_batch_id: string;
  payment_status: string;
  order_count: number;
  total_paid: string;
  orders: unknown[];
}

export function getOrCreateCheckoutIdempotencyKey(): string {
  let key = sessionStorage.getItem(CHECKOUT_IDEMPOTENCY_KEY);
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem(CHECKOUT_IDEMPOTENCY_KEY, key);
  }
  return key;
}

export function resetCheckoutIdempotencyKey(): void {
  sessionStorage.removeItem(CHECKOUT_IDEMPOTENCY_KEY);
}

export async function initiateCheckout(challanUuids: string[]): Promise<CheckoutInitiateResponse> {
  try {
    return await apiRequest<CheckoutInitiateResponse>("post", "/payments/checkout/initiate/", {
      challan_uuids: challanUuids,
      checkout_idempotency_key: getOrCreateCheckoutIdempotencyKey(),
    });
  } catch (err) {
    resetCheckoutIdempotencyKey();
    throw err;
  }
}

export async function verifyCheckout(
  checkoutBatchId: string,
  payment: RazorpaySuccessResponse,
): Promise<CheckoutVerifyResponse> {
  return apiRequest<CheckoutVerifyResponse>("post", "/payments/checkout/verify/", {
    checkout_batch_id: checkoutBatchId,
    razorpay_order_id: payment.razorpay_order_id,
    razorpay_payment_id: payment.razorpay_payment_id,
    razorpay_signature: payment.razorpay_signature,
  });
}

export async function runCheckoutPayment(challanUuids: string[]): Promise<CheckoutVerifyResponse> {
  const checkout = await initiateCheckout(challanUuids);
  
  let payment: RazorpaySuccessResponse;

  if (!checkout.razorpay_key_id || checkout.razorpay_order_id.startsWith("order_mock_")) {
    console.log("Mock Payment Fallback Active: Bypassing Razorpay Checkout SDK.");
    // Simulate a minor latency for a premium UI feel (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));
    payment = {
      razorpay_payment_id: "pay_mock_" + crypto.randomUUID().replace(/-/g, "").substring(0, 16),
      razorpay_order_id: checkout.razorpay_order_id,
      razorpay_signature: "sig_mock_" + crypto.randomUUID().replace(/-/g, "").substring(0, 16),
    };
  } else {
    payment = await openRazorpayCheckout({
      key: checkout.razorpay_key_id,
      amount: checkout.amount_paise,
      currency: checkout.currency,
      name: "DriveClear",
      description: checkout.description,
      order_id: checkout.razorpay_order_id,
      prefill: checkout.prefill,
      theme: { color: "#059669" },
    });
  }

  const result = await verifyCheckout(checkout.checkout_batch_id, payment);
  resetCheckoutIdempotencyKey();
  sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
  sessionStorage.removeItem("dc_last_fetch");
  sessionStorage.setItem(PAYMENT_RESULT_KEY, JSON.stringify(result));
  return result;
}
