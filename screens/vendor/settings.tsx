"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/form/form-field";
import { SelectField } from "@/components/form/select-field";
import { FileUpload } from "@/components/form/file-upload";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/utils";
import { SCHOOLS } from "@/helpers/auth.helpers";
import {
  VENDOR_PROFILE,
  OPENING_HOURS,
  type OpeningHour,
} from "@/helpers/vendor.helpers";

/** Vendor profile settings: logo/banner, business details, opening hours. */
export default function VendorSettings() {
  const [profile, setProfile] = React.useState(VENDOR_PROFILE);
  const [hours, setHours] = React.useState<OpeningHour[]>(OPENING_HOURS);

  const set = (key: keyof typeof profile) => (e: { target: { value: string } }) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }));

  function updateHour(index: number, patch: Partial<OpeningHour>) {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, ...patch } : h)),
    );
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    // Mock save — wire to Supabase later.
  }

  return (
    <form onSubmit={save}>
      <DashboardHeader
        title="Profile settings"
        subtitle="Manage how your store appears to students."
        action={<PrimaryButton fullWidth={false} type="submit">Save changes</PrimaryButton>}
      />

      <div className="flex flex-col gap-6">
        {/* Branding */}
        <Card>
          <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
            Branding
          </h2>
          <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            <FileUpload label="Logo" variant="avatar" hint="Square PNG/JPG" />
            <FileUpload
              label="Banner image"
              variant="banner"
              hint="Shown at the top of your store"
            />
          </div>
        </Card>

        {/* Business details */}
        <Card>
          <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
            Business details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Business name"
              value={profile.businessName}
              onChange={set("businessName")}
            />
            <FormField
              label="Vendor name"
              value={profile.vendorName}
              onChange={set("vendorName")}
            />
            <FormField
              label="Email"
              type="email"
              value={profile.email}
              onChange={set("email")}
            />
            <FormField
              label="Phone"
              type="tel"
              value={profile.phone}
              onChange={set("phone")}
            />
            <SelectField
              label="School / Campus"
              options={SCHOOLS}
              value={profile.school}
              onChange={set("school")}
            />
            <FormField
              label="CAC number"
              optional
              value={profile.cac}
              onChange={set("cac")}
            />
            <div className="sm:col-span-2">
              <FormField
                label="Business address"
                value={profile.address}
                onChange={set("address")}
              />
            </div>
          </div>
        </Card>

        {/* Opening hours */}
        <Card>
          <h2 className="mb-4 font-heading text-lg font-bold text-[#111111]">
            Opening hours
          </h2>
          <div className="flex flex-col gap-2">
            {hours.map((h, i) => (
              <div
                key={h.day}
                className="flex flex-col gap-3 rounded-2xl border border-[#00452E]/8 p-3 sm:flex-row sm:items-center"
              >
                <span className="w-28 text-sm font-semibold text-[#111111]">
                  {h.day}
                </span>

                <button
                  type="button"
                  onClick={() => updateHour(i, { closed: !h.closed })}
                  className={cn(
                    "w-fit rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    h.closed
                      ? "bg-[#FEE2E2] text-[#DC2626]"
                      : "bg-[#00452E]/8 text-[#00452E]",
                  )}
                >
                  {h.closed ? "Closed" : "Open"}
                </button>

                {!h.closed && (
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => updateHour(i, { open: e.target.value })}
                      className="rounded-xl border border-[#00452E]/15 bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#00452E]"
                    />
                    <span className="text-[#666666]">—</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => updateHour(i, { close: e.target.value })}
                      className="rounded-xl border border-[#00452E]/15 bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#00452E]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </form>
  );
}
