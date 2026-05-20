declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
    };
  }
}

export interface RazorpayErrorResponse {
  error: {
    description: string;
    reason?: string;
    code?: string;
  };
}

export interface RazorpayCheckoutParams {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { contact?: string; name?: string; email?: string };
  theme?: { color: string };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions extends RazorpayCheckoutParams {
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    if (document.getElementById("razorpay-script")) {
      const wait = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(wait);
          resolve();
        }
      }, 50);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

/** Opens Razorpay modal; resolves with payment details or rejects on failure/cancel. */
export async function openRazorpayCheckout(
  params: RazorpayCheckoutParams,
): Promise<RazorpaySuccessResponse> {
  await loadRazorpayScript();
  return new Promise((resolve, reject) => {
    const options: RazorpayOptions = {
      ...params,
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      reject(new Error(response?.error?.description || "Payment failed"));
    });
    rzp.open();
  });
}
