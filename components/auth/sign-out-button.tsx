"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogoutCurve } from "iconsax-reactjs";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  /** Login page to land on after signing out. */
  redirectTo: string;
  className?: string;
  "aria-label"?: string;
}

export function SignOutButton({
  redirectTo,
  className,
  "aria-label": ariaLabel = "Log out",
}: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={ariaLabel}
      className={cn(
        "grid place-items-center rounded-lg text-[#666666] transition-colors hover:bg-[#FEE2E2] hover:text-[#DC2626] disabled:opacity-50",
        className,
      )}
    >
      <LogoutCurve size={18} variant="TwoTone" />
    </button>
  );
}
