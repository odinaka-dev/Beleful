import { Suspense } from "react";
import { ExplorePage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore · BELEFUL",
  description: "Browse and search campus vendors and meals.",
};

export default function page() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-[#00452E]/5" />}>
      <ExplorePage />
    </Suspense>
  );
}
