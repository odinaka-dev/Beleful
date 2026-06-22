import { AdminLoginPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin sign in · BELEFUL",
  robots: { index: false, follow: false },
};

export default function page() {
  return <AdminLoginPage />;
}
