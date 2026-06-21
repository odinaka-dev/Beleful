"use client";

import { formatNaira } from "@/helpers/student.helpers";
import { useCart } from "@/provider/cart-provider";

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={strong ? "font-bold text-[#111111]" : "text-[#666666]"}>
        {label}
      </span>
      <span
        className={
          strong ? "font-heading text-lg font-bold text-[#00452E]" : "font-semibold text-[#111111]"
        }
      >
        {value}
      </span>
    </div>
  );
}

/** Reusable payment/price breakdown used on cart and checkout. */
export function OrderSummary({ showLabels = true }: { showLabels?: boolean }) {
  const { subtotal, deliveryFee, serviceCharge, platformFee, total } = useCart();

  return (
    <div className="flex flex-col gap-3">
      {showLabels && (
        <h2 className="font-heading text-lg font-bold text-[#111111]">
          Payment summary
        </h2>
      )}
      <Row label="Food total" value={formatNaira(subtotal)} />
      <Row label="Delivery fee" value={formatNaira(deliveryFee)} />
      <Row label="Service charge" value={formatNaira(serviceCharge)} />
      <Row label="Platform fee" value={formatNaira(platformFee)} />
      <div className="my-1 h-px bg-[#00452E]/10" />
      <Row label="Total" value={formatNaira(total)} strong />
    </div>
  );
}
