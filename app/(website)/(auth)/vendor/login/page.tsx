import { VendorLoginPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor sign in · BELEFUL",
  description: "Sign in to manage your BELEFUL store, menu and orders.",
};

export default function page() {
  return <VendorLoginPage />;
}
