"use client";

import { useState } from "react";
import Link from "next/link";
import { Sms, User, Call } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { SelectField } from "@/components/form/select-field";
import { CheckboxField } from "@/components/form/checkbox-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SCHOOLS, HOSTELS } from "@/helpers/auth.helpers";

interface StudentForm {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  hostel: string;
  password: string;
  confirmPassword: string;
}

const EMPTY: StudentForm = {
  fullName: "",
  email: "",
  phone: "",
  school: "",
  hostel: "",
  password: "",
  confirmPassword: "",
};

/** Student signup. */
export default function StudentSignupPage() {
  const [form, setForm] = useState<StudentForm>(EMPTY);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof StudentForm) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const mismatch =
    !!form.confirmPassword && form.password !== form.confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch || !agreed) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  }

  return (
    <AuthShell
      role="student"
      title="Create your account"
      subtitle="Join BELEFUL and get food delivered across campus."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#00452E] hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Full name"
          placeholder="Ada Okeke"
          autoComplete="name"
          required
          value={form.fullName}
          onChange={set("fullName")}
          leftElement={<User size={18} variant="TwoTone" color="#666666" />}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="you@student.edu"
          autoComplete="email"
          required
          value={form.email}
          onChange={set("email")}
          leftElement={<Sms size={18} variant="TwoTone" color="#666666" />}
        />

        <FormField
          label="Phone number"
          type="tel"
          placeholder="080 1234 5678"
          autoComplete="tel"
          required
          value={form.phone}
          onChange={set("phone")}
          leftElement={<Call size={18} variant="TwoTone" color="#666666" />}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="School"
            options={SCHOOLS}
            placeholder="Select your school"
            required
            value={form.school}
            onChange={set("school")}
          />
          <SelectField
            label="Hostel / Residence"
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

        <PasswordField
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={mismatch ? "Passwords do not match" : undefined}
        />

        <CheckboxField checked={agreed} onChange={setAgreed}>
          I agree to BELEFUL&apos;s{" "}
          <Link href="/terms" className="font-semibold text-[#00452E] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-[#00452E] hover:underline">
            Privacy Policy
          </Link>
          .
        </CheckboxField>

        <PrimaryButton type="submit" loading={loading} disabled={!agreed}>
          Continue
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
