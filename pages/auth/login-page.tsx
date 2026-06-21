"use client";

import { useState } from "react";
import Link from "next/link";
import { Sms } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SocialButton } from "@/components/ui/social-button";
import { OrDivider } from "@/components/auth/or-divider";

/** Student login. */
export default function StudentLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mock auth — real Supabase call wired later.
    setTimeout(() => setLoading(false), 900);
  }

  return (
    <AuthShell
      role="student"
      title="Welcome back"
      subtitle="Log in to keep the campus cravings coming."
      footer={
        <>
          New to BELEFUL?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#00452E] hover:underline"
          >
            Create an account
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
          Log in
        </PrimaryButton>

        <OrDivider />

        <SocialButton />
      </form>
    </AuthShell>
  );
}
