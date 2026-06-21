import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import type { VendorOrderStatus } from "@/helpers/vendor.helpers";

const MAP: Record<VendorOrderStatus, { tone: StatusTone; label: string }> = {
  pending: { tone: "warning", label: "Pending" },
  preparing: { tone: "info", label: "Preparing" },
  ready: { tone: "pending", label: "Ready for pickup" },
  completed: { tone: "success", label: "Completed" },
  rejected: { tone: "danger", label: "Rejected" },
};

/** Shared status pill for vendor orders. */
export function OrderStatusBadge({ status }: { status: VendorOrderStatus }) {
  const { tone, label } = MAP[status];
  return (
    <StatusBadge tone={tone} dot>
      {label}
    </StatusBadge>
  );
}
