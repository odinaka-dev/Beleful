import { ReactNode } from "react";
import { VendorShell } from "@/components/vendor/vendor-shell";

export default function VendorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <VendorShell>{children}</VendorShell>;
}
