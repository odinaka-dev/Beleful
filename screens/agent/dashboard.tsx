"use client";

import * as React from "react";
import Link from "next/link";
import {
  MoneyRecive,
  TickCircle,
  Clock,
  Star1,
  Location,
  Box1,
  Call,
  ShieldTick,
} from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCardSkeleton } from "@/components/ui/skeletons";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  DELIVERY_STAGES,
  formatNaira,
  type AvailableDelivery,
  type ActiveDelivery,
  type DeliveryStage,
} from "@/helpers/agent.helpers";
import { createClient } from "@/lib/supabase/client";

/** No per-vendor emoji data exists in the schema yet — one neutral fallback. */
const VENDOR_EMOJI = "🍱";

function dropoffLabel(hostel: string | null, landmark: string | null): string {
  return [hostel, landmark].filter(Boolean).join(" — ") || "Student hostel";
}

interface RawAvailableRow {
  id: string;
  hostel: string | null;
  landmark: string | null;
  delivery_fee: number | null;
  vendors: { business_name: string | null; address: string | null } | null;
  order_items: { quantity: number | null }[] | null;
}

function toAvailableDelivery(row: RawAvailableRow): AvailableDelivery {
  const itemsCount = (row.order_items ?? []).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );
  return {
    id: row.id,
    vendor: row.vendors?.business_name ?? "Vendor",
    vendorEmoji: VENDOR_EMOJI,
    pickup: row.vendors?.address ?? row.vendors?.business_name ?? "Vendor pickup",
    dropoff: dropoffLabel(row.hostel, row.landmark),
    earnings: Number(row.delivery_fee ?? 0),
    itemsCount,
  };
}

const AVAILABLE_SELECT =
  "id, hostel, landmark, delivery_fee, vendors(business_name, address), order_items(quantity)";

interface RawActiveRow {
  id: string;
  hostel: string | null;
  landmark: string | null;
  delivery_fee: number | null;
  delivery_pin: string | null;
  delivery_stage: string | null;
  vendors: { business_name: string | null; address: string | null } | null;
  order_items: { quantity: number | null }[] | null;
  profiles: { full_name: string | null; phone_number: string | null } | null;
}

function toActiveDelivery(row: RawActiveRow): ActiveDelivery {
  const itemsCount = (row.order_items ?? []).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );
  return {
    id: row.id,
    vendor: row.vendors?.business_name ?? "Vendor",
    vendorEmoji: VENDOR_EMOJI,
    pickup: row.vendors?.address ?? row.vendors?.business_name ?? "Vendor pickup",
    dropoff: dropoffLabel(row.hostel, row.landmark),
    customer: row.profiles?.full_name ?? "Customer",
    customerPhone: row.profiles?.phone_number ?? null,
    earnings: Number(row.delivery_fee ?? 0),
    stage: (row.delivery_stage ?? "assigned") as DeliveryStage,
    pin: row.delivery_pin,
    itemsCount,
  };
}

const ACTIVE_SELECT =
  "id, hostel, landmark, delivery_fee, delivery_pin, delivery_stage, vendors(business_name, address), order_items(quantity), profiles!orders_user_id_fkey(full_name, phone_number)";

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
  disableAccept,
  onAccept,
  onReject,
}: {
  delivery: AvailableDelivery;
  disableAccept: boolean;
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
            <p className="text-xs text-[#666666]">
              #{delivery.id.slice(0, 6).toUpperCase()}
            </p>
          </div>
        </div>
        <span className="font-heading text-lg font-bold text-[#00452E]">
          {formatNaira(delivery.earnings)}
        </span>
      </div>

      <RouteLine pickup={delivery.pickup} dropoff={delivery.dropoff} />

      <div className="mt-4 flex items-center gap-4 text-xs text-[#666666]">
        <span className="flex items-center gap-1">
          <Box1 size={14} variant="TwoTone" /> {delivery.itemsCount} items
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <PrimaryButton variant="outline" onClick={onReject}>
          Reject
        </PrimaryButton>
        <PrimaryButton
          onClick={onAccept}
          disabled={disableAccept}
          title={disableAccept ? "Finish your current delivery first" : undefined}
        >
          Accept
        </PrimaryButton>
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
  advancing,
  onAdvance,
}: {
  delivery: ActiveDelivery;
  advancing: boolean;
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
          <p className="text-xs text-white/70">
            Active delivery · #{delivery.id.slice(0, 6).toUpperCase()}
          </p>
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
            {delivery.pin && (
              <div className="text-right">
                <p className="text-xs text-[#666666]">Delivery PIN</p>
                <p className="font-heading font-bold tracking-widest text-[#00452E]">
                  {delivery.pin}
                </p>
              </div>
            )}
            {delivery.customerPhone && (
              <a
                href={`tel:${delivery.customerPhone}`}
                aria-label="Call customer"
                className="grid h-10 w-10 place-items-center rounded-xl bg-[#00452E] text-white"
              >
                <Call size={18} variant="Bold" />
              </a>
            )}
          </div>
        </div>

        <PrimaryButton
          className="mt-5"
          disabled={done}
          loading={advancing}
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
  const [agentId, setAgentId] = React.useState<string | null>(null);
  const [verification, setVerification] = React.useState<string | null>(null);
  const [rating, setRating] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [available, setAvailable] = React.useState<AvailableDelivery[]>([]);
  const [active, setActive] = React.useState<ActiveDelivery | null>(null);
  const [completedToday, setCompletedToday] = React.useState(0);
  const [earningsToday, setEarningsToday] = React.useState(0);
  const [advancing, setAdvancing] = React.useState(false);

  const load = React.useCallback(async (id: string) => {
    const supabase = createClient();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [availableRes, activeRes, completedRes] = await Promise.all([
      supabase
        .from("orders")
        .select(AVAILABLE_SELECT)
        .eq("status", "ready")
        .is("delivery_agent_id", null),
      supabase
        .from("orders")
        .select(ACTIVE_SELECT)
        .eq("delivery_agent_id", id)
        .eq("status", "ready")
        .maybeSingle(),
      supabase
        .from("orders")
        .select("delivery_fee")
        .eq("delivery_agent_id", id)
        .eq("status", "completed")
        .gte("created_at", todayStart.toISOString()),
    ]);

    if (availableRes.error) setError(availableRes.error.message);
    else {
      setAvailable(
        ((availableRes.data ?? []) as unknown as RawAvailableRow[]).map(
          toAvailableDelivery,
        ),
      );
    }

    if (activeRes.error) setError(activeRes.error.message);
    else {
      setActive(
        activeRes.data
          ? toActiveDelivery(activeRes.data as unknown as RawActiveRow)
          : null,
      );
    }

    if (!completedRes.error) {
      const rows = completedRes.data ?? [];
      setCompletedToday(rows.length);
      setEarningsToday(
        rows.reduce((sum, r) => sum + Number(r.delivery_fee ?? 0), 0),
      );
    }
  }, []);

  React.useEffect(() => {
    let isActive = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (isActive) setLoading(false);
        return;
      }

      const { data: agent } = await supabase
        .from("delivery_agents")
        .select("id, verification_status, rating")
        .eq("user_id", userData.user.id)
        .single();

      if (!isActive) return;
      if (!agent) {
        setError("No agent profile found for this account.");
        setLoading(false);
        return;
      }

      setAgentId(agent.id);
      setVerification(agent.verification_status);
      setRating(Number(agent.rating ?? 0));

      if (agent.verification_status === "verified") {
        await load(agent.id);
      }
      if (isActive) setLoading(false);
    })();
    return () => {
      isActive = false;
    };
  }, [load]);

  React.useEffect(() => {
    if (!agentId || verification !== "verified") return;
    const supabase = createClient();
    const channel = supabase
      .channel(`agent-orders-${agentId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => load(agentId),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId, verification, load]);

  async function acceptDelivery(id: string) {
    if (!agentId) return;
    setError(null);
    const supabase = createClient();
    const { error: claimError } = await supabase.rpc("claim_order", {
      p_order_id: id,
    });
    if (claimError) setError(claimError.message);
    await load(agentId);
  }

  function rejectDelivery(id: string) {
    setAvailable((prev) => prev.filter((d) => d.id !== id));
  }

  async function advanceActive() {
    if (!active || !agentId) return;
    const next = NEXT_STAGE[active.stage];
    if (!next) return;

    setAdvancing(true);
    setError(null);
    const supabase = createClient();

    const { error: advanceError } =
      next === "delivered"
        ? await supabase.rpc("complete_delivery", { p_order_id: active.id })
        : await supabase
            .from("orders")
            .update({ delivery_stage: next })
            .eq("id", active.id);

    if (advanceError) setError(advanceError.message);
    await load(agentId);
    setAdvancing(false);
  }

  if (loading) {
    return (
      <div>
        <DashboardHeader
          title="Welcome back 👋"
          subtitle="Here's how your deliveries are going today."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (verification !== "verified") {
    const submitted = verification === "submitted";
    return (
      <div>
        <DashboardHeader
          title="Welcome 👋"
          subtitle="Your agent account is under review."
        />
        <EmptyState
          icon={<ShieldTick size={28} variant="TwoTone" />}
          title={submitted ? "Submitted — under review" : "Upload your student ID"}
          description={
            submitted
              ? "Our team reviews new agents within 24 hours. You'll be able to accept deliveries once your account is verified."
              : "Upload a valid student ID from your profile to start the verification process."
          }
          action={
            !submitted && (
              <Link href="/agent-dashboard/profile">
                <PrimaryButton fullWidth={false}>Go to profile</PrimaryButton>
              </Link>
            )
          }
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Welcome back 👋"
        subtitle="Here's how your deliveries are going today."
      />

      {error && (
        <p className="mb-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Earnings today"
          value={formatNaira(earningsToday)}
          icon={<MoneyRecive size={20} variant="Bold" />}
        />
        <StatCard
          label="Completed today"
          value={String(completedToday)}
          icon={<TickCircle size={20} variant="Bold" />}
        />
        <StatCard
          label="Active"
          value={active ? "1" : "0"}
          icon={<Clock size={20} variant="Bold" />}
        />
        <StatCard
          label="Rating"
          value={rating.toFixed(1)}
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
                  disableAccept={!!active}
                  onAccept={() => acceptDelivery(delivery.id)}
                  onReject={() => rejectDelivery(delivery.id)}
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
            <ActiveDeliveryCard
              delivery={active}
              advancing={advancing}
              onAdvance={advanceActive}
            />
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
