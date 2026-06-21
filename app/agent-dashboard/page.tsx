import { AgentDashboard } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Dashboard · BELEFUL",
  description: "Manage your deliveries and earnings.",
};

export default function page() {
  return <AgentDashboard />;
}
