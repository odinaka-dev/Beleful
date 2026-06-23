"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/form/form-field";
import { FileUpload } from "@/components/form/file-upload";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/utils";
import { OPENING_HOURS, type OpeningHour } from "@/helpers/vendor.helpers";
import { createClient } from "@/lib/supabase/client";
import { uploadOwnFile } from "@/lib/storage/upload";
import type { Json } from "@/lib/supabase/database.types";

type ImageStatus = "idle" | "uploading" | "saved" | "error";
type SaveStatus = "idle" | "saving" | "saved" | "error";

interface VendorSettingsProfile {
  businessName: string;
  vendorName: string;
  email: string;
  phone: string;
  school: string;
  address: string;
  cac: string;
}

const EMPTY_PROFILE: VendorSettingsProfile = {
  businessName: "",
  vendorName: "",
  email: "",
  phone: "",
  school: "",
  address: "",
  cac: "",
};

/** Loading placeholder matching the settings form's three sections. */
function VendorSettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
          <Skeleton className="h-28 w-28 rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </Card>

      <Card>
        <Skeleton className="mb-4 h-5 w-36" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </Card>

      <Card>
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-[#00452E]/8 p-3"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <div className="ml-auto flex items-center gap-2">
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/** Vendor profile settings: logo/banner, business details, opening hours. */
export default function VendorSettings() {
  const [profile, setProfile] = React.useState<VendorSettingsProfile>(EMPTY_PROFILE);
  const [originalEmail, setOriginalEmail] = React.useState("");
  const [hours, setHours] = React.useState<OpeningHour[]>(OPENING_HOURS);

  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(null);
  const [logoStatus, setLogoStatus] = React.useState<ImageStatus>("idle");
  const [bannerStatus, setBannerStatus] = React.useState<ImageStatus>("idle");
  const [logoError, setLogoError] = React.useState<string | null>(null);
  const [bannerError, setBannerError] = React.useState<string | null>(null);

  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveNote, setSaveNote] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(true);

  // Load the vendor's current data so the form reflects what's actually
  // saved, not mock placeholders.
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const [{ data: vendor }, { data: prof }] = await Promise.all([
          supabase
            .from("vendors")
            .select("logo, banner_image, business_name, address, cac_number, opening_hours")
            .eq("user_id", userData.user.id)
            .single(),
          supabase
            .from("profiles")
            .select("full_name, email, phone_number, schools(name)")
            .eq("id", userData.user.id)
            .single(),
        ]);

        if (!active) return;

        if (vendor) {
          setLogoUrl(vendor.logo);
          setBannerUrl(vendor.banner_image);
          setHours(
            (vendor.opening_hours as unknown as OpeningHour[] | null) ?? OPENING_HOURS,
          );
          setProfile((p) => ({
            ...p,
            businessName: vendor.business_name ?? "",
            address: vendor.address ?? "",
            cac: vendor.cac_number ?? "",
          }));
        }

        if (prof) {
          setProfile((p) => ({
            ...p,
            vendorName: prof.full_name ?? "",
            email: prof.email ?? "",
            phone: prof.phone_number ?? "",
            school: prof.schools?.name ?? "",
          }));
          setOriginalEmail(prof.email ?? "");
        }
      } finally {
        if (active) setLoading(false);
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

    const { data, error } = await uploadOwnFile("vendor-media", file, "AVATAR");
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

    const { data, error } = await uploadOwnFile("vendor-media", file, "WIDE_PHOTO");
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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("saving");
    setSaveError(null);
    setSaveNote(null);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setSaveStatus("error");
      setSaveError("You must be signed in.");
      return;
    }

    const { error: vendorError } = await supabase
      .from("vendors")
      .update({
        business_name: profile.businessName,
        address: profile.address,
        cac_number: profile.cac || null,
        opening_hours: hours as unknown as Json,
      })
      .eq("user_id", userData.user.id);

    if (vendorError) {
      setSaveStatus("error");
      setSaveError(vendorError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: profile.vendorName,
        phone_number: profile.phone,
      })
      .eq("id", userData.user.id);

    if (profileError) {
      setSaveStatus("error");
      setSaveError(profileError.message);
      return;
    }

    if (profile.email && profile.email !== originalEmail) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: profile.email,
      });
      if (emailError) {
        setSaveStatus("error");
        setSaveError(emailError.message);
        return;
      }
      setSaveNote(
        "Confirmation link sent to your new email — your login email won't change until you confirm it.",
      );
    }

    setSaveStatus("saved");
  }

  return (
    <form onSubmit={save}>
      <DashboardHeader
        title="Profile settings"
        subtitle="Manage how your store appears to students."
        action={
          <PrimaryButton
            fullWidth={false}
            type="submit"
            loading={saveStatus === "saving"}
            disabled={loading}
          >
            Save changes
          </PrimaryButton>
        }
      />

      {saveStatus === "saved" && (
        <p className="mb-4 rounded-xl bg-[#00452E]/[0.06] px-4 py-3 text-sm font-medium text-[#00452E]">
          Saved.
        </p>
      )}
      {saveNote && (
        <p className="mb-4 rounded-xl bg-[#FFFFDE] px-4 py-3 text-sm font-medium text-[#7A5C00]">
          {saveNote}
        </p>
      )}
      {saveStatus === "error" && (
        <p className="mb-4 rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {saveError}
        </p>
      )}

      {loading ? (
        <VendorSettingsSkeleton />
      ) : (
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
            <FormField
              label="School / Campus"
              value={profile.school}
              readOnly
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
      )}
    </form>
  );
}
