"use client";

import { Element3, Reserve, Wallet3, Setting2 } from "iconsax-reactjs";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import { VENDOR_PROFILE } from "@/helpers/vendor.helpers";

const NAV: DashboardNavItem[] = [
  { label: "Dashboard", href: "/vendor-dashboard", icon: Element3 },
  { label: "Menu", href: "/vendor-dashboard/menu", icon: Reserve },
  { label: "Wallet", href: "/vendor-dashboard/wallet", icon: Wallet3 },
  { label: "Settings", href: "/vendor-dashboard/settings", icon: Setting2 },
];

export function VendorShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={NAV}
      brandHref="/vendor-dashboard"
      logoutHref="/vendor/login"
      user={{ name: VENDOR_PROFILE.businessName, role: "Food Vendor" }}
    >
      {children}
    </DashboardShell>
  );
}
