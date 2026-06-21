import { VendorSettings } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings · BELEFUL",
};

export default function page() {
  return <VendorSettings />;
}
