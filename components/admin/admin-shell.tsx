"use client";

import * as React from "react";
import { ShieldTick } from "iconsax-reactjs";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/client";

const NAV: DashboardNavItem[] = [
  { label: "Agent approvals", href: "/admin-dashboard", icon: ShieldTick },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [name, setName] = React.useState("Admin");

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userData.user.id)
        .single();

      if (active && profile?.full_name) setName(profile.full_name);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardShell
      navItems={NAV}
      brandHref="/admin-dashboard"
      logoutHref="/admin/login"
      user={{ name, role: "Admin" }}
    >
      {children}
    </DashboardShell>
  );
}
