"use client";

import MainProvider from "./main-provider";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainProvider>{children}</MainProvider>;
}
