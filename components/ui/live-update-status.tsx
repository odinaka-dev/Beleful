import type { LiveUpdateStatus } from "@/hooks/use-order-realtime";

export function LiveUpdateNotice({ status }: { status: LiveUpdateStatus }) {
  if (status === "live") return null;

  return (
    <p
      role="status"
      className="mb-4 rounded-xl bg-[#FFFFDE] px-4 py-3 text-sm font-medium text-[#7A5C00]"
    >
      {status === "connecting"
        ? "Connecting live order updates…"
        : "Live updates are temporarily unavailable. We’ll refresh when the connection returns."}
    </p>
  );
}
