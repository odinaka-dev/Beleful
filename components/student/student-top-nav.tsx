"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SearchNormal1,
  Location,
  ShoppingCart,
  ArrowLeft2,
  ArrowDown2,
} from "iconsax-reactjs";
import { BelefulImages } from "@/constant/image";
import { useCart } from "@/provider/cart-provider";

const CAMPUSES = ["University of Lagos", "University of Ibadan", "Covenant University"];

/** Sticky top navigation for the student app: brand, campus, search, cart. */
export function StudentTopNav() {
  const { count } = useCart();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [campus, setCampus] = React.useState(CAMPUSES[0]);

  const isDashboard = pathname === "/user-dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-[#00452E]/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        {/* Back button on inner pages (mobile), logo otherwise */}
        {isDashboard ? (
          <Link href="/user-dashboard" className="flex-shrink-0">
            <Image src={BelefulImages.logoImage} alt="BELEFUL" className="w-24 sm:w-28" />
          </Link>
        ) : (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-[#00452E]/5 text-[#00452E] transition-colors hover:bg-[#00452E]/10 lg:hidden"
          >
            <ArrowLeft2 size={20} />
          </button>
        )}

        <Link href="/user-dashboard" className={isDashboard ? "hidden" : "hidden flex-shrink-0 lg:block"}>
          <Image src={BelefulImages.logoImage} alt="BELEFUL" className="w-28" />
        </Link>

        {/* Campus selector */}
        <div className="relative hidden flex-shrink-0 sm:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#00452E]">
            <Location size={18} variant="TwoTone" />
          </span>
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="h-11 appearance-none rounded-2xl bg-[#00452E]/5 pl-9 pr-9 text-sm font-semibold text-[#00452E] outline-none"
          >
            {CAMPUSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ArrowDown2
            size={16}
            color="#00452E"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-[#00452E]/10 bg-[#00452E]/[0.03] px-3 focus-within:border-[#00452E]/30">
          <SearchNormal1 size={18} color="#666666" />
          <input
            type="search"
            placeholder="Search food, vendors..."
            className="h-11 w-full min-w-0 bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Cart */}
        <Link
          href="/user-dashboard/cart"
          aria-label="View cart"
          className="relative grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-[#00452E] text-white transition-transform hover:-translate-y-0.5"
        >
          <ShoppingCart size={20} variant="Bold" />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#FCD882] px-1 text-xs font-bold text-[#00452E]">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
