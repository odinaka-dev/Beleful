import { ReactNode } from "react";
import { StudentAppShell } from "@/components/student/student-app-shell";
import { requireRole } from "@/lib/auth/require-role";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await requireRole("USER", "/login");
  return <StudentAppShell>{children}</StudentAppShell>;
}
