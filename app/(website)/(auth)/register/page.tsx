import { StudentSignupPage } from "@/exports/exports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your account · BELEFUL",
  description: "Sign up to order food across campus with BELEFUL.",
};

export default function page() {
  return <StudentSignupPage />;
}
