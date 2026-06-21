import { VendorStorePage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor store · BELEFUL",
};

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VendorStorePage vendorId={id} />;
}
