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
import { FileUpload } from "@/components/form/file-upload";
import { AGENT_PROFILE } from "@/helpers/agent.helpers";
import { createClient } from "@/lib/supabase/client";
import { uploadOwnFile } from "@/lib/storage/upload";
import type { Icon } from "iconsax-reactjs";

type ImageStatus = "idle" | "uploading" | "saved" | "error";

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
      if (!userData.user) return;

      const [{ data: profile }, { data: agent }] = await Promise.all([
        supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", userData.user.id)
          .single(),
        supabase
          .from("delivery_agents")
          .select("student_id_image")
          .eq("user_id", userData.user.id)
          .single(),
      ]);

      if (!active) return;
      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);

      if (agent?.student_id_image) {
        const { data: signed } = await supabase.storage
          .from("agent-documents")
          .createSignedUrl(agent.student_id_image, 60 * 10);
        if (active && signed) setIdDocSignedUrl(signed.signedUrl);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
      setIdStatus("error");
      setIdError(error ?? "Upload failed.");
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setIdStatus("error");
      setIdError("You must be signed in.");
      return;
    }
    const { error: updateError } = await supabase
      .from("delivery_agents")
      .update({ student_id_image: data.path })
      .eq("user_id", userData.user.id);

    if (updateError) {
      setIdStatus("error");
      setIdError(updateError.message);
      return;
    }

    const { data: signed } = await supabase.storage
      .from("agent-documents")
      .createSignedUrl(data.path, 60 * 10);
    setIdDocSignedUrl(signed?.signedUrl ?? null);
    setIdStatus("saved");
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
