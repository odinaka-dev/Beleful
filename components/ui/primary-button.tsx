"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ComponentProps<"button"> {
  variant?: "solid" | "outline" | "ghost";
  fullWidth?: boolean;
  loading?: boolean;
}

/**
 * Single-action button matching the BELEFUL green system.
 * (Distinct from the marketing {@link DoubleButton} which renders a pair.)
 */
export function PrimaryButton({
  variant = "solid",
  fullWidth = true,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[15px] font-semibold transition-all duration-300",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "active:scale-[0.98]",
        fullWidth && "w-full",
        variant === "solid" &&
          "bg-[#00452E] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#016644] hover:shadow-lg",
        variant === "outline" &&
          "border-2 border-[#00452E] bg-transparent text-[#00452E] hover:bg-[#00452E] hover:text-white",
        variant === "ghost" &&
          "bg-[#00452E]/5 text-[#00452E] hover:bg-[#00452E]/10",
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
