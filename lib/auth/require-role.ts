import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/auth/roles";

/**
 * Server-side dashboard guard: redirects to `loginPath` unless the signed-in
 * user's profile role matches `allowed` (admins always pass). This is the
 * authoritative check — proxy.ts only does a cheap "is there a session"
 * pass to avoid a flash of protected UI before this runs.
 */
export async function requireRole(allowed: Role, loginPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(loginPath);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== allowed && profile.role !== "ADMIN")) {
    redirect(loginPath);
  }

  return profile;
}
