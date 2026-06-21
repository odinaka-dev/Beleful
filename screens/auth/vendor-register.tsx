"use client";

import { useState } from "react";
import Link from "next/link";
import { Sms, User, Call, Shop, Location } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { SelectField } from "@/components/form/select-field";
import { FileUpload } from "@/components/form/file-upload";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CheckEmailNotice } from "@/components/auth/check-email-notice";
import { SCHOOLS } from "@/helpers/auth.helpers";
import { signUpWithRole } from "@/lib/auth/sign-up";

interface VendorForm {
  businessName: string;
  vendorName: string;
  phone: string;
  email: string;
  school: string;
  address: string;
  cac: string;
  password: string;
}

const EMPTY: VendorForm = {
  businessName: "",
  vendorName: "",
  phone: "",
  email: "",
  school: "",
  address: "",
  cac: "",
  password: "",
};

/** Vendor registration. */
export default function VendorRegisterPage() {
  const [form, setForm] = useState<VendorForm>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof VendorForm) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUpWithRole(
      form.email,
      form.password,
      "VENDOR",
      {
        full_name: form.vendorName,
        phone_number: form.phone,
        school: form.school,
        business_name: form.businessName,
        address: form.address,
        cac_number: form.cac,
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
      role="vendor"
      title="Register your business"
      subtitle="Put your kitchen in front of the whole campus."
      footer={
        <>
          Already a vendor?{" "}
          <Link
            href="/vendor/login"
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

        <FormField
          label="Business name"
          placeholder="Mama's Kitchen"
          required
          value={form.businessName}
          onChange={set("businessName")}
          leftElement={<Shop size={18} variant="TwoTone" color="#666666" />}
        />

        <FormField
          label="Vendor name"
          placeholder="Owner / contact name"
          required
          value={form.vendorName}
          onChange={set("vendorName")}
          leftElement={<User size={18} variant="TwoTone" color="#666666" />}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Phone number"
            type="tel"
            placeholder="080 1234 5678"
            required
            value={form.phone}
            onChange={set("phone")}
            leftElement={<Call size={18} variant="TwoTone" color="#666666" />}
          />
          <FormField
            label="Email"
            type="email"
            placeholder="store@business.com"
            required
            value={form.email}
            onChange={set("email")}
            leftElement={<Sms size={18} variant="TwoTone" color="#666666" />}
          />
        </div>

        <SelectField
          label="School / Campus"
          options={SCHOOLS}
          placeholder="Select campus"
          required
          value={form.school}
          onChange={set("school")}
        />

        <FormField
          label="Business address"
          placeholder="Shop 12, Student Union Building"
          required
          value={form.address}
          onChange={set("address")}
          leftElement={<Location size={18} variant="TwoTone" color="#666666" />}
        />

        <FormField
          label="CAC number"
          optional
          placeholder="RC 1234567"
          value={form.cac}
          onChange={set("cac")}
        />

        <PasswordField
          showStrength
          placeholder="Create a password"
          autoComplete="new-password"
          required
          value={form.password}
          onChange={set("password")}
        />

        <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
          <FileUpload
            label="Logo"
            variant="avatar"
            hint="Square, PNG/JPG"
          />
          <FileUpload
            label="Banner image"
            variant="banner"
            hint="Shown at the top of your store"
          />
        </div>

        <PrimaryButton type="submit" loading={loading}>
          Create vendor account
        </PrimaryButton>
      </form>
      )}
    </AuthShell>
  );
}
