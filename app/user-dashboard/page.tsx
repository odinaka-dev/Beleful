import { StudentDashboard } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard · BELEFUL",
  description: "Order food from your favourite campus vendors.",
};

export default function page() {
  return <StudentDashboard />;
}
