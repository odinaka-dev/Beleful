import * as React from "react";
import type { TrendPoint } from "@/helpers/vendor.helpers";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  data: TrendPoint[];
  /** Bar fill colour. */
  color?: string;
  /** Optional value formatter for the tooltip/peak label. */
  format?: (value: number) => string;
  className?: string;
}

/**
 * Dependency-free CSS bar chart. Heights are scaled to the series max so it
 * reads clearly without pulling in a charting library.
 */
export function TrendChart({
  data,
  color = "#00452E",
  format = (v) => String(v),
  className,
}: TrendChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("flex h-44 items-end gap-2 sm:gap-3", className)}>
      {data.map((point) => {
        const heightPct = Math.round((point.value / max) * 100);
        return (
          <div
            key={point.label}
            className="group flex flex-1 flex-col items-center justify-end gap-2"
          >
            {/* Value label on hover */}
            <span className="rounded-md bg-[#111111] px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              {format(point.value)}
            </span>
            <div
              className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80"
              style={{
                height: `${Math.max(heightPct, 4)}%`,
                background: `linear-gradient(180deg, ${color}, ${color}99)`,
              }}
            />
            <span className="text-xs font-medium text-[#666666]">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
