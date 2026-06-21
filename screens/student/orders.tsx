"use client";

import * as React from "react";
import { ReceiptItem } from "iconsax-reactjs";
import { ActiveOrderCard } from "@/components/student/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaCardSkeleton } from "@/components/ui/skeletons";
import {
  type ActiveOrder,
  type RawOrderRow,
  ACTIVE_ORDER_COLUMNS,
  toActiveOrder,
} from "@/helpers/student.helpers";
import { createClient } from "@/lib/supabase/client";

/** Student order history — every order placed, most recent first. */
export default function OrdersPage() {
  const [orders, setOrders] = React.useState<ActiveOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (active) setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select(ACTIVE_ORDER_COLUMNS)
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (!active) return;
      setOrders(((data ?? []) as unknown as RawOrderRow[]).map(toActiveOrder));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-[#111111]">
        Your orders
      </h1>

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
