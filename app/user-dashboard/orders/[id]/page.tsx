import { OrderTrackingPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track order · BELEFUL",
};

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderTrackingPage orderId={id} />;
}
