import { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireRole } from "@/lib/auth/require-role";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("ADMIN", "/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
