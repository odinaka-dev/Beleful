"use client";

import * as React from "react";
import {
  ShieldTick,
  TickCircle,
  CloseCircle,
  Eye,
  Sms,
  Call,
  Buildings,
  Card as CardIcon,
  House,
} from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeletons";
import { createClient } from "@/lib/supabase/client";

type VerificationStatus = "pending" | "submitted" | "verified" | "rejected";

const TABS: { value: VerificationStatus | "all"; label: string }[] = [
  { value: "submitted", label: "Awaiting review" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

const STATUS_TONE: Record<VerificationStatus, StatusTone> = {
  pending: "neutral",
  submitted: "pending",
  verified: "success",
  rejected: "danger",
};

const STATUS_LABEL: Record<VerificationStatus, string> = {
  pending: "Not submitted",
  submitted: "Awaiting review",
  verified: "Verified",
  rejected: "Rejected",
};

interface PendingAgent {
  id: string;
  hostel: string;
  matricNumber: string;
  status: VerificationStatus;
  idDocPath: string | null;
  name: string;
  email: string;
  phone: string;
  school: string;
}

interface RawAgentRow {
  id: string;
  hostel: string | null;
  matric_number: string | null;
  verification_status: string | null;
  student_id_image: string | null;
  profiles: {
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    schools: { name: string } | null;
  } | null;
}

function normalizeStatus(status: string | null): VerificationStatus {
  return status === "submitted" || status === "verified" || status === "rejected"
    ? status
    : "pending";
}

function toPendingAgent(row: RawAgentRow): PendingAgent {
  return {
    id: row.id,
    hostel: row.hostel ?? "—",
    matricNumber: row.matric_number ?? "—",
    status: normalizeStatus(row.verification_status),
    idDocPath: row.student_id_image,
    name: row.profiles?.full_name ?? "Agent",
    email: row.profiles?.email ?? "—",
    phone: row.profiles?.phone_number ?? "—",
    school: row.profiles?.schools?.name ?? "—",
  };
}

const SELECT =
  "id, hostel, matric_number, verification_status, student_id_image, profiles(full_name, email, phone_number, schools(name))";

interface LockedOrder {
  id: string;
  hostel: string | null;
  landmark: string | null;
  pinAttempts: number;
  agentName: string | null;
  agentPhone: string | null;
}

interface RawLockedOrderRow {
  id: string;
  hostel: string | null;
  landmark: string | null;
  pin_attempts: number | null;
  delivery_agents: {
    profiles: { full_name: string | null; phone_number: string | null } | null;
  } | null;
}

function toLockedOrder(row: RawLockedOrderRow): LockedOrder {
  return {
    id: row.id,
    hostel: row.hostel,
    landmark: row.landmark,
    pinAttempts: row.pin_attempts ?? 0,
    agentName: row.delivery_agents?.profiles?.full_name ?? null,
    agentPhone: row.delivery_agents?.profiles?.phone_number ?? null,
  };
}

const LOCKED_SELECT =
  "id, hostel, landmark, pin_attempts, delivery_agents(profiles(full_name, phone_number))";

function LockedOrderRow({
  order,
  onUnlock,
}: {
  order: LockedOrder;
  onUnlock: (id: string) => void;
}) {
  const [unlocking, setUnlocking] = React.useState(false);

  async function unlock() {
    setUnlocking(true);
    await onUnlock(order.id);
    setUnlocking(false);
  }

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <p className="font-heading text-sm font-bold text-[#111111]">
            Order #{order.id.slice(0, 6).toUpperCase()}
          </p>
          <StatusBadge tone="danger" dot>
            Locked · {order.pinAttempts} attempt(s)
          </StatusBadge>
        </div>
        <div className="grid grid-cols-1 gap-1.5 text-xs text-[#666666] sm:grid-cols-2">
          <span className="flex items-center gap-1.5">
            <House size={14} variant="TwoTone" />{" "}
            {[order.hostel, order.landmark].filter(Boolean).join(" — ") || "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Call size={14} variant="TwoTone" />{" "}
            {order.agentName ?? "Unknown agent"} ·{" "}
            {order.agentPhone ?? "—"}
          </span>
        </div>
      </div>

      <PrimaryButton fullWidth={false} loading={unlocking} onClick={unlock}>
        Unlock order
      </PrimaryButton>
    </Card>
  );
}

function AgentRow({
  agent,
  onDecide,
}: {
  agent: PendingAgent;
  onDecide: (id: string, approved: boolean) => void;
}) {
  const [signedUrl, setSignedUrl] = React.useState<string | null>(null);
  const [loadingDoc, setLoadingDoc] = React.useState(false);
  const [deciding, setDeciding] = React.useState(false);

  async function viewId() {
    if (!agent.idDocPath || signedUrl) return;
    setLoadingDoc(true);
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("agent-documents")
      .createSignedUrl(agent.idDocPath, 60 * 5);
    setSignedUrl(data?.signedUrl ?? null);
    setLoadingDoc(false);
  }

  async function decide(approved: boolean) {
    setDeciding(true);
    await onDecide(agent.id, approved);
    setDeciding(false);
  }

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <p className="font-heading text-sm font-bold text-[#111111]">
            {agent.name}
          </p>
          <StatusBadge tone={STATUS_TONE[agent.status]} dot>
            {STATUS_LABEL[agent.status]}
          </StatusBadge>
        </div>
        <div className="grid grid-cols-1 gap-1.5 text-xs text-[#666666] sm:grid-cols-2">
          <span className="flex items-center gap-1.5">
            <Sms size={14} variant="TwoTone" /> {agent.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Call size={14} variant="TwoTone" /> {agent.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <Buildings size={14} variant="TwoTone" /> {agent.school}
          </span>
          <span className="flex items-center gap-1.5">
            <House size={14} variant="TwoTone" /> {agent.hostel}
          </span>
          <span className="flex items-center gap-1.5">
            <CardIcon size={14} variant="TwoTone" /> {agent.matricNumber}
          </span>
        </div>

        {agent.idDocPath ? (
          signedUrl ? (
            <a
              href={signedUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00452E] hover:underline"
            >
              <Eye size={14} variant="TwoTone" /> Open student ID
            </a>
          ) : (
            <button
              onClick={viewId}
              disabled={loadingDoc}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00452E] hover:underline disabled:opacity-50"
            >
              <Eye size={14} variant="TwoTone" />{" "}
              {loadingDoc ? "Loading…" : "View student ID"}
            </button>
          )
        ) : (
          <p className="mt-3 text-xs font-medium text-[#9CA3AF]">
            No document uploaded yet.
          </p>
        )}
      </div>

      {agent.status === "submitted" && (
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide(false)}
            disabled={deciding}
            aria-label="Reject agent"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#FECACA] text-[#DC2626] transition-colors hover:bg-[#FEE2E2] disabled:opacity-50"
          >
            <CloseCircle size={18} variant="TwoTone" />
          </button>
          <PrimaryButton
            fullWidth={false}
            loading={deciding}
            onClick={() => decide(true)}
          >
            <TickCircle size={16} variant="Bold" /> Approve
          </PrimaryButton>
        </div>
      )}
    </Card>
  );
}

/** Admin: review and approve/reject delivery agents who've submitted an ID. */
export default function AdminDashboard() {
  const [tab, setTab] = React.useState<VerificationStatus | "all">("submitted");
  const [agents, setAgents] = React.useState<PendingAgent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lockedOrders, setLockedOrders] = React.useState<LockedOrder[]>([]);

  const load = React.useCallback(async () => {
    const supabase = createClient();
    let query = supabase.from("delivery_agents").select(SELECT);
    if (tab !== "all") query = query.eq("verification_status", tab);

    const { data, error: loadError } = await query.order("id", {
      ascending: false,
    });

    if (loadError) {
      setError(loadError.message);
      return;
    }
    setAgents(((data ?? []) as unknown as RawAgentRow[]).map(toPendingAgent));
  }, [tab]);

  const loadLockedOrders = React.useCallback(async () => {
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("orders")
      .select(LOCKED_SELECT)
      .eq("pin_locked", true);

    if (loadError) {
      setError(loadError.message);
      return;
    }
    setLockedOrders(
      ((data ?? []) as unknown as RawLockedOrderRow[]).map(toLockedOrder),
    );
  }, []);

  React.useEffect(() => {
    let active = true;
    (async () => {
      await Promise.all([load(), loadLockedOrders()]);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [load, loadLockedOrders]);

  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-delivery-agents")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "delivery_agents" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-locked-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => loadLockedOrders(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadLockedOrders]);

  async function handleDecide(agentId: string, approved: boolean) {
    setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("approve_agent", {
      p_agent_id: agentId,
      p_approved: approved,
    });
    if (rpcError) setError(rpcError.message);
    await load();
  }

  async function handleUnlock(orderId: string) {
    setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("unlock_order_pin", {
      p_order_id: orderId,
    });
    if (rpcError) setError(rpcError.message);
    await loadLockedOrders();
  }

  return (
    <div>
      <DashboardHeader
        title="Agent approvals"
        subtitle="Review uploaded student IDs and verify delivery agents."
      />

      {error && (
        <p className="mb-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="mb-6 flex gap-1 rounded-2xl bg-[#00452E]/[0.04] p-1 sm:inline-flex">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={
              "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 " +
              (tab === t.value
                ? "bg-[#00452E] text-white shadow-sm"
                : "text-[#666666] hover:text-[#00452E]")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : agents.length > 0 ? (
        <div className="flex flex-col gap-4">
          {agents.map((agent) => (
            <AgentRow key={agent.id} agent={agent} onDecide={handleDecide} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ShieldTick size={28} variant="TwoTone" />}
          title="Nothing here"
          description="No agents match this filter right now."
        />
      )}

      {lockedOrders.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
            Locked deliveries
          </h2>
          <div className="flex flex-col gap-4">
            {lockedOrders.map((order) => (
              <LockedOrderRow
                key={order.id}
                order={order}
                onUnlock={handleUnlock}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
