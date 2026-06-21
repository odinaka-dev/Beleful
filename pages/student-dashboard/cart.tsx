"use client";

import Link from "next/link";
import { Add, Minus, Trash, ShoppingCart } from "iconsax-reactjs";
import { FoodImage } from "@/components/student/food-image";
import { OrderSummary } from "@/components/student/order-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { PrimaryButton } from "@/components/ui/primary-button";
import { formatNaira } from "@/helpers/student.helpers";
import { useCart } from "@/provider/cart-provider";

/** Cart page: line items, quantity controls, totals, checkout CTA. */
export default function CartPage() {
  const { items, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-10">
        <h1 className="mb-6 font-heading text-2xl font-bold text-[#111111]">
          Your cart
        </h1>
        <EmptyState
          icon={<ShoppingCart size={30} variant="TwoTone" />}
          title="Your cart is empty"
          description="Browse vendors and add some meals to get started."
          action={
            <Link href="/student">
              <PrimaryButton fullWidth={false}>Explore vendors</PrimaryButton>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[#111111]">
        Your cart
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Line items */}
        <div className="flex flex-col gap-4">
          {items.map(({ food, qty }) => (
            <div
              key={food.id}
              className="flex items-center gap-4 rounded-3xl border border-[#00452E]/10 bg-white p-3 shadow-sm sm:p-4"
            >
              <FoodImage
                emoji={food.emoji}
                gradient={food.gradient}
                size="sm"
                className="h-20 w-20 flex-shrink-0 rounded-2xl"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-heading font-bold text-[#111111]">
                  {food.name}
                </h3>
                <p className="text-xs text-[#666666]">{food.vendorName}</p>
                <p className="mt-1 font-heading font-bold text-[#00452E]">
                  {formatNaira(food.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => remove(food.id)}
                  aria-label={`Remove ${food.name}`}
                  className="text-[#666666] transition-colors hover:text-[#DC2626]"
                >
                  <Trash size={18} variant="TwoTone" />
                </button>
                <div className="flex items-center gap-2 rounded-full bg-[#00452E]/5 p-1">
                  <button
                    onClick={() => setQty(food.id, qty - 1)}
                    aria-label="Decrease quantity"
                    className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#00452E] shadow-sm transition-transform active:scale-90"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-[#111111]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(food.id, qty + 1)}
                    aria-label="Increase quantity"
                    className="grid h-7 w-7 place-items-center rounded-full bg-[#00452E] text-white shadow-sm transition-transform active:scale-90"
                  >
                    <Add size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <OrderSummary />
          <Link href="/student/checkout" className="mt-6 block">
            <PrimaryButton>Proceed to checkout</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
