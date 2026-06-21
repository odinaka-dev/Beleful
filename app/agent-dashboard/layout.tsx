import { ReactNode } from "react";
import { AgentShell } from "@/components/agent/agent-shell";
import { requireRole } from "@/lib/auth/require-role";

export default async function AgentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("DELIVERY_AGENT", "/agent/login");
  return <AgentShell>{children}</AgentShell>;
}
