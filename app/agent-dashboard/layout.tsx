import { ReactNode } from "react";
import { AgentShell } from "@/components/agent/agent-shell";

export default function AgentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AgentShell>{children}</AgentShell>;
}
