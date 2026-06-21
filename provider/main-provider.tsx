"use client";

import { Provider } from "@/components/ui/provider";
import Footer from "@/components/layout/footer";
import { usePathname } from "next/navigation";

export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  const hiddenRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/agent/login",
    "/agent/register",
    "agent/forgot-password",
    "/vendor/login",
    "/vendor/register",
    "/vendor/forgot-password",
  ];

  const shouldHideFooter = hiddenRoutes.some((path) =>
    pathname.startsWith(path),
  );

  return (
    <Provider>
      {children}
      {!shouldHideFooter && <Footer />}
    </Provider>
  );
}
