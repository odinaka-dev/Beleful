"use client";

import Link from "next/link";
import { Star1, Clock, Add } from "iconsax-reactjs";
import { FoodImage } from "./food-image";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  type Vendor,
  type Food,
  type Category,
  type ActiveOrder,
  type OrderStatus,
  formatNaira,
  ORDER_STEPS,
} from "@/helpers/student.helpers";
import { useCart } from "@/provider/cart-provider";

/** Category pill card used in the dashboard category strip. */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/user-dashboard/explore?category=${category.id}`}
      className="group flex flex-col items-center gap-2"
    >
      <span
        className="grid h-16 w-16 place-items-center rounded-3xl text-3xl shadow-sm transition-transform group-hover:-translate-y-1 sm:h-20 sm:w-20"
        style={{ backgroundColor: category.color }}
      >
        {category.emoji}
      </span>
      <span className="text-xs font-semibold text-[#111111] sm:text-sm">
        {category.name}
      </span>
    </Link>
  );
}

/** Vendor card for the popular-vendors carousel/grid. */
export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/user-dashboard/store/${vendor.id}`}
      className="group block overflow-hidden rounded-3xl border border-[#00452E]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
    >
      <div className="relative">
        <FoodImage
          emoji={vendor.emoji}
          gradient={vendor.gradient}
          className="h-32 w-full"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge tone={vendor.isOpen ? "success" : "neutral"} dot>
            {vendor.isOpen ? "Open" : "Closed"}
          </StatusBadge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-[#111111]">{vendor.name}</h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-[#666666]">
          <span className="flex items-center gap-1 font-semibold text-[#111111]">
            <Star1 size={14} variant="Bold" color="#FCD882" />
            {vendor.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} variant="TwoTone" />
            {vendor.deliveryTime}
          </span>
          <span>{formatNaira(vendor.deliveryFee)} fee</span>
        </div>
      </div>
    </Link>
  );
}

/** Food card with an add-to-cart action. */
export function FoodCard({ food }: { food: Food }) {
  const { add } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-[#00452E]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]">
      <Link href={`/user-dashboard/store/${food.vendorId}`} className="relative block">
        <FoodImage emoji={food.emoji} gradient={food.gradient} className="h-32 w-full" />
        {food.popular && (
          <span className="absolute left-3 top-3">
            <StatusBadge tone="pending">🔥 Popular</StatusBadge>
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-sm font-bold text-[#111111]">{food.name}</h3>
        <p className="mt-1 text-xs text-[#666666]">{food.vendorName}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-heading font-bold text-[#00452E]">
            {formatNaira(food.price)}
          </span>
          <button
            onClick={() => add(food)}
            aria-label={`Add ${food.name} to cart`}
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#00452E] text-white transition-all hover:bg-[#016644] active:scale-90"
          >
            <Add size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_TONE: Record<OrderStatus, "info" | "pending" | "success"> = {
  placed: "info",
  accepted: "info",
  preparing: "pending",
  ready: "pending",
  assigned: "pending",
  picked_up: "pending",
  delivered: "success",
};

/** Compact active-order card for the dashboard. */
export function ActiveOrderCard({ order }: { order: ActiveOrder }) {
  const stepLabel =
    ORDER_STEPS.find((s) => s.status === order.status)?.label ?? "In progress";

  return (
    <Link
      href={`/user-dashboard/orders/${order.id}`}
      className="block rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#666666]">
          Order #{order.id}
        </span>
        <StatusBadge tone={STATUS_TONE[order.status]} dot>
          {stepLabel}
        </StatusBadge>
      </div>
      <h3 className="mt-2 font-heading font-bold text-[#111111]">
        {order.vendorName}
      </h3>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#00452E]/[0.03] p-3">
        <div>
          <p className="text-xs text-[#666666]">Delivery agent</p>
          <p className="text-sm font-semibold text-[#111111]">{order.agentName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#666666]">Arriving in</p>
          <p className="text-sm font-bold text-[#00452E]">{order.eta}</p>
        </div>
      </div>
    </Link>
  );
}
