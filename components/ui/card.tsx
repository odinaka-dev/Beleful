import * as React from "react";
import { cn } from "@/lib/utils";

/** Soft, rounded surface used as the base for most dashboard content. */
export function Card({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  /** e.g. "+12%" — rendered green for up, red for down based on `trend`. */
  delta?: string;
  trend?: "up" | "down";
  accent?: string;
}

/** Metric tile for dashboards (earnings, orders, rating, etc.). */
export function StatCard({
  label,
  value,
  icon,
  delta,
  trend = "up",
  accent = "#00452E",
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#666666]">{label}</span>
        {icon && (
          <span
            className="grid h-10 w-10 place-items-center rounded-2xl"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="font-heading text-2xl font-bold text-[#111111] sm:text-3xl">
        {value}
      </p>
      {delta && (
        <span
          className={cn(
            "text-xs font-semibold",
            trend === "up" ? "text-[#00452E]" : "text-[#DC2626]",
          )}
        >
          {trend === "up" ? "▲" : "▼"} {delta}
        </span>
      )}
    </Card>
  );
}
