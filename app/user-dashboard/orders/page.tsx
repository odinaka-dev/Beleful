import { OrdersPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your orders · BELEFUL",
};

export default function page() {
  return <OrdersPage />;
}
