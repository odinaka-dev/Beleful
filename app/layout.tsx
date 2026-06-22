import type { Metadata } from "next";
// import Script from "next/script";
import { Quicksand, Figtree } from "next/font/google";

import { Provider } from "@/components/ui/provider";
import "./globals.css";
import Script from "next/script";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Beleful",
  description: "Satisfaction that meets luxurious expectations",
};

const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-primary",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        quicksand.variable,
        quicksand.className,
        "font-sans",
        figtree.variable,
      )}
      suppressHydrationWarning
    >
      <body className="">
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
