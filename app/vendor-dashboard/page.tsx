import { VendorDashboard } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Dashboard · BELEFUL",
  description: "Track revenue, orders and your menu.",
};

export default function page() {
  return <VendorDashboard />;
}
