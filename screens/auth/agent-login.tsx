"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sms } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { signInWithRole } from "@/lib/auth/sign-in";
import { ROLE_DASHBOARD_PATH } from "@/lib/auth/roles";
import { toaster } from "@/components/ui/toaster";

/** Delivery agent login. */
export default function AgentLoginPage() {
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
      "DELIVERY_AGENT",
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
      description: "You're signed in. Taking you to your dashboard…",
      type: "success",
      duration: 3000,
      closable: true,
    });

    router.push(ROLE_DASHBOARD_PATH.DELIVERY_AGENT);
    router.refresh();
  }

  return (
    <AuthShell
      role="agent"
      title="Agent sign in"
      subtitle="Pick up deliveries and track your earnings."
      footer={
        <>
          Want to deliver with GRIDEATS?{" "}
          <Link
            href="/agent/register"
            className="font-semibold text-[#FF771F] hover:underline"
          >
            Become an agent
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-medium text-[#DC2626]">
            {error}
          </p>
        )}

        <FormField
          label="Email"
          type="email"
          placeholder="you@student.edu"
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
