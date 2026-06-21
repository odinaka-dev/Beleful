"use client";

import * as React from "react";
import {
  ShieldTick,
  Sms,
  Call,
  Buildings,
  Card as CardIcon,
  House,
  Box1,
  Star1,
  TickCircle,
  Clock,
} from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { AGENT_PROFILE } from "@/helpers/agent.helpers";
import type { Icon } from "iconsax-reactjs";

function InfoRow({
  icon: RowIcon,
  label,
  value,
}: {
  icon: Icon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#00452E]/5 text-[#00452E]">
        <RowIcon size={18} variant="TwoTone" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#666666]">{label}</p>
        <p className="truncate text-sm font-semibold text-[#111111]">{value}</p>
      </div>
    </div>
  );
}

function StatBox({
  icon: BoxIcon,
  label,
  value,
}: {
  icon: Icon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#00452E]/10 bg-white p-4 text-center">
      <span className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-[#00452E]/5 text-[#00452E]">
        <BoxIcon size={20} variant="Bold" />
      </span>
      <p className="font-heading text-xl font-bold text-[#111111]">{value}</p>
      <p className="text-xs text-[#666666]">{label}</p>
    </div>
  );
}

/** Agent profile: verification status, student info, delivery statistics. */
export default function AgentProfile() {
  const p = AGENT_PROFILE;
  const initials = p.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div>
      <DashboardHeader title="Profile" subtitle="Your agent account details." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        {/* Identity + verification */}
        <Card className="flex flex-col items-center text-center">
          <span className="grid h-24 w-24 place-items-center rounded-3xl bg-[#00452E] font-heading text-3xl font-bold text-white">
            {initials}
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold text-[#111111]">
            {p.name}
          </h2>
          <p className="text-sm text-[#666666]">Delivery Agent · {p.school}</p>

          <div className="mt-4">
            <StatusBadge tone={p.verified ? "success" : "pending"} dot>
              {p.verified ? (
                <>
                  <ShieldTick size={14} variant="Bold" /> Verified agent
                </>
              ) : (
                "Verification pending"
              )}
            </StatusBadge>
          </div>

          <div className="mt-5 flex w-full items-center justify-between rounded-2xl bg-[#00452E]/[0.03] px-4 py-3 text-sm">
            <span className="text-[#666666]">Member since</span>
            <span className="font-semibold text-[#111111]">{p.joined}</span>
          </div>

          <PrimaryButton variant="outline" className="mt-5">
            Edit profile
          </PrimaryButton>
        </Card>

        <div className="flex flex-col gap-6">
          {/* Student information */}
          <Card>
            <h3 className="mb-2 font-heading text-lg font-bold text-[#111111]">
              Student information
            </h3>
            <div className="grid divide-y divide-[#00452E]/8 sm:grid-cols-2 sm:gap-x-6 sm:divide-y-0">
              <InfoRow icon={Sms} label="Email" value={p.email} />
              <InfoRow icon={Call} label="Phone" value={p.phone} />
              <InfoRow icon={Buildings} label="School" value={p.school} />
              <InfoRow icon={CardIcon} label="Student ID" value={p.studentId} />
              <InfoRow icon={House} label="Hostel" value={p.hostel} />
            </div>
          </Card>

          {/* Delivery statistics */}
          <Card>
            <h3 className="mb-4 font-heading text-lg font-bold text-[#111111]">
              Delivery statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox
                icon={Box1}
                label="Deliveries"
                value={String(p.stats.totalDeliveries)}
              />
              <StatBox
                icon={Star1}
                label="Rating"
                value={p.stats.rating.toFixed(1)}
              />
              <StatBox
                icon={TickCircle}
                label="Acceptance"
                value={`${p.stats.acceptanceRate}%`}
              />
              <StatBox
                icon={Clock}
                label="On-time"
                value={`${p.stats.onTimeRate}%`}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
