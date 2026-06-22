import { AdminDashboard } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · BELEFUL",
  robots: { index: false, follow: false },
};

export default function page() {
  return <AdminDashboard />;
}
