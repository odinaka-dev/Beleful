import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusTone =
  | "success"
  | "pending"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

const TONES: Record<StatusTone, string> = {
  success: "bg-[#00452E]/10 text-[#00452E]",
  pending: "bg-[#FCD882]/30 text-[#7A5C00]",
  warning: "bg-[#FEF3C7] text-[#B45309]",
  danger: "bg-[#FEE2E2] text-[#DC2626]",
  info: "bg-[#E0F2FE] text-[#0369A1]",
  neutral: "bg-[#F3F4F6] text-[#4B5563]",
};

interface StatusBadgeProps {
  tone?: StatusTone;
  children: React.ReactNode;
  /** Renders a small leading status dot. */
  dot?: boolean;
  className?: string;
}

/** Pill badge used for verification status, order status, etc. */
export function StatusBadge({
  tone = "neutral",
  children,
  dot = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  );
}
