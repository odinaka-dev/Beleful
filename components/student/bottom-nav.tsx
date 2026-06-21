"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home2,
  SearchNormal1,
  ReceiptItem,
  Profile,
} from "iconsax-reactjs";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/student", label: "Home", icon: Home2, match: (p: string) => p === "/student" },
  { href: "/student/explore", label: "Explore", icon: SearchNormal1, match: (p: string) => p.startsWith("/student/explore") || p.startsWith("/student/store") },
  { href: "/student/orders", label: "Orders", icon: ReceiptItem, match: (p: string) => p.startsWith("/student/orders") },
  { href: "/student/profile", label: "Profile", icon: Profile, match: (p: string) => p.startsWith("/student/profile") },
];

/** Mobile-only bottom tab bar for the student app. */
export function StudentBottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#00452E]/10 bg-white/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-semibold transition-colors",
                active ? "text-[#00452E]" : "text-[#9CA3AF]",
              )}
            >
              <Icon size={22} variant={active ? "Bold" : "TwoTone"} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
