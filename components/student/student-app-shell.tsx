"use client";

import * as React from "react";
import { CartProvider } from "@/provider/cart-provider";
import { StudentTopNav } from "./student-top-nav";
import { StudentBottomNav } from "./bottom-nav";

/**
 * Wraps every student-app route with cart state, the sticky top nav and the
 * mobile bottom nav. Used from the student segment layout.
 */
export function StudentAppShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-[#FAFAF5]">
        <StudentTopNav />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-28 pt-5 sm:px-6 lg:pb-12">
          {children}
        </main>
        <StudentBottomNav />
      </div>
    </CartProvider>
  );
}
