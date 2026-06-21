"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight2, ReceiptItem } from "iconsax-reactjs";
import {
  CategoryCard,
  VendorCard,
  FoodCard,
  ActiveOrderCard,
} from "@/components/student/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaCardSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type Category,
  type Vendor,
  type Food,
  type ActiveOrder,
  type RawVendorRow,
  type RawFoodRow,
  type RawOrderRow,
  VENDOR_COLUMNS,
  FOOD_COLUMNS,
  ACTIVE_ORDER_COLUMNS,
  toVendor,
  toFood,
  toActiveOrder,
} from "@/helpers/student.helpers";
import { createClient } from "@/lib/supabase/client";

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-heading text-lg font-bold text-[#111111] sm:text-xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-[#00452E] hover:underline"
        >
          See all <ArrowRight2 size={16} />
        </Link>
      )}
    </div>
  );
}

/** Student dashboard — categories, vendors, recommended meals, active orders. */
export default function StudentDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [activeOrders, setActiveOrders] = React.useState<ActiveOrder[]>([]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const [catRes, vendorRes, foodRes, orderRes] = await Promise.all([
        supabase.from("food_categories").select("id, name, image").order("name"),
        supabase
          .from("vendors")
          .select(VENDOR_COLUMNS)
          .order("rating", { ascending: false })
          .limit(8),
        supabase
          .from("menu_items")
          .select(FOOD_COLUMNS)
          .eq("available", true)
          .order("created_at", { ascending: false })
          .limit(8),
        userId
          ? supabase
              .from("orders")
              .select(ACTIVE_ORDER_COLUMNS)
              .eq("user_id", userId)
              .in("status", ["pending", "preparing", "ready"])
              .order("created_at", { ascending: false })
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (!active) return;

      const firstError = catRes.error ?? vendorRes.error ?? foodRes.error ?? orderRes.error;
      if (firstError) setError(firstError.message);

      setCategories(catRes.data ?? []);
      setVendors(((vendorRes.data ?? []) as unknown as RawVendorRow[]).map(toVendor));
      setFoods(((foodRes.data ?? []) as unknown as RawFoodRow[]).map(toFood));
      setActiveOrders(((orderRes.data ?? []) as unknown as RawOrderRow[]).map(toActiveOrder));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome / hero */}
      <section className="overflow-hidden rounded-3xl bg-[#00452E] p-6 text-white sm:p-8">
        <p className="text-sm font-medium text-white/70">Welcome back 👋</p>
        <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
          What are you craving today?
        </h1>
        <p className="mt-2 max-w-md text-sm text-white/70">
          Order from your favourite campus vendors and track every delivery to
          your hostel door.
        </p>
      </section>

      {error && (
        <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {/* Categories */}
      <section>
        <SectionHeader title="Categories" href="/user-dashboard/explore" />
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 flex-shrink-0 rounded-3xl sm:h-20 sm:w-20" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-6 sm:gap-3 sm:overflow-visible">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Active orders */}
      {!loading && activeOrders.length > 0 && (
        <section>
          <SectionHeader title="Active orders" href="/user-dashboard/orders" />
          <div className="grid gap-4 sm:grid-cols-2">
            {activeOrders.map((order) => (
              <ActiveOrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* Popular vendors */}
      <section>
        <SectionHeader title="Popular vendors" href="/user-dashboard/explore" />
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <EmptyState title="No vendors yet" description="Check back soon." />
        )}
      </section>

      {/* Recommended meals */}
      <section>
        <SectionHeader title="Recommended for you" href="/user-dashboard/explore" />
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        ) : foods.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ReceiptItem size={28} variant="TwoTone" />}
            title="No meals yet"
            description="Check back soon for recommendations tailored to your taste."
          />
        )}
      </section>
    </div>
  );
}
