"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Call, Messages2, Star1, ShieldTick } from "iconsax-reactjs";
import { OrderTimeline } from "@/components/student/order-timeline";
import { StatusBadge } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  ORDER_STATUS_LABEL,
  buildOrderSteps,
  formatNaira,
  type OrderStatus,
} from "@/helpers/student.helpers";
import { createClient } from "@/lib/supabase/client";

interface OrderDetail {
  id: string;
  vendorName: string;
  status: OrderStatus;
  itemsCount: number;
  total: number;
  pin: string | null;
  agentName: string | null;
  agentPhone: string | null;
}

interface RawOrder {
  id: string;
  status: string | null;
  total_amount: number | null;
  vendors: { business_name: string | null } | null;
  order_items: { quantity: number | null }[] | null;
  delivery_agents: {
    profiles: { full_name: string | null; phone_number: string | null } | null;
  } | null;
}

function toDetail(row: RawOrder, pin: string | null): OrderDetail {
  const itemsCount = (row.order_items ?? []).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );
  return {
    id: row.id,
    vendorName: row.vendors?.business_name ?? "Vendor",
    status: (row.status ?? "pending") as OrderStatus,
    itemsCount,
    total: Number(row.total_amount ?? 0),
    pin,
    agentName: row.delivery_agents?.profiles?.full_name ?? null,
    agentPhone: row.delivery_agents?.profiles?.phone_number ?? null,
  };
}

const SELECT =
  "id, status, total_amount, vendors(business_name), order_items(quantity), delivery_agents(profiles(full_name, phone_number))";

/** Order tracking: status timeline, delivery agent card, delivery PIN. */
export default function OrderTrackingPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [missing, setMissing] = React.useState(false);

  const load = React.useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(SELECT)
      .eq("id", orderId)
      .single();

    if (error || !data) {
      setMissing(true);
      return;
    }

    const { data: pin } = await supabase.rpc("get_order_pin", {
      p_order_id: orderId,
    });

    setOrder(toDetail(data as unknown as RawOrder, pin ?? null));
  }, [orderId]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      await load();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [load]);

  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, load]);

  if (missing) notFound();

  if (loading || !order) {
    return (
      <div className="py-10">
        <div className="h-64 animate-pulse rounded-3xl bg-[#00452E]/5" />
      </div>
    );
  }

  const steps = buildOrderSteps(order.status, !!order.agentName);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111]">
            Track order
          </h1>
          <p className="text-sm text-[#666666]">
            Order #{order.id.slice(0, 6).toUpperCase()}
          </p>
        </div>
        <StatusBadge tone={order.status === "rejected" ? "danger" : "pending"} dot>
          {ORDER_STATUS_LABEL[order.status]}
        </StatusBadge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Timeline */}
        <section className="rounded-3xl border border-[#00452E]/10 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-[#111111]">
                {order.vendorName}
              </h2>
              <p className="text-sm text-[#666666]">
                {order.itemsCount} items · {formatNaira(order.total)}
              </p>
            </div>
          </div>
          <OrderTimeline steps={steps} />
        </section>

        {/* Agent + PIN */}
        <div className="flex flex-col gap-6">
          {order.pin && (
            <section className="rounded-3xl border border-[#FCD882]/60 bg-[#FFFFDE] p-6 text-center shadow-sm">
              <div className="mb-1 flex items-center justify-center gap-2 text-[#00452E]">
                <ShieldTick size={18} variant="Bold" />
                <span className="text-sm font-semibold">Delivery PIN</span>
              </div>
              <p className="text-xs text-[#666666]">
                Share this with your agent on arrival
              </p>
              <div className="mt-4 flex justify-center gap-3">
                {order.pin.split("").map((digit, i) => (
                  <span
                    key={i}
                    className="grid h-14 w-12 place-items-center rounded-2xl bg-white font-heading text-2xl font-bold text-[#00452E] shadow-sm"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </section>
          )}

          {order.agentName ? (
            <section className="rounded-3xl border border-[#00452E]/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-heading font-bold text-[#111111]">
                Your delivery agent
              </h2>
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-3xl bg-[#00452E] text-2xl font-bold text-white">
                  {order.agentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="flex-1">
                  <p className="font-heading font-bold text-[#111111]">
                    {order.agentName}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-[#666666]">
                    <Star1 size={14} variant="Bold" color="#FCD882" /> Student agent
                  </p>
                </div>
              </div>
              {order.agentPhone && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <a href={`tel:${order.agentPhone}`}>
                      <PrimaryButton variant="outline">
                        <Call size={18} variant="TwoTone" /> Call
                      </PrimaryButton>
                    </a>
                    <PrimaryButton variant="ghost">
                      <Messages2 size={18} variant="TwoTone" /> Chat
                    </PrimaryButton>
                  </div>
                  <p className="mt-3 text-center text-xs text-[#666666]">
                    {order.agentPhone}
                  </p>
                </>
              )}
            </section>
          ) : (
            <section className="rounded-3xl border border-dashed border-[#00452E]/15 bg-[#00452E]/[0.02] p-6 text-center">
              <p className="text-sm font-medium text-[#666666]">
                A delivery agent will be assigned once your order is ready.
              </p>
            </section>
          )}

          <Link
            href="/user-dashboard"
            className="text-center text-sm font-semibold text-[#00452E] hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
