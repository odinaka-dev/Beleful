import { ReactNode } from "react";
import { VendorShell } from "@/components/vendor/vendor-shell";
import { requireRole } from "@/lib/auth/require-role";

export default async function VendorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("VENDOR", "/vendor/login");
  return <VendorShell>{children}</VendorShell>;
}
