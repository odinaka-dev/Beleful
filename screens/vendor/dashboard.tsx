"use client";

import * as React from "react";
import {
  MoneyRecive,
  ShoppingBag,
  Clock,
  Reserve,
  TickCircle,
  CloseCircle,
  Box,
} from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Card, StatCard } from "@/components/ui/card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusBadge } from "@/components/vendor/order-status";
import {
  VENDOR_METRICS,
  REVENUE_TREND,
  ORDER_TREND,
  RECENT_ORDERS,
  formatNaira,
  type VendorOrder,
  type VendorOrderStatus,
} from "@/helpers/vendor.helpers";

function OrderRow({
  order,
  onUpdate,
}: {
  order: VendorOrder;
  onUpdate: (id: string, status: VendorOrderStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#00452E]/8 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-heading text-sm font-bold text-[#111111]">
            #{order.id}
          </p>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-0.5 truncate text-sm text-[#666666]">
          {order.customer} · {order.items}
        </p>
        <p className="mt-0.5 text-xs text-[#9CA3AF]">{order.time}</p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="font-heading font-bold text-[#00452E]">
          {formatNaira(order.total)}
        </span>

        {order.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(order.id, "rejected")}
              aria-label="Reject order"
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#FECACA] text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
            >
              <CloseCircle size={18} variant="TwoTone" />
            </button>
            <button
              onClick={() => onUpdate(order.id, "preparing")}
              className="flex items-center gap-1.5 rounded-xl bg-[#00452E] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#016644]"
            >
              <TickCircle size={16} variant="Bold" /> Accept
            </button>
          </div>
        )}

        {order.status === "preparing" && (
          <button
            onClick={() => onUpdate(order.id, "ready")}
            className="flex items-center gap-1.5 rounded-xl bg-[#FCD882] px-3 py-2 text-xs font-semibold text-[#7A5C00] transition-colors hover:brightness-95"
          >
            <Box size={16} variant="Bold" /> Ready for pickup
          </button>
        )}
      </div>
    </div>
  );
}

/** Vendor dashboard: metrics, revenue/order trends, recent orders. */
export default function VendorDashboard() {
  const [orders, setOrders] = React.useState(RECENT_ORDERS);

  const updateOrder = (id: string, status: VendorOrderStatus) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        subtitle="Today's performance at a glance."
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Revenue today"
          value={formatNaira(VENDOR_METRICS.revenueToday)}
          icon={<MoneyRecive size={20} variant="Bold" />}
          delta="+8%"
        />
        <StatCard
          label="Orders today"
          value={String(VENDOR_METRICS.ordersToday)}
          icon={<ShoppingBag size={20} variant="Bold" />}
          delta="+5%"
        />
        <StatCard
          label="Pending orders"
          value={String(VENDOR_METRICS.pendingOrders)}
          icon={<Clock size={20} variant="Bold" />}
        />
        <StatCard
          label="Active menu items"
          value={String(VENDOR_METRICS.activeMenuItems)}
          icon={<Reserve size={20} variant="Bold" />}
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-bold text-[#111111]">
              Revenue trend
            </h2>
            <span className="text-xs font-medium text-[#666666]">Last 7 days</span>
          </div>
          <TrendChart data={REVENUE_TREND} format={formatNaira} />
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-bold text-[#111111]">
              Order trend
            </h2>
            <span className="text-xs font-medium text-[#666666]">Last 7 days</span>
          </div>
          <TrendChart data={ORDER_TREND} color="#B04D0F" />
        </Card>
      </div>

      {/* Recent orders */}
      <section className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
          Recent orders
        </h2>
        <Card className="py-2">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderRow key={order.id} order={order} onUpdate={updateOrder} />
            ))
          ) : (
            <div className="py-8">
              <EmptyState
                title="No orders yet"
                description="New orders from students will appear here."
              />
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
