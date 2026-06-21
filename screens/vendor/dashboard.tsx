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
import { StatCardSkeleton, TableSkeleton } from "@/components/ui/skeletons";
import { OrderStatusBadge } from "@/components/vendor/order-status";
import {
  formatNaira,
  formatRelativeTime,
  type TrendPoint,
  type VendorOrder,
  type VendorOrderStatus,
} from "@/helpers/vendor.helpers";
import { createClient } from "@/lib/supabase/client";

interface DashboardMetrics {
  revenueToday: number;
  ordersToday: number;
  pendingOrders: number;
  activeMenuItems: number;
  revenueDeltaPct: number | null;
  ordersDeltaPct: number | null;
}

const EMPTY_METRICS: DashboardMetrics = {
  revenueToday: 0,
  ordersToday: 0,
  pendingOrders: 0,
  activeMenuItems: 0,
  revenueDeltaPct: null,
  ordersDeltaPct: null,
};

interface RawOrderRow {
  id: string;
  status: string | null;
  total_amount: number | null;
  created_at: string | null;
  profiles: { full_name: string | null } | null;
  order_items:
    | { quantity: number | null; menu_items: { name: string | null } | null }[]
    | null;
}

function dayLabel(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function deltaPct(today: number, yesterday: number): number | null {
  if (yesterday === 0) return today > 0 ? 100 : null;
  return Math.round(((today - yesterday) / yesterday) * 100);
}

/** Short, human-friendly order code derived from the row's UUID. */
function shortOrderCode(id: string): string {
  return `BF-${id.slice(0, 6).toUpperCase()}`;
}

function toVendorOrder(row: RawOrderRow): VendorOrder {
  const items = row.order_items ?? [];
  const itemsCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const itemsLabel =
    items
      .map((item) => {
        const name = item.menu_items?.name ?? "Item";
        const qty = item.quantity ?? 1;
        return qty > 1 ? `${name} ×${qty}` : name;
      })
      .join(", ") || "—";

  return {
    id: row.id,
    customer: row.profiles?.full_name ?? "Customer",
    items: itemsLabel,
    itemsCount,
    total: Number(row.total_amount ?? 0),
    status: (row.status ?? "pending") as VendorOrderStatus,
    time: formatRelativeTime(row.created_at ?? new Date().toISOString()),
  };
}

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
            #{shortOrderCode(order.id)}
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
  const [vendorId, setVendorId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [metrics, setMetrics] = React.useState<DashboardMetrics>(EMPTY_METRICS);
  const [revenueTrend, setRevenueTrend] = React.useState<TrendPoint[]>([]);
  const [orderTrend, setOrderTrend] = React.useState<TrendPoint[]>([]);
  const [orders, setOrders] = React.useState<VendorOrder[]>([]);

  const load = React.useCallback(async (vendor: string) => {
    const supabase = createClient();
    const [statsRes, ordersRes, pendingRes, menuRes] = await Promise.all([
      supabase.rpc("get_vendor_daily_stats", { days_back: 7 }),
      supabase
        .from("orders")
        .select(
          "id, status, total_amount, created_at, profiles(full_name), order_items(quantity, menu_items(name))",
        )
        .eq("vendor_id", vendor)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("vendor_id", vendor)
        .eq("status", "pending"),
      supabase
        .from("menu_items")
        .select("id", { count: "exact", head: true })
        .eq("vendor_id", vendor)
        .eq("available", true),
    ]);

    if (statsRes.error) {
      setError(statsRes.error.message);
      return;
    }

    const stats = statsRes.data ?? [];
    setRevenueTrend(
      stats.map((d) => ({ label: dayLabel(d.day), value: Number(d.revenue) })),
    );
    setOrderTrend(
      stats.map((d) => ({ label: dayLabel(d.day), value: Number(d.order_count) })),
    );

    const today = stats[stats.length - 1];
    const yesterday = stats[stats.length - 2];
    setMetrics({
      revenueToday: today ? Number(today.revenue) : 0,
      ordersToday: today ? Number(today.order_count) : 0,
      pendingOrders: pendingRes.count ?? 0,
      activeMenuItems: menuRes.count ?? 0,
      revenueDeltaPct:
        today && yesterday
          ? deltaPct(Number(today.revenue), Number(yesterday.revenue))
          : null,
      ordersDeltaPct:
        today && yesterday
          ? deltaPct(Number(today.order_count), Number(yesterday.order_count))
          : null,
    });

    if (ordersRes.error) {
      setError(ordersRes.error.message);
      return;
    }
    setOrders(((ordersRes.data ?? []) as unknown as RawOrderRow[]).map(toVendorOrder));
  }, []);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (active) setLoading(false);
        return;
      }

      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

      if (!active) return;
      if (!vendor) {
        setError("No vendor profile found for this account.");
        setLoading(false);
        return;
      }

      setVendorId(vendor.id);
      await load(vendor.id);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [load]);

  React.useEffect(() => {
    if (!vendorId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`vendor-orders-${vendorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendorId}`,
        },
        () => load(vendorId),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vendorId, load]);

  async function updateOrder(id: string, status: VendorOrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (updateError) {
      setError(updateError.message);
      if (vendorId) load(vendorId);
    }
  }

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        subtitle="Today's performance at a glance."
      />

      {error && (
        <p className="mb-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {/* Metrics */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Revenue today"
            value={formatNaira(metrics.revenueToday)}
            icon={<MoneyRecive size={20} variant="Bold" />}
            delta={
              metrics.revenueDeltaPct === null
                ? undefined
                : `${Math.abs(metrics.revenueDeltaPct)}%`
            }
            trend={metrics.revenueDeltaPct !== null && metrics.revenueDeltaPct < 0 ? "down" : "up"}
          />
          <StatCard
            label="Orders today"
            value={String(metrics.ordersToday)}
            icon={<ShoppingBag size={20} variant="Bold" />}
            delta={
              metrics.ordersDeltaPct === null
                ? undefined
                : `${Math.abs(metrics.ordersDeltaPct)}%`
            }
            trend={metrics.ordersDeltaPct !== null && metrics.ordersDeltaPct < 0 ? "down" : "up"}
          />
          <StatCard
            label="Pending orders"
            value={String(metrics.pendingOrders)}
            icon={<Clock size={20} variant="Bold" />}
          />
          <StatCard
            label="Active menu items"
            value={String(metrics.activeMenuItems)}
            icon={<Reserve size={20} variant="Bold" />}
          />
        </div>
      )}

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-bold text-[#111111]">
              Revenue trend
            </h2>
            <span className="text-xs font-medium text-[#666666]">Last 7 days</span>
          </div>
          {loading ? (
            <div className="h-44 animate-pulse rounded-2xl bg-[#00452E]/5" />
          ) : (
            <TrendChart data={revenueTrend} format={formatNaira} />
          )}
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-bold text-[#111111]">
              Order trend
            </h2>
            <span className="text-xs font-medium text-[#666666]">Last 7 days</span>
          </div>
          {loading ? (
            <div className="h-44 animate-pulse rounded-2xl bg-[#00452E]/5" />
          ) : (
            <TrendChart data={orderTrend} color="#B04D0F" />
          )}
        </Card>
      </div>

      {/* Recent orders */}
      <section className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
          Recent orders
        </h2>
        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
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
        )}
      </section>
    </div>
  );
}
