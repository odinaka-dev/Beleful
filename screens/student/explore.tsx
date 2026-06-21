"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchNormal1 } from "iconsax-reactjs";
import { VendorCard, FoodCard } from "@/components/student/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaCardSkeleton } from "@/components/ui/skeletons";
import {
  type Category,
  type Vendor,
  type Food,
  type RawVendorRow,
  type RawFoodRow,
  VENDOR_COLUMNS,
  FOOD_COLUMNS,
  toVendor,
  toFood,
} from "@/helpers/student.helpers";
import { createClient } from "@/lib/supabase/client";

/** Browse + search every vendor and menu item, filterable by category. */
export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const [categoryId, setCategoryId] = React.useState(searchParams.get("category") ?? "all");

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const [catRes, vendorRes, foodRes] = await Promise.all([
        supabase.from("food_categories").select("id, name, image").order("name"),
        supabase.from("vendors").select(VENDOR_COLUMNS).order("rating", { ascending: false }),
        supabase.from("menu_items").select(FOOD_COLUMNS).eq("available", true).order("name"),
      ]);

      if (!active) return;
      setCategories(catRes.data ?? []);
      setVendors(((vendorRes.data ?? []) as unknown as RawVendorRow[]).map(toVendor));
      setFoods(((foodRes.data ?? []) as unknown as RawFoodRow[]).map(toFood));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  function updateParams(next: { q?: string; category?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.category !== undefined) {
      if (next.category && next.category !== "all") params.set("category", next.category);
      else params.delete("category");
    }
    router.replace(`/user-dashboard/explore?${params.toString()}`, { scroll: false });
  }

  function handleSearch(value: string) {
    setQuery(value);
    updateParams({ q: value });
  }

  function handleCategory(id: string) {
    setCategoryId(id);
    updateParams({ category: id });
  }

  const selectedCategoryName =
    categoryId === "all" ? null : categories.find((c) => c.id === categoryId)?.name ?? null;

  const lowerQuery = query.trim().toLowerCase();
  const filteredVendors = vendors.filter((v) =>
    lowerQuery ? v.name.toLowerCase().includes(lowerQuery) : true,
  );
  const filteredFoods = foods.filter((f) => {
    const matchesQuery = lowerQuery ? f.name.toLowerCase().includes(lowerQuery) : true;
    const matchesCategory = selectedCategoryName ? f.category === selectedCategoryName : true;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-4 font-heading text-2xl font-bold text-[#111111]">Explore</h1>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-2xl border border-[#00452E]/10 bg-white px-3 shadow-sm">
          <SearchNormal1 size={18} color="#666666" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search food, vendors..."
            className="h-12 w-full min-w-0 bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Category chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[{ id: "all", name: "All" }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={
                "flex-shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors " +
                (categoryId === cat.id
                  ? "bg-[#00452E] text-white"
                  : "bg-white text-[#666666] shadow-sm hover:text-[#00452E]")
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors */}
      <section>
        <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">Vendors</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <EmptyState title="No vendors found" description="Try a different search." />
        )}
      </section>

      {/* Foods */}
      <section>
        <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">Foods</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <MediaCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <EmptyState title="No items found" description="Try a different search or category." />
        )}
      </section>
    </div>
  );
}
