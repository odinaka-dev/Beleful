"use client";

import Link from "next/link";
import { ArrowRight2, ReceiptItem } from "iconsax-reactjs";
import {
  CATEGORIES,
  VENDORS,
  FOODS,
  ACTIVE_ORDERS,
} from "@/helpers/student.helpers";
import {
  CategoryCard,
  VendorCard,
  FoodCard,
  ActiveOrderCard,
} from "@/components/student/cards";
import { EmptyState } from "@/components/ui/empty-state";

function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
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
  const recommended = FOODS.filter((f) => f.popular).concat(
    FOODS.filter((f) => !f.popular),
  );

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

      {/* Categories */}
      <section>
        <SectionHeader title="Categories" href="/student/explore" />
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-6 sm:gap-3 sm:overflow-visible">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Active orders */}
      {ACTIVE_ORDERS.length > 0 && (
        <section>
          <SectionHeader title="Active orders" href="/student/orders" />
          <div className="grid gap-4 sm:grid-cols-2">
            {ACTIVE_ORDERS.map((order) => (
              <ActiveOrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* Popular vendors */}
      <section>
        <SectionHeader title="Popular vendors" href="/student/explore" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {VENDORS.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* Recommended meals */}
      <section>
        <SectionHeader title="Recommended for you" href="/student/explore" />
        {recommended.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {recommended.map((food) => (
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
