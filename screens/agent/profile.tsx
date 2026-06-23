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
} from "iconsax-reactjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { FileUpload } from "@/components/form/file-upload";
import type { AgentProfile, VerificationStatus } from "@/helpers/agent.helpers";
import { createClient } from "@/lib/supabase/client";
import { uploadOwnFile } from "@/lib/storage/upload";
import { toaster } from "@/components/ui/toaster";
import type { Icon } from "iconsax-reactjs";

type ImageStatus = "idle" | "uploading" | "saved" | "error";

interface RawProfileRow {
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  schools: { name: string } | null;
  created_at: string | null;
}

interface RawAgentRow {
  hostel: string | null;
  matric_number: string | null;
  verification_status: string | null;
  total_deliveries: number | null;
  rating: number | null;
}

function normalizeStatus(status: string | null): VerificationStatus {
  return status === "verified" || status === "submitted" ? status : "pending";
}

function toAgentProfile(profile: RawProfileRow, agent: RawAgentRow): AgentProfile {
  const verificationStatus = normalizeStatus(agent.verification_status);
  return {
    name: profile.full_name ?? "Agent",
    email: profile.email ?? "",
    phone: profile.phone_number ?? "",
    school: profile.schools?.name ?? "",
    studentId: agent.matric_number ?? "",
    hostel: agent.hostel ?? "",
    verified: verificationStatus === "verified",
    verificationStatus,
    joined: profile.created_at
      ? new Date(profile.created_at).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "",
    stats: {
      totalDeliveries: agent.total_deliveries ?? 0,
      rating: Number(agent.rating ?? 0),
    },
  };
}

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
  const [profile, setProfile] = React.useState<AgentProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [editing, setEditing] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [idDocSignedUrl, setIdDocSignedUrl] = React.useState<string | null>(
    null,
  );
  const [avatarStatus, setAvatarStatus] = React.useState<ImageStatus>("idle");
  const [idStatus, setIdStatus] = React.useState<ImageStatus>("idle");
  const [avatarError, setAvatarError] = React.useState<string | null>(null);
  const [idError, setIdError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (active) setLoading(false);
        return;
      }

      const [{ data: rawProfile }, { data: rawAgent }] = await Promise.all([
        supabase
          .from("profiles")
          .select("avatar_url, full_name, email, phone_number, created_at, schools(name)")
          .eq("id", userData.user.id)
          .single(),
        supabase
          .from("delivery_agents")
          .select(
            "student_id_image, hostel, matric_number, verification_status, total_deliveries, rating",
          )
          .eq("user_id", userData.user.id)
          .single(),
      ]);

      if (!active) return;
      if (!rawProfile || !rawAgent) {
        setError("No agent profile found for this account.");
        setLoading(false);
        return;
      }

      setProfile(toAgentProfile(rawProfile, rawAgent));
      if (rawProfile.avatar_url) setAvatarUrl(rawProfile.avatar_url);

      if (rawAgent.student_id_image) {
        const { data: signed } = await supabase.storage
          .from("agent-documents")
          .createSignedUrl(rawAgent.student_id_image, 60 * 10);
        if (active && signed) setIdDocSignedUrl(signed.signedUrl);
      } else if (rawAgent.verification_status !== "verified") {
        // No ID on file yet and not verified — open the upload panel so a
        // newly-registered agent sees it immediately, with no extra click.
        setEditing(true);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <DashboardHeader title="Profile" subtitle="Your agent account details." />
        <div className="h-64 animate-pulse rounded-3xl bg-[#00452E]/5" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <DashboardHeader title="Profile" subtitle="Your agent account details." />
        <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
          {error ?? "Profile unavailable."}
        </p>
      </div>
    );
  }

  const p = profile;
  const initials = p.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  async function handleAvatarChange(file: File | null) {
    if (!file) return;
    setAvatarStatus("uploading");
    setAvatarError(null);

    const { data, error } = await uploadOwnFile("avatars", file, "AVATAR");
    if (error || !data) {
      setAvatarStatus("error");
      setAvatarError(error ?? "Upload failed.");
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setAvatarStatus("error");
      setAvatarError("You must be signed in.");
      return;
    }
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", userData.user.id);

    if (updateError) {
      setAvatarStatus("error");
      setAvatarError(updateError.message);
      return;
    }

    setAvatarUrl(data.publicUrl);
    setAvatarStatus("saved");
  }

  async function handleIdChange(file: File | null) {
    if (!file) return;
    setIdStatus("uploading");
    setIdError(null);

    const { data, error } = await uploadOwnFile("agent-documents", file, "DOCUMENT");
    if (error || !data) {
      const message = error ?? "Upload failed.";
      setIdStatus("error");
      setIdError(message);
      toaster.create({ title: "ID upload failed", description: message, type: "error", duration: 4000, closable: true });
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setIdStatus("error");
      setIdError("You must be signed in.");
      return;
    }
    // Uploading flags the agent for review — unless they're already
    // verified, in which case a re-upload shouldn't reset their status.
    const nextStatus = p.verificationStatus === "verified" ? "verified" : "submitted";
    const { error: updateError } = await supabase
      .from("delivery_agents")
      .update({ student_id_image: data.path, verification_status: nextStatus })
      .eq("user_id", userData.user.id);

    if (updateError) {
      setIdStatus("error");
      setIdError(updateError.message);
      toaster.create({ title: "ID upload failed", description: updateError.message, type: "error", duration: 4000, closable: true });
      return;
    }

    const { data: signed } = await supabase.storage
      .from("agent-documents")
      .createSignedUrl(data.path, 60 * 10);
    setIdDocSignedUrl(signed?.signedUrl ?? null);
    setIdStatus("saved");
    toaster.create({ title: "Student ID uploaded", description: "Our team will review it within 24 hours.", type: "success", duration: 3500, closable: true });
    setProfile((prev) =>
      prev ? { ...prev, verificationStatus: nextStatus, verified: nextStatus === "verified" } : prev,
    );
  }

  return (
    <div>
      <DashboardHeader title="Profile" subtitle="Your agent account details." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        {/* Identity + verification */}
        <Card className="flex flex-col items-center text-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={p.name}
              className="h-24 w-24 rounded-3xl object-cover"
            />
          ) : (
            <span className="grid h-24 w-24 place-items-center rounded-3xl bg-[#00452E] font-heading text-3xl font-bold text-white">
              {initials}
            </span>
          )}
          <h2 className="mt-4 font-heading text-xl font-bold text-[#111111]">
            {p.name}
          </h2>
          <p className="text-sm text-[#666666]">Delivery Agent · {p.school}</p>

          <div className="mt-4">
            {p.verificationStatus === "verified" ? (
              <StatusBadge tone="success" dot>
                <ShieldTick size={14} variant="Bold" /> Verified agent
              </StatusBadge>
            ) : p.verificationStatus === "submitted" ? (
              <StatusBadge tone="info" dot>
                Submitted — under review
              </StatusBadge>
            ) : (
              <StatusBadge tone="pending" dot>
                Upload your ID to get verified
              </StatusBadge>
            )}
          </div>

          <div className="mt-5 flex w-full items-center justify-between rounded-2xl bg-[#00452E]/[0.03] px-4 py-3 text-sm">
            <span className="text-[#666666]">Member since</span>
            <span className="font-semibold text-[#111111]">{p.joined}</span>
          </div>

          <PrimaryButton
            variant="outline"
            className="mt-5"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Close" : "Edit profile"}
          </PrimaryButton>

          {editing && (
            <div className="mt-5 grid w-full gap-5 text-left">
              <div>
                <FileUpload
                  label="Profile photo"
                  variant="avatar"
                  hint="Clear, recent photo of you"
                  initialPreviewUrl={avatarUrl}
                  onFileChange={handleAvatarChange}
                />
                {avatarStatus === "uploading" && (
                  <p className="mt-1.5 text-xs font-medium text-[#666666]">
                    Uploading…
                  </p>
                )}
                {avatarStatus === "saved" && (
                  <p className="mt-1.5 text-xs font-medium text-[#00452E]">
                    Saved
                  </p>
                )}
                {avatarStatus === "error" && (
                  <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                    {avatarError}
                  </p>
                )}
              </div>

              <div>
                <FileUpload
                  label="Student ID card"
                  variant="document"
                  hint="Only you and BELEFUL admins can view this"
                  initialPreviewUrl={idDocSignedUrl}
                  onFileChange={handleIdChange}
                />
                {idStatus === "uploading" && (
                  <p className="mt-1.5 text-xs font-medium text-[#666666]">
                    Uploading…
                  </p>
                )}
                {idStatus === "saved" && (
                  <p className="mt-1.5 text-xs font-medium text-[#00452E]">
                    Saved
                  </p>
                )}
                {idStatus === "error" && (
                  <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                    {idError}
                  </p>
                )}
              </div>
            </div>
          )}
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
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
