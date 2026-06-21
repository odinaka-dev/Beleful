import { createClient } from "@/lib/supabase/client";

export interface InitiatePaymentResult {
  ok: boolean;
  error?: string;
}

/**
 * Payment seam for checkout — swap this implementation for real Paystack
 * once the edge function + webhook are wired up. See
 * docs/PAYSTACK_INTEGRATION.md for the full plan.
 *
 * Today: records the transaction as already completed, no real payment is
 * taken. This lets order creation, tracking, and vendor acceptance be built
 * and tested ahead of the payment integration landing.
 */
export async function initiatePayment(
  orderId: string,
  amount: number,
): Promise<InitiatePaymentResult> {
  const supabase = createClient();
  const { error } = await supabase.from("transactions").insert({
    order_id: orderId,
    amount,
    transaction_type: "payment",
    status: "completed",
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
