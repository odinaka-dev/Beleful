import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Elegant empty state for lists, tables and dashboards with no data yet. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#00452E]/15 bg-[#00452E]/[0.02] px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <span className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-[#00452E]/8 text-[#00452E]">
          {icon}
        </span>
      )}
      <h3 className="font-heading text-lg font-bold text-[#111111]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-[#666666]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
