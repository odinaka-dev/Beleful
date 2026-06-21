"use client";

import { useState } from "react";
import Link from "next/link";
import { Sms } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Vendor login. */
export default function VendorLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  }

  return (
    <AuthShell
      role="vendor"
      title="Vendor sign in"
      subtitle="Manage your store, menu and orders in one place."
      footer={
        <>
          Don&apos;t have a vendor account?{" "}
          <Link
            href="/vendor/register"
            className="font-semibold text-[#00452E] hover:underline"
          >
            Register your business
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Business email"
          type="email"
          placeholder="store@business.com"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          leftElement={<Sms size={18} variant="TwoTone" color="#666666" />}
        />

        <div>
          <PasswordField
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#00452E] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <PrimaryButton type="submit" loading={loading}>
          Sign in
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
