import { CartPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your cart · BELEFUL",
};

export default function page() {
  return <CartPage />;
}
