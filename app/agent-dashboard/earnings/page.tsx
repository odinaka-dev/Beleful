import { AgentEarnings } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings · BELEFUL",
};

export default function page() {
  return <AgentEarnings />;
}
