"use client";

import * as React from "react";
import { MoneyRecive, Wallet3, Clock, MoneySend } from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TableSkeleton } from "@/components/ui/skeletons";
import {
  formatNaira,
  type EarningRow,
} from "@/helpers/agent.helpers";
import { createClient } from "@/lib/supabase/client";

interface RawEarningRow {
  id: string;
  created_at: string | null;
  delivery_fee: number | null;
  status: string | null;
}

function toEarningRow(row: RawEarningRow): EarningRow {
  return {
    id: row.id,
    date: row.created_at
      ? new Date(row.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    order: row.id.slice(0, 6).toUpperCase(),
    amount: Number(row.delivery_fee ?? 0),
    status: row.status === "completed" ? "Paid" : "Pending",
  };
}

const COLUMNS: Column<EarningRow>[] = [
  { key: "date", header: "Date" },
  {
    key: "order",
    header: "Order",
    render: (row) => <span className="font-semibold">#{row.order}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    render: (row) => formatNaira(row.amount),
  },
  {
    key: "status",
    header: "Status",
    align: "right",
    render: (row) => (
      <StatusBadge tone={row.status === "Paid" ? "success" : "pending"} dot>
        {row.status}
      </StatusBadge>
    ),
  },
];

const EARNINGS_SELECT = "id, created_at, delivery_fee, status";

/** Agent earnings: totals, wallet, pending, transactions table, withdraw. */
export default function AgentEarnings() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<EarningRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [pending, setPending] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (active) setLoading(false);
        return;
      }

      const { data: agent } = await supabase
        .from("delivery_agents")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

      if (!active) return;
      if (!agent) {
        setError("No agent profile found for this account.");
        setLoading(false);
        return;
      }

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(EARNINGS_SELECT)
        .eq("delivery_agent_id", agent.id)
        .in("status", ["completed", "ready"])
        .order("created_at", { ascending: false });

      if (!active) return;
      if (ordersError) {
        setError(ordersError.message);
        setLoading(false);
        return;
      }

      const raw = (data ?? []) as unknown as RawEarningRow[];
      setRows(raw.map(toEarningRow));
      setTotal(
        raw
          .filter((r) => r.status === "completed")
          .reduce((sum, r) => sum + Number(r.delivery_fee ?? 0), 0),
      );
      setPending(
        raw
          .filter((r) => r.status !== "completed")
          .reduce((sum, r) => sum + Number(r.delivery_fee ?? 0), 0),
      );
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <DashboardHeader
        title="Earnings"
        subtitle="Track your delivery income."
        action={
          <PrimaryButton
            fullWidth={false}
            disabled
            title="Withdrawals are coming soon"
          >
            <MoneySend size={18} variant="Bold" /> Withdraw funds
          </PrimaryButton>
        }
      />

      {error && (
        <p className="mb-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total earnings"
          value={formatNaira(total)}
          icon={<MoneyRecive size={20} variant="Bold" />}
        />
        <StatCard
          label="Wallet balance"
          value={formatNaira(total)}
          icon={<Wallet3 size={20} variant="Bold" />}
        />
        <StatCard
          label="Pending earnings"
          value={formatNaira(pending)}
          icon={<Clock size={20} variant="Bold" />}
        />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
          Transaction history
        </h2>
        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <DataTable columns={COLUMNS} data={rows} rowKey={(row) => row.id} />
        )}
      </section>
    </div>
  );
}
