"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sms } from "iconsax-reactjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { FormField } from "@/components/form/form-field";
import { PasswordField } from "@/components/form/password-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SocialButton } from "@/components/ui/social-button";
import { OrDivider } from "@/components/auth/or-divider";
import { signInWithRole } from "@/lib/auth/sign-in";
import { signInWithGoogle } from "@/lib/auth/sign-in-with-google";
import { ROLE_DASHBOARD_PATH } from "@/lib/auth/roles";

/** Student login. */
export default function StudentLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);

    const { error: googleError } = await signInWithGoogle("USER");

    // On success the browser navigates to Google, so we only get here on error.
    if (googleError) {
      setError(googleError);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signInWithRole(
      form.email,
      form.password,
      "USER",
    );

    if (signInError) {
      setError(signInError);
      setLoading(false);
      return;
    }

    router.push(ROLE_DASHBOARD_PATH.USER);
    router.refresh();
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
          Log in
        </PrimaryButton>

        <OrDivider />

        <SocialButton
          onClick={handleGoogle}
          disabled={googleLoading || loading}
        >
          {googleLoading ? "Connecting…" : "Continue with Google"}
        </SocialButton>
      </form>
    </AuthShell>
  );
}
