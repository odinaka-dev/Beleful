"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sms } from "iconsax-reactjs";
import { BelefulImages } from "@/constant/image";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { signInWithRole } from "@/lib/auth/sign-in";
import { ROLE_DASHBOARD_PATH } from "@/lib/auth/roles";
import { toaster } from "@/components/ui/toaster";

/**
 * Admin sign in. No registration flow exists for this role on purpose —
 * admin accounts are provisioned directly in Supabase, never self-service.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signInWithRole(
      form.email,
      form.password,
      "ADMIN",
    );

    if (signInError) {
      setError(signInError);
      toaster.create({
        title: "Couldn't sign you in",
        description: signInError,
        type: "error",
        duration: 4000,
        closable: true,
      });
      setLoading(false);
      return;
    }

    toaster.create({
      title: "Welcome back!",
      description: "You're signed in. Taking you to the admin dashboard…",
      type: "success",
      duration: 3000,
      closable: true,
    });

    router.push(ROLE_DASHBOARD_PATH.ADMIN);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1F16] px-5 py-12">
      <div className="w-full max-w-sm p-8 bg-white shadow-xl rounded-3xl">
        <div className="flex flex-col items-center text-center mb-7">
          <Image
            src={BelefulImages.logoImage}
            alt="BELEFUL"
            className="mb-4 w-28"
          />
          <h1 className="font-heading text-xl font-bold text-[#111111]">
            Admin access
          </h1>
          <p className="mt-1.5 text-sm text-[#666666]">
            Restricted to BELEFUL team accounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
              {error}
            </p>
          )}

          <FormField
            label="Email"
            type="email"
            placeholder="you@beleful.com"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            leftElement={<Sms size={18} variant="TwoTone" color="#666666" />}
          />

          <PasswordField
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <PrimaryButton type="submit" loading={loading}>
            Sign in
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
