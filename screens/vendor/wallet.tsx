"use client";

import { MoneyRecive, Wallet3, Clock, MoneySend } from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/utils";
import {
  VENDOR_WALLET,
  VENDOR_TXNS,
  formatNaira,
  type VendorTxn,
} from "@/helpers/vendor.helpers";

const COLUMNS: Column<VendorTxn>[] = [
  { key: "date", header: "Date" },
  {
    key: "reference",
    header: "Reference",
    render: (row) => <span className="font-semibold">{row.reference}</span>,
  },
  { key: "type", header: "Type" },
  {
    key: "amount",
    header: "Amount",
    render: (row) => (
      <span
        className={cn(
          "font-semibold",
          row.amount < 0 ? "text-[#DC2626]" : "text-[#00452E]",
        )}
      >
        {row.amount < 0 ? "-" : "+"}
        {formatNaira(Math.abs(row.amount))}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "right",
    render: (row) => (
      <StatusBadge tone={row.status === "Completed" ? "success" : "pending"} dot>
        {row.status}
      </StatusBadge>
    ),
  },
];

/** Vendor wallet: revenue/balance/settlement, transactions, withdraw. */
export default function VendorWallet() {
  return (
    <div>
      <DashboardHeader
        title="Wallet"
        subtitle="Your earnings and settlements."
        action={
          <PrimaryButton fullWidth={false}>
            <MoneySend size={18} variant="Bold" /> Withdraw
          </PrimaryButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Highlighted available balance */}
        <Card className="bg-[#00452E] text-white lg:col-span-1">
          <div className="flex items-center gap-2 text-white/70">
            <Wallet3 size={18} variant="Bold" />
            <span className="text-sm font-medium">Available balance</span>
          </div>
          <p className="mt-3 font-heading text-3xl font-bold">
            {formatNaira(VENDOR_WALLET.availableBalance)}
          </p>
          <p className="mt-1 text-xs text-white/60">
            Ready to withdraw to your bank
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <Card className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#666666]">
              <MoneyRecive size={18} variant="Bold" />
              <span className="text-sm font-medium">Total revenue</span>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-[#111111]">
              {formatNaira(VENDOR_WALLET.totalRevenue)}
            </p>
          </Card>
          <Card className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#666666]">
              <Clock size={18} variant="Bold" />
              <span className="text-sm font-medium">Pending settlement</span>
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-[#111111]">
              {formatNaira(VENDOR_WALLET.pendingSettlement)}
            </p>
          </Card>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
          Transactions
        </h2>
        <DataTable
          columns={COLUMNS}
          data={VENDOR_TXNS}
          rowKey={(row) => row.id}
        />
      </section>
    </div>
  );
}
