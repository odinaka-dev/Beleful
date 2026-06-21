"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card as CardIcon, Wallet3, TickCircle } from "iconsax-reactjs";
import { FormField } from "@/components/form/form-field";
import { SelectField } from "@/components/form/select-field";
import { OrderSummary } from "@/components/student/order-summary";
import { PrimaryButton } from "@/components/ui/primary-button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNaira } from "@/helpers/student.helpers";
import { HOSTELS } from "@/helpers/auth.helpers";
import { useCart } from "@/provider/cart-provider";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "wallet";

/** Checkout: delivery info, payment summary, payment method, place order. */
export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [method, setMethod] = React.useState<PaymentMethod>("card");
  const [placing, setPlacing] = React.useState(false);
  const [delivery, setDelivery] = React.useState({
    hostel: "",
    building: "",
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

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    // Mock order placement → route to tracking for the seeded active order.
    setTimeout(() => {
      clear();
      router.push("/user-dashboard/orders/BF-10293");
    }, 1100);
  }

  return (
    <form onSubmit={placeOrder}>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[#111111]">
        Checkout
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-6">
          {/* Delivery information */}
          <section className="rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
              Delivery information
            </h2>
            <div className="flex flex-col gap-4">
              <SelectField
                label="Hostel / Residence"
                options={HOSTELS}
                placeholder="Select your hostel"
                required
                value={delivery.hostel}
                onChange={(e) =>
                  setDelivery({ ...delivery, hostel: e.target.value })
                }
              />
              <FormField
                label="Building / Room"
                placeholder="Block C, Room 214"
                required
                value={delivery.building}
                onChange={(e) =>
                  setDelivery({ ...delivery, building: e.target.value })
                }
              />
              <FormField
                label="Landmark"
                placeholder="Near the main gate"
                optional
                value={delivery.landmark}
                onChange={(e) =>
                  setDelivery({ ...delivery, landmark: e.target.value })
                }
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
