import { VendorMenu } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu · BELEFUL",
};

export default function page() {
  return <VendorMenu />;
}
