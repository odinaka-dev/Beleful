import * as React from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  key: string;
  header: string;
  /** Custom cell renderer; falls back to `row[key]`. */
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Stable row key accessor. */
  rowKey: (row: T, index: number) => string | number;
  empty?: React.ReactNode;
  className?: string;
}

/**
 * Reusable responsive table. On mobile it collapses each row into a stacked
 * card so dashboard tables stay readable on phones.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  empty,
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <>{empty ?? <EmptyState title="Nothing here yet" />}</>
    );
  }

  const alignClass = (a?: "left" | "right" | "center") =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#00452E]/10 sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#00452E]/[0.03]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#666666]",
                    alignClass(col.align),
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                className="border-t border-[#00452E]/8 transition-colors hover:bg-[#00452E]/[0.02]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-4 text-[#111111]",
                      alignClass(col.align),
                      col.className,
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, React.ReactNode>)[col.key] ??
                        "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {data.map((row, i) => (
          <div
            key={rowKey(row, i)}
            className="rounded-2xl border border-[#00452E]/10 bg-white p-4"
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex items-center justify-between gap-4 py-1.5"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
                  {col.header}
                </span>
                <span className="text-right text-sm text-[#111111]">
                  {col.render
                    ? col.render(row)
                    : ((row as Record<string, React.ReactNode>)[col.key] ??
                      "—")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
