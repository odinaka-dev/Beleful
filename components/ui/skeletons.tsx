import { Skeleton } from "./skeleton";
import { Card } from "./card";

/** Loading placeholder for a metric tile. */
export function StatCardSkeleton() {
  return (
    <Card className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </Card>
  );
}

/** Loading placeholder for a vendor / food card. */
export function MediaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#00452E]/10 bg-white">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/** Loading placeholder for table rows. */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#00452E]/10">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 border-b border-[#00452E]/8 px-5 py-4 last:border-0"
        >
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
