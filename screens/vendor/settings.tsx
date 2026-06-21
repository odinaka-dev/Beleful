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
import { createClient } from "@/lib/supabase/client";
import { uploadOwnFile } from "@/lib/storage/upload";

type ImageStatus = "idle" | "uploading" | "saved" | "error";

/** Vendor profile settings: logo/banner, business details, opening hours. */
export default function VendorSettings() {
  const [profile, setProfile] = React.useState(VENDOR_PROFILE);
  const [hours, setHours] = React.useState<OpeningHour[]>(OPENING_HOURS);

  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(null);
  const [logoStatus, setLogoStatus] = React.useState<ImageStatus>("idle");
  const [bannerStatus, setBannerStatus] = React.useState<ImageStatus>("idle");
  const [logoError, setLogoError] = React.useState<string | null>(null);
  const [bannerError, setBannerError] = React.useState<string | null>(null);

  // Load the vendor's current logo/banner so the upload controls show what's
  // already saved, not a blank state. Business details/opening hours stay on
  // mock data for now — that's the next pass (full vendor dashboard wiring).
  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: vendor } = await supabase
        .from("vendors")
        .select("logo, banner_image")
        .eq("user_id", userData.user.id)
        .single();

      if (active && vendor) {
        setLogoUrl(vendor.logo);
        setBannerUrl(vendor.banner_image);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleLogoChange(file: File | null) {
    if (!file) return;
    setLogoStatus("uploading");
    setLogoError(null);

    const { data, error } = await uploadOwnFile("vendor-media", file);
    if (error || !data) {
      setLogoStatus("error");
      setLogoError(error ?? "Upload failed.");
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLogoStatus("error");
      setLogoError("You must be signed in.");
      return;
    }
    const { error: updateError } = await supabase
      .from("vendors")
      .update({ logo: data.publicUrl })
      .eq("user_id", userData.user.id);

    if (updateError) {
      setLogoStatus("error");
      setLogoError(updateError.message);
      return;
    }

    setLogoUrl(data.publicUrl);
    setLogoStatus("saved");
  }

  async function handleBannerChange(file: File | null) {
    if (!file) return;
    setBannerStatus("uploading");
    setBannerError(null);

    const { data, error } = await uploadOwnFile("vendor-media", file);
    if (error || !data) {
      setBannerStatus("error");
      setBannerError(error ?? "Upload failed.");
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setBannerStatus("error");
      setBannerError("You must be signed in.");
      return;
    }
    const { error: updateError } = await supabase
      .from("vendors")
      .update({ banner_image: data.publicUrl })
      .eq("user_id", userData.user.id);

    if (updateError) {
      setBannerStatus("error");
      setBannerError(updateError.message);
      return;
    }

    setBannerUrl(data.publicUrl);
    setBannerStatus("saved");
  }

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
            <div>
              <FileUpload
                label="Logo"
                variant="avatar"
                hint="Square PNG/JPG"
                initialPreviewUrl={logoUrl}
                onFileChange={handleLogoChange}
              />
              {logoStatus === "uploading" && (
                <p className="mt-1.5 text-xs font-medium text-[#666666]">
                  Uploading…
                </p>
              )}
              {logoStatus === "saved" && (
                <p className="mt-1.5 text-xs font-medium text-[#00452E]">
                  Saved
                </p>
              )}
              {logoStatus === "error" && (
                <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                  {logoError}
                </p>
              )}
            </div>
            <div>
              <FileUpload
                label="Banner image"
                variant="banner"
                hint="Shown at the top of your store"
                initialPreviewUrl={bannerUrl}
                onFileChange={handleBannerChange}
              />
              {bannerStatus === "uploading" && (
                <p className="mt-1.5 text-xs font-medium text-[#666666]">
                  Uploading…
                </p>
              )}
              {bannerStatus === "saved" && (
                <p className="mt-1.5 text-xs font-medium text-[#00452E]">
                  Saved
                </p>
              )}
              {bannerStatus === "error" && (
                <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                  {bannerError}
                </p>
              )}
            </div>
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
