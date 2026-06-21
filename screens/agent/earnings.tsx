"use client";

import { MoneyRecive, Wallet3, Clock, MoneySend } from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  EARNINGS_SUMMARY,
  EARNINGS_HISTORY,
  formatNaira,
  type EarningRow,
} from "@/helpers/agent.helpers";

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

/** Agent earnings: totals, wallet, pending, transactions table, withdraw. */
export default function AgentEarnings() {
  return (
    <div>
      <DashboardHeader
        title="Earnings"
        subtitle="Track your delivery income and withdrawals."
        action={
          <PrimaryButton fullWidth={false}>
            <MoneySend size={18} variant="Bold" /> Withdraw funds
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total earnings"
          value={formatNaira(EARNINGS_SUMMARY.total)}
          icon={<MoneyRecive size={20} variant="Bold" />}
        />
        <StatCard
          label="Wallet balance"
          value={formatNaira(EARNINGS_SUMMARY.walletBalance)}
          icon={<Wallet3 size={20} variant="Bold" />}
        />
        <StatCard
          label="Pending earnings"
          value={formatNaira(EARNINGS_SUMMARY.pending)}
          icon={<Clock size={20} variant="Bold" />}
        />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
          Transaction history
        </h2>
        <DataTable
          columns={COLUMNS}
          data={EARNINGS_HISTORY}
          rowKey={(row) => row.id}
        />
      </section>
    </div>
  );
}
