"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Call, Messages2, Star1, ShieldTick } from "iconsax-reactjs";
import { OrderTimeline } from "@/components/student/order-timeline";
import { StatusBadge } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  ACTIVE_ORDERS,
  ORDER_STEPS,
  formatNaira,
} from "@/helpers/student.helpers";

/** Order tracking: status timeline, delivery agent card, delivery PIN. */
export default function OrderTrackingPage({ orderId }: { orderId: string }) {
  const order = ACTIVE_ORDERS.find((o) => o.id === orderId);
  if (!order) notFound();

  const stepLabel =
    ORDER_STEPS.find((s) => s.status === order.status)?.label ?? "In progress";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111]">
            Track order
          </h1>
          <p className="text-sm text-[#666666]">Order #{order.id}</p>
        </div>
        <StatusBadge tone="pending" dot>
          {stepLabel}
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
            <div className="rounded-2xl bg-[#00452E]/5 px-4 py-2 text-center">
              <p className="text-xs text-[#666666]">ETA</p>
              <p className="font-heading font-bold text-[#00452E]">{order.eta}</p>
            </div>
          </div>
          <OrderTimeline current={order.status} />
        </section>

        {/* Agent + PIN */}
        <div className="flex flex-col gap-6">
          {/* Delivery PIN */}
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

          {/* Agent card */}
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
                  <Star1 size={14} variant="Bold" color="#FCD882" /> 4.9 ·
                  Student agent
                </p>
              </div>
            </div>
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
          </section>

          <Link href="/user-dashboard" className="text-center text-sm font-semibold text-[#00452E] hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
