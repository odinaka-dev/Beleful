"use client";

import * as React from "react";
import {
  MoneyRecive,
  TickCircle,
  Clock,
  Star1,
  Location,
  Box1,
  Call,
  Routing,
} from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  AGENT_METRICS,
  AVAILABLE_DELIVERIES,
  ACTIVE_DELIVERY,
  DELIVERY_STAGES,
  formatNaira,
  type AvailableDelivery,
  type ActiveDelivery,
  type DeliveryStage,
} from "@/helpers/agent.helpers";

/** Route between pickup and dropoff, shared by available/active cards. */
function RouteLine({ pickup, dropoff }: { pickup: string; dropoff: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-[#00452E]" />
        <span className="my-1 w-0.5 flex-1 bg-[#00452E]/15" />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-[#FCD882] bg-white" />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <p className="text-xs text-[#666666]">Pickup</p>
          <p className="text-sm font-semibold text-[#111111]">{pickup}</p>
        </div>
        <div>
          <p className="text-xs text-[#666666]">Dropoff</p>
          <p className="text-sm font-semibold text-[#111111]">{dropoff}</p>
        </div>
      </div>
    </div>
  );
}

function AvailableCard({
  delivery,
  onAccept,
  onReject,
}: {
  delivery: AvailableDelivery;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-3xl border border-[#00452E]/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#00452E]/5 text-lg">
            {delivery.vendorEmoji}
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-[#111111]">
              {delivery.vendor}
            </p>
            <p className="text-xs text-[#666666]">#{delivery.id}</p>
          </div>
        </div>
        <span className="font-heading text-lg font-bold text-[#00452E]">
          {formatNaira(delivery.earnings)}
        </span>
      </div>

      <RouteLine pickup={delivery.pickup} dropoff={delivery.dropoff} />

      <div className="mt-4 flex items-center gap-4 text-xs text-[#666666]">
        <span className="flex items-center gap-1">
          <Routing size={14} variant="TwoTone" /> {delivery.distanceKm} km
        </span>
        <span className="flex items-center gap-1">
          <Box1 size={14} variant="TwoTone" /> {delivery.itemsCount} items
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <PrimaryButton variant="outline" onClick={onReject}>
          Reject
        </PrimaryButton>
        <PrimaryButton onClick={onAccept}>Accept</PrimaryButton>
      </div>
    </div>
  );
}

const NEXT_STAGE: Record<DeliveryStage, DeliveryStage | null> = {
  assigned: "picked_up",
  picked_up: "in_transit",
  in_transit: "delivered",
  delivered: null,
};

const STAGE_ACTION: Record<DeliveryStage, string> = {
  assigned: "Mark as Picked Up",
  picked_up: "Start Delivery",
  in_transit: "Complete Delivery",
  delivered: "Delivered",
};

function ActiveDeliveryCard({
  delivery,
  onAdvance,
}: {
  delivery: ActiveDelivery;
  onAdvance: () => void;
}) {
  const currentIndex = DELIVERY_STAGES.findIndex(
    (s) => s.stage === delivery.stage,
  );
  const done = delivery.stage === "delivered";

  return (
    <div className="overflow-hidden rounded-3xl border border-[#00452E]/10 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#00452E] p-5 text-white">
        <div>
          <p className="text-xs text-white/70">Active delivery · #{delivery.id}</p>
          <p className="font-heading text-lg font-bold">{delivery.vendor}</p>
        </div>
        <span className="font-heading text-xl font-bold text-[#FCD882]">
          {formatNaira(delivery.earnings)}
        </span>
      </div>

      <div className="p-5">
        {/* Stage progress */}
        <div className="mb-5 flex items-center justify-between">
          {DELIVERY_STAGES.map((s, i) => (
            <React.Fragment key={s.stage}>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-bold " +
                    (i <= currentIndex
                      ? "bg-[#00452E] text-white"
                      : "bg-[#00452E]/8 text-[#9CA3AF]")
                  }
                >
                  {i + 1}
                </span>
                <span
                  className={
                    "text-[10px] font-semibold " +
                    (i <= currentIndex ? "text-[#00452E]" : "text-[#9CA3AF]")
                  }
                >
                  {s.label}
                </span>
              </div>
              {i < DELIVERY_STAGES.length - 1 && (
                <span
                  className={
                    "mx-1 h-0.5 flex-1 " +
                    (i < currentIndex ? "bg-[#00452E]" : "bg-[#00452E]/12")
                  }
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <RouteLine pickup={delivery.pickup} dropoff={delivery.dropoff} />

        {/* Customer */}
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#00452E]/[0.03] p-4">
          <div>
            <p className="text-xs text-[#666666]">Customer</p>
            <p className="text-sm font-semibold text-[#111111]">
              {delivery.customer}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-[#666666]">Delivery PIN</p>
              <p className="font-heading font-bold tracking-widest text-[#00452E]">
                {delivery.pin}
              </p>
            </div>
            <a
              href={`tel:${delivery.customerPhone}`}
              aria-label="Call customer"
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#00452E] text-white"
            >
              <Call size={18} variant="Bold" />
            </a>
          </div>
        </div>

        <PrimaryButton
          className="mt-5"
          disabled={done}
          onClick={onAdvance}
        >
          {done ? (
            <>
              <TickCircle size={18} variant="Bold" /> {STAGE_ACTION[delivery.stage]}
            </>
          ) : (
            STAGE_ACTION[delivery.stage]
          )}
        </PrimaryButton>
      </div>
    </div>
  );
}

/** Agent dashboard: metrics, available deliveries, active delivery. */
export default function AgentDashboard() {
  const [available, setAvailable] = React.useState(AVAILABLE_DELIVERIES);
  const [active, setActive] = React.useState<ActiveDelivery | null>(
    ACTIVE_DELIVERY,
  );

  function acceptDelivery(id: string) {
    const picked = available.find((d) => d.id === id);
    setAvailable((prev) => prev.filter((d) => d.id !== id));
    if (picked && !active) {
      setActive({
        id: picked.id,
        vendor: picked.vendor,
        vendorEmoji: picked.vendorEmoji,
        pickup: picked.pickup,
        dropoff: picked.dropoff,
        customer: "New Customer",
        customerPhone: "+234 800 000 0000",
        earnings: picked.earnings,
        stage: "assigned",
        // Deterministic 4-digit PIN derived from the order id (no impure RNG).
        pin: (picked.id.replace(/\D/g, "").slice(-4) || "0000").padStart(4, "0"),
        itemsCount: picked.itemsCount,
      });
    }
  }

  function advanceActive() {
    setActive((prev) => {
      if (!prev) return prev;
      const next = NEXT_STAGE[prev.stage];
      return next ? { ...prev, stage: next } : prev;
    });
  }

  return (
    <div>
      <DashboardHeader
        title="Welcome back, David 👋"
        subtitle="Here's how your deliveries are going today."
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Earnings today"
          value={formatNaira(AGENT_METRICS.earningsToday)}
          icon={<MoneyRecive size={20} variant="Bold" />}
          delta="+12%"
        />
        <StatCard
          label="Completed"
          value={String(AGENT_METRICS.completedDeliveries)}
          icon={<TickCircle size={20} variant="Bold" />}
        />
        <StatCard
          label="Pending"
          value={String(AGENT_METRICS.pendingDeliveries)}
          icon={<Clock size={20} variant="Bold" />}
        />
        <StatCard
          label="Rating"
          value={AGENT_METRICS.rating.toFixed(1)}
          icon={<Star1 size={20} variant="Bold" />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
        {/* Available deliveries */}
        <section>
          <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
            Available deliveries
          </h2>
          {available.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {available.map((delivery) => (
                <AvailableCard
                  key={delivery.id}
                  delivery={delivery}
                  onAccept={() => acceptDelivery(delivery.id)}
                  onReject={() =>
                    setAvailable((prev) =>
                      prev.filter((d) => d.id !== delivery.id),
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Location size={28} variant="TwoTone" />}
              title="No deliveries available"
              description="New delivery requests around you will appear here."
            />
          )}
        </section>

        {/* Active delivery */}
        <section className="lg:sticky lg:top-24">
          <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
            Active delivery
          </h2>
          {active ? (
            <ActiveDeliveryCard delivery={active} onAdvance={advanceActive} />
          ) : (
            <EmptyState
              title="No active delivery"
              description="Accept a delivery to start tracking it here."
            />
          )}
        </section>
      </div>
    </div>
  );
}
