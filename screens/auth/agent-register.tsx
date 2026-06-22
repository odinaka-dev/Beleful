"use client";

import { useState } from "react";
import Link from "next/link";
import { Sms, User, Call, Card as CardIcon, ShieldTick } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { SelectField } from "@/components/form/select-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CheckEmailNotice } from "@/components/auth/check-email-notice";
import { SCHOOLS, HOSTELS } from "@/helpers/auth.helpers";
import { signUpWithRole } from "@/lib/auth/sign-up";

interface AgentForm {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  studentId: string;
  hostel: string;
  password: string;
}

const EMPTY: AgentForm = {
  fullName: "",
  email: "",
  phone: "",
  school: "",
  studentId: "",
  hostel: "",
  password: "",
};

/** Delivery agent registration. */
export default function AgentRegisterPage() {
  const [form, setForm] = useState<AgentForm>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof AgentForm) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUpWithRole(
      form.email,
      form.password,
      "DELIVERY_AGENT",
      {
        full_name: form.fullName,
        phone_number: form.phone,
        school: form.school,
        hostel: form.hostel,
        matric_number: form.studentId,
      },
    );

    setLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    setSubmitted(true);
  }

  return (
    <AuthShell
      role="agent"
      title="Become a delivery agent"
      subtitle="Deliver between classes and earn on your schedule."
      footer={
        <>
          Already an agent?{" "}
          <Link
            href="/agent/login"
            className="font-semibold text-[#00452E] hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      {submitted ? (
        <CheckEmailNotice email={form.email} />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
              {error}
            </p>
          )}

          {/* Verification notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-[#FCD882]/60 bg-[#FFFFDE] p-4">
            <span className="mt-0.5 text-[#00452E]">
              <ShieldTick size={22} variant="Bold" />
            </span>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm font-semibold text-[#111111]">
                  Verification required
                </p>
                <StatusBadge tone="pending" dot>
                  Pending review
                </StatusBadge>
              </div>
              <p className="text-xs leading-relaxed text-[#666666]">
                After you confirm your email and sign in, upload a valid
                Student ID from your dashboard. Our team reviews new agents
                within 24 hours before you can accept deliveries.
              </p>
            </div>
          </div>

          <FormField
            label="Full name"
            placeholder="Ada Okeke"
            autoComplete="name"
            required
            value={form.fullName}
            onChange={set("fullName")}
            leftElement={<User size={18} variant="TwoTone" color="#666666" />}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Email"
              type="email"
              placeholder="you@student.edu"
              required
              value={form.email}
              onChange={set("email")}
              leftElement={<Sms size={18} variant="TwoTone" color="#666666" />}
            />
            <FormField
              label="Phone number"
              type="tel"
              placeholder="080 1234 5678"
              required
              value={form.phone}
              onChange={set("phone")}
              leftElement={<Call size={18} variant="TwoTone" color="#666666" />}
            />
          </div>

          <SelectField
            label="School"
            options={SCHOOLS}
            placeholder="Select your school"
            required
            value={form.school}
            onChange={set("school")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Student ID number"
              placeholder="STU/2024/0456"
              required
              value={form.studentId}
              onChange={set("studentId")}
              leftElement={
                <CardIcon size={18} variant="TwoTone" color="#666666" />
              }
            />
            <SelectField
              label="Hostel"
              options={HOSTELS}
              placeholder="Select residence"
              required
              value={form.hostel}
              onChange={set("hostel")}
            />
          </div>

          <PasswordField
            showStrength
            placeholder="Create a password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={set("password")}
          />

          <PrimaryButton type="submit" loading={loading}>
            Create account
          </PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
}
