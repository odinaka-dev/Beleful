"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card as CardIcon, Wallet3, TickCircle } from "iconsax-reactjs";
import { FormField } from "@/components/form/form-field";
import { OrderSummary } from "@/components/student/order-summary";
import { PrimaryButton } from "@/components/ui/primary-button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNaira } from "@/helpers/student.helpers";
import { useCart } from "@/provider/cart-provider";
import { createClient } from "@/lib/supabase/client";
import { initiatePayment } from "@/lib/payments/paystack";
import { cn } from "@/lib/utils";
import { toaster } from "@/components/ui/toaster";

type PaymentMethod = "card" | "wallet";

/** Checkout: delivery info, payment summary, payment method, place order. */
export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [method, setMethod] = React.useState<PaymentMethod>("card");
  const [placing, setPlacing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [delivery, setDelivery] = React.useState({
    hostel: "",
    landmark: "",
  });

  if (items.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          title="Nothing to check out"
          description="Add items to your cart before checking out."
        />
      </div>
    );
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    setError(null);

    const vendorId = items[0].menuItem.vendorId;
    const supabase = createClient();

    // Prices are recomputed server-side inside create_order from the live
    // menu_items table — the client only supplies item ids/quantities, so a
    // tampered request can't under-price an order.
    const { data, error: orderError } = await supabase
      .rpc("create_order", {
        p_vendor_id: vendorId,
        p_hostel: delivery.hostel,
        p_landmark: delivery.landmark,
        p_items: items.map((i) => ({ menu_item_id: i.menuItem.id, quantity: i.qty })),
      })
      .single();

    if (orderError || !data) {
      const message = orderError?.message ?? "Could not place order.";
      setError(message);
      toaster.create({
        title: "Order failed",
        description: message,
        type: "error",
        duration: 4000,
        closable: true,
      });
      setPlacing(false);
      return;
    }

    const payment = await initiatePayment(data.id, data.total_amount);
    if (!payment.ok) {
      const message = payment.error ?? "Payment could not be processed.";
      setError(message);
      toaster.create({
        title: "Payment failed",
        description: message,
        type: "error",
        duration: 4000,
        closable: true,
      });
      setPlacing(false);
      return;
    }

    toaster.create({
      title: "Order placed!",
      description: "Payment confirmed — tracking your order now.",
      type: "success",
      duration: 3000,
      closable: true,
    });

    await clear();
    router.push(`/user-dashboard/orders/${data.id}`);
  }

  return (
    <form onSubmit={placeOrder}>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[#111111]">
        Checkout
      </h1>

      {error && (
        <p className="mb-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-6">
          {/* Delivery information */}
          <section className="rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
              Delivery information
            </h2>
            <div className="flex flex-col gap-4">
              <FormField
                label="Hostel / Residence"
                placeholder="Enter your delivery location"
                required
                value={delivery.hostel}
                onChange={(e) =>
                  setDelivery({ ...delivery, hostel: e.target.value })
                }
                minLength={2}
                maxLength={160}
              />
              <FormField
                label="Building / Room / Landmark"
                placeholder="Block C, Room 214, near the main gate"
                optional
                value={delivery.landmark}
                onChange={(e) =>
                  setDelivery({ ...delivery, landmark: e.target.value })
                }
                maxLength={240}
              />
            </div>
          </section>

          {/* Payment method */}
          <section className="rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
              Payment method
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: "card", label: "Card", desc: "Pay with debit card", icon: CardIcon },
                  { id: "wallet", label: "Wallet", desc: "BELEFUL balance", icon: Wallet3 },
                ] as const
              ).map((opt) => {
                const Icon = opt.icon;
                const selected = method === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setMethod(opt.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                      selected
                        ? "border-[#00452E] bg-[#00452E]/[0.04]"
                        : "border-[#00452E]/12 hover:border-[#00452E]/30",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-2xl",
                        selected
                          ? "bg-[#00452E] text-white"
                          : "bg-[#00452E]/8 text-[#00452E]",
                      )}
                    >
                      <Icon size={22} variant="TwoTone" />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#111111]">{opt.label}</p>
                      <p className="text-xs text-[#666666]">{opt.desc}</p>
                    </div>
                    {selected && (
                      <TickCircle size={20} variant="Bold" color="#00452E" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Summary + place order */}
        <div className="rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <OrderSummary />
          <PrimaryButton type="submit" loading={placing} className="mt-6">
            Place order · {formatNaira(total)}
          </PrimaryButton>
          <p className="mt-3 text-center text-xs text-[#666666]">
            By placing this order you agree to BELEFUL&apos;s terms.
          </p>
        </div>
      </div>
    </form>
  );
}
