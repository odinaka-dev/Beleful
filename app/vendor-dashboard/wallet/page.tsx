import { VendorWallet } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet · BELEFUL",
};

export default function page() {
  return <VendorWallet />;
}
