"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/form/form-field";
import { SelectField } from "@/components/form/select-field";
import { FileUpload } from "@/components/form/file-upload";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SCHOOLS, HOSTELS } from "@/helpers/auth.helpers";
import { createClient } from "@/lib/supabase/client";
import { uploadOwnFile } from "@/lib/storage/upload";

type ImageStatus = "idle" | "uploading" | "saved" | "error";
type SaveStatus = "idle" | "saving" | "saved" | "error";

interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  hostel: string;
}

const EMPTY_PROFILE: StudentProfile = {
  fullName: "",
  email: "",
  phone: "",
  school: "",
  hostel: "",
};

function ProfileSkeleton() {
  return (
    <Card>
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/** Student profile: avatar, contact details, school/hostel. */
export default function ProfilePage() {
  const [profile, setProfile] = React.useState<StudentProfile>(EMPTY_PROFILE);
  const [originalEmail, setOriginalEmail] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [avatarStatus, setAvatarStatus] = React.useState<ImageStatus>("idle");
  const [avatarError, setAvatarError] = React.useState<string | null>(null);

  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveNote, setSaveNote] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, email, phone_number, school, hostel, avatar_url")
          .eq("id", userData.user.id)
          .single();

        if (!active || !prof) return;

        setProfile({
          fullName: prof.full_name ?? "",
          email: prof.email ?? "",
          phone: prof.phone_number ?? "",
          school: prof.school ?? "",
          hostel: prof.hostel ?? "",
        });
        setOriginalEmail(prof.email ?? "");
        setAvatarUrl(prof.avatar_url);
      } finally {
        if (active) setLoading(false);
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

  const set = (key: keyof StudentProfile) => (e: { target: { value: string } }) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }));

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

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: profile.fullName,
        phone_number: profile.phone,
        school: profile.school,
        hostel: profile.hostel,
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111]">Profile</h1>
          <p className="text-sm text-[#666666]">Manage your account details.</p>
        </div>
        <PrimaryButton
          fullWidth={false}
          type="submit"
          loading={saveStatus === "saving"}
          disabled={loading}
        >
          Save changes
        </PrimaryButton>
      </div>

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
        <ProfileSkeleton />
      ) : (
        <Card>
          <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
            <div>
              <FileUpload
                label="Photo"
                variant="avatar"
                hint="Square PNG/JPG"
                initialPreviewUrl={avatarUrl}
                onFileChange={handleAvatarChange}
              />
              {avatarStatus === "uploading" && (
                <p className="mt-1.5 text-xs font-medium text-[#666666]">Uploading…</p>
              )}
              {avatarStatus === "saved" && (
                <p className="mt-1.5 text-xs font-medium text-[#00452E]">Saved</p>
              )}
              {avatarStatus === "error" && (
                <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{avatarError}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" value={profile.fullName} onChange={set("fullName")} />
              <FormField
                label="Email"
                type="email"
                value={profile.email}
                onChange={set("email")}
              />
              <FormField
                label="Phone number"
                type="tel"
                value={profile.phone}
                onChange={set("phone")}
              />
              <SelectField
                label="School"
                options={SCHOOLS}
                value={profile.school}
                onChange={set("school")}
              />
              <SelectField
                label="Hostel / Residence"
                options={HOSTELS}
                value={profile.hostel}
                onChange={set("hostel")}
              />
            </div>
          </div>
        </Card>
      )}
    </form>
  );
}
