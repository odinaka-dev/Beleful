"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star1, Clock, MoneyRecive, ShoppingCart } from "iconsax-reactjs";
import { FoodImage } from "@/components/student/food-image";
import { FoodCard } from "@/components/student/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  type Vendor,
  type Food,
  type RawVendorRow,
  type RawFoodRow,
  VENDOR_COLUMNS,
  FOOD_COLUMNS,
  toVendor,
  toFood,
  formatNaira,
  PLACEHOLDER_GRADIENT,
} from "@/helpers/student.helpers";
import { useCart } from "@/provider/cart-provider";
import { createClient } from "@/lib/supabase/client";
import { toaster } from "@/components/ui/toaster";

/** Vendor store: banner, logo, rating, menu categories, food grid, cart bar. */
export default function VendorStorePage({ vendorId }: { vendorId: string }) {
  const [vendor, setVendor] = React.useState<Vendor | null>(null);
  const [menu, setMenu] = React.useState<Food[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [missing, setMissing] = React.useState(false);
  const [active, setActive] = React.useState<string>("All");
  const { count, total } = useCart();

  React.useEffect(() => {
    let isActive = true;
    (async () => {
      const supabase = createClient();
      const { data: vendorRow, error: vendorError } = await supabase
        .from("vendors")
        .select(VENDOR_COLUMNS)
        .eq("id", vendorId)
        .single();

      if (!isActive) return;
      if (vendorError || !vendorRow) {
        setMissing(true);
        setLoading(false);
        return;
      }
      setVendor(toVendor(vendorRow as unknown as RawVendorRow));

      const { data: menuRows, error: menuError } = await supabase
        .from("menu_items")
        .select(FOOD_COLUMNS)
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });

      if (!isActive) return;
      if (menuError) {
        toaster.create({ title: "Couldn't load the menu", description: "We couldn't fetch this vendor's dishes. Please try again.", type: "error", duration: 4000, closable: true });
      } else {
        setMenu(((menuRows ?? []) as unknown as RawFoodRow[]).map(toFood));
      }
      setLoading(false);
    })();
    return () => {
      isActive = false;
    };
  }, [vendorId]);

  if (missing) notFound();

  if (loading || !vendor) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-40 animate-pulse rounded-3xl bg-[#00452E]/5 sm:h-52" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-[#00452E]/5" />
          ))}
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(menu.map((f) => f.category)));
  const visible = active === "All" ? menu : menu.filter((f) => f.category === active);

  return (
    <div className="flex flex-col gap-6">
      {/* Banner + logo */}
      <section className="overflow-hidden rounded-3xl border border-[#00452E]/10 bg-white shadow-sm">
        {vendor.bannerImage ? (
          <img
            src={vendor.bannerImage}
            alt={vendor.name}
            className="h-40 w-full object-cover sm:h-52"
          />
        ) : (
          <FoodImage
            emoji="🍽️"
            gradient={PLACEHOLDER_GRADIENT}
            size="lg"
            className="h-40 w-full sm:h-52"
          />
        )}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.name}
                className="-mt-12 h-20 w-20 flex-shrink-0 rounded-3xl border-4 border-white object-cover shadow-md sm:-mt-16"
              />
            ) : (
              <span className="-mt-12 grid h-20 w-20 flex-shrink-0 place-items-center rounded-3xl border-4 border-white bg-white text-4xl shadow-md sm:-mt-16">
                🍽️
              </span>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-bold text-[#111111] sm:text-2xl">
                  {vendor.name}
                </h1>
                <StatusBadge tone={vendor.isOpen ? "success" : "neutral"} dot>
                  {vendor.isOpen ? "Open" : "Closed"}
                </StatusBadge>
              </div>
              {vendor.tags.length > 0 && (
                <p className="mt-1 text-sm text-[#666666]">{vendor.tags.join(" · ")}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-2xl bg-[#FCD882]/30 px-3 py-2 text-sm font-semibold text-[#111111]">
              <Star1 size={16} variant="Bold" color="#D97706" />
              {vendor.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1.5 rounded-2xl bg-[#00452E]/5 px-3 py-2 text-sm font-semibold text-[#00452E]">
              <Clock size={16} variant="TwoTone" />
              Campus delivery
            </span>
            <span className="flex items-center gap-1.5 rounded-2xl bg-[#00452E]/5 px-3 py-2 text-sm font-semibold text-[#00452E]">
              <MoneyRecive size={16} variant="TwoTone" />
              {formatNaira(vendor.deliveryFee)}
            </span>
          </div>
        </div>
      </section>

      {/* Menu category tabs */}
      {categories.length > 0 && (
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
      )}

      {/* Food grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visible.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No items yet"
          description="This vendor hasn't added any menu items yet."
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
