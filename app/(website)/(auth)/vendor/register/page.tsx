import { VendorRegisterPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register your business · BELEFUL",
  description: "List your kitchen on BELEFUL and reach the whole campus.",
};

export default function page() {
  return <VendorRegisterPage />;
}
