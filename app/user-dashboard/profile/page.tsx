import { ProfilePage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile · BELEFUL",
};

export default function page() {
  return <ProfilePage />;
}
