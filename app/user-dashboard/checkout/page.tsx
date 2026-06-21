import { CheckoutPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout · BELEFUL",
};

export default function page() {
  return <CheckoutPage />;
}
