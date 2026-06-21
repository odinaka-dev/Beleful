import { AgentRegisterPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a delivery agent · BELEFUL",
  description: "Deliver food across campus and earn on your schedule.",
};

export default function page() {
  return <AgentRegisterPage />;
}
