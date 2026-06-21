import { ReactNode } from "react";
import RootProvider from "@/provider/root-provider";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <div>
      <RootProvider>{children}</RootProvider>
    </div>
  );
}
