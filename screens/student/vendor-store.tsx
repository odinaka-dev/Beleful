"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star1, Clock, MoneyRecive, ShoppingCart } from "iconsax-reactjs";
import { FoodImage } from "@/components/student/food-image";
import { FoodCard } from "@/components/student/cards";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { VENDORS, FOODS, formatNaira } from "@/helpers/student.helpers";
import { useCart } from "@/provider/cart-provider";

/** Vendor store: banner, logo, rating, menu categories, food grid, cart bar. */
export default function VendorStorePage({ vendorId }: { vendorId: string }) {
  const vendor = VENDORS.find((v) => v.id === vendorId);
  const menu = FOODS.filter((f) => f.vendorId === vendorId);
  const { count, total } = useCart();

  if (!vendor) notFound();

  const categories = Array.from(new Set(menu.map((f) => f.category)));
  const [active, setActive] = React.useState<string>("All");

  const visible =
    active === "All" ? menu : menu.filter((f) => f.category === active);

  return (
    <div className="flex flex-col gap-6">
      {/* Banner + logo */}
      <section className="overflow-hidden rounded-3xl border border-[#00452E]/10 bg-white shadow-sm">
        <FoodImage
          emoji={vendor.emoji}
          gradient={vendor.gradient}
          size="lg"
          className="h-40 w-full sm:h-52"
        />
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <span className="-mt-12 grid h-20 w-20 flex-shrink-0 place-items-center rounded-3xl border-4 border-white bg-white text-4xl shadow-md sm:-mt-16">
              {vendor.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-bold text-[#111111] sm:text-2xl">
                  {vendor.name}
                </h1>
                <StatusBadge tone={vendor.isOpen ? "success" : "neutral"} dot>
                  {vendor.isOpen ? "Open" : "Closed"}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-[#666666]">
                {vendor.tags.join(" · ")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-2xl bg-[#FCD882]/30 px-3 py-2 text-sm font-semibold text-[#111111]">
              <Star1 size={16} variant="Bold" color="#D97706" />
              {vendor.rating}{" "}
              <span className="font-normal text-[#666666]">
                ({vendor.reviews})
              </span>
            </span>
            <span className="flex items-center gap-1.5 rounded-2xl bg-[#00452E]/5 px-3 py-2 text-sm font-semibold text-[#00452E]">
              <Clock size={16} variant="TwoTone" />
              {vendor.deliveryTime}
            </span>
            <span className="flex items-center gap-1.5 rounded-2xl bg-[#00452E]/5 px-3 py-2 text-sm font-semibold text-[#00452E]">
              <MoneyRecive size={16} variant="TwoTone" />
              {formatNaira(vendor.deliveryFee)}
            </span>
          </div>
        </div>
      </section>

      {/* Menu category tabs */}
      <div className="sticky top-[68px] z-30 -mx-4 flex gap-2 overflow-x-auto bg-[#FAFAF5]/90 px-4 py-2 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={
              "flex-shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors " +
              (active === cat
                ? "bg-[#00452E] text-white"
                : "bg-white text-[#666666] hover:text-[#00452E]")
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visible.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No items in this category"
          description="Try another category from this vendor."
        />
      )}

      {/* Sticky cart summary */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-[72px] z-40 px-4 lg:bottom-6">
          <Link
            href="/user-dashboard/cart"
            className="mx-auto flex max-w-[1200px] items-center justify-between rounded-2xl bg-[#00452E] px-5 py-4 text-white shadow-[0_12px_30px_rgba(0,69,46,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-3 font-semibold">
              <ShoppingCart size={20} variant="Bold" />
              {count} {count === 1 ? "item" : "items"} in cart
            </span>
            <span className="flex items-center gap-2 font-heading font-bold">
              {formatNaira(total)} · View cart
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
