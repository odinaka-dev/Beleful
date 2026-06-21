import { AgentLoginPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent sign in · BELEFUL",
  description: "Sign in to pick up deliveries and track your earnings.",
};

export default function page() {
  return <AgentLoginPage />;
}
