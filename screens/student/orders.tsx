"use client";

import * as React from "react";
import { ReceiptItem } from "iconsax-reactjs";
import { ActiveOrderCard } from "@/components/student/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaCardSkeleton } from "@/components/ui/skeletons";
import { LiveUpdateNotice } from "@/components/ui/live-update-status";
import {
  type ActiveOrder,
  type RawOrderRow,
  ACTIVE_ORDER_COLUMNS,
  toActiveOrder,
} from "@/helpers/student.helpers";
import { createClient } from "@/lib/supabase/client";
import { useOrderRealtime } from "@/hooks/use-order-realtime";
import { toaster } from "@/components/ui/toaster";

/** Student order history — every order placed, most recent first. */
export default function OrdersPage() {
  const [orders, setOrders] = React.useState<ActiveOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string | null>(null);

  const loadOrders = React.useCallback(async (id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(ACTIVE_ORDER_COLUMNS)
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      toaster.create({ title: "Couldn't load your orders", description: "Something went wrong fetching your order history. Please try again.", type: "error", duration: 4000, closable: true });
    }

    setOrders(((data ?? []) as unknown as RawOrderRow[]).map(toActiveOrder));
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

      setUserId(userData.user.id);
      await loadOrders(userData.user.id);

      if (!active) return;
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [loadOrders]);

  const refreshOrders = React.useCallback(() => {
    if (userId) return loadOrders(userId);
  }, [loadOrders, userId]);

  const liveStatus = useOrderRealtime({
    channelName: `student-orders-${userId ?? "pending"}`,
    enabled: !!userId,
    filter: userId ? `user_id=eq.${userId}` : undefined,
    onChange: refreshOrders,
  });

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[#111111]">
        Your orders
      </h1>

      {userId && <LiveUpdateNotice status={liveStatus} />}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <MediaCardSkeleton key={i} />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <ActiveOrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ReceiptItem size={28} variant="TwoTone" />}
          title="No orders yet"
          description="Your past and active orders will show up here."
        />
      )}
    </div>
  );
}
