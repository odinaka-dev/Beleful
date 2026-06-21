"use client";

import { Element3, Wallet3, Profile } from "iconsax-reactjs";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import { AGENT_PROFILE } from "@/helpers/agent.helpers";

const NAV: DashboardNavItem[] = [
  { label: "Dashboard", href: "/agent-dashboard", icon: Element3 },
  { label: "Earnings", href: "/agent-dashboard/earnings", icon: Wallet3 },
  { label: "Profile", href: "/agent-dashboard/profile", icon: Profile },
];

export function AgentShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={NAV}
      brandHref="/agent-dashboard"
      logoutHref="/agent/login"
      user={{ name: AGENT_PROFILE.name, role: "Delivery Agent" }}
    >
      {children}
    </DashboardShell>
  );
}
