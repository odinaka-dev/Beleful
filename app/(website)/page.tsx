import { Homepage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeleFul App",
  description: "Welcome to Bele filled Satisfaction",
};

export default function page() {
  return (
    <div>
      <Homepage />
    </div>
  );
}
