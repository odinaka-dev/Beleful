"use client";

import { useState } from "react";
import Link from "next/link";
import { Sms } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Delivery agent login. */
export default function AgentLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  }

  return (
    <AuthShell
      role="agent"
      title="Agent sign in"
      subtitle="Pick up deliveries and track your earnings."
      footer={
        <>
          Want to deliver with BELEFUL?{" "}
          <Link
            href="/agent/register"
            className="font-semibold text-[#00452E] hover:underline"
          >
            Become an agent
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
