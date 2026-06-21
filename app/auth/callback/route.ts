import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROLE_DASHBOARD_PATH, type Role } from "@/lib/auth/roles";

/**
 * OAuth callback. Google sends the user back here with a `code`; we exchange it
 * for a session cookie (written via the SSR client), make sure the account has
 * a profile row, then bounce them to the dashboard for their role.
 *
 * Note the redirect base: behind a load balancer the forwarded host is the one
 * the browser actually used, so prefer it over the request origin in prod.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = (searchParams.get("role") as Role | null) ?? "USER";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocal = process.env.NODE_ENV === "development";
  const base = isLocal || !forwardedHost ? origin : `https://${forwardedHost}`;

  if (!code) {
    return NextResponse.redirect(`${base}/login?error=oauth`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${base}/login?error=oauth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${base}/login?error=oauth`);
  }

  // Existing accounts already have a profile (and a role) — honour it so a
  // vendor who taps "Continue with Google" still lands on the vendor side.
  // New Google accounts have no profile yet, so create one with the role the
  // portal asked for.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const meta = user.user_metadata ?? {};
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? null,
      full_name: meta.full_name ?? meta.name ?? null,
      avatar_url: meta.avatar_url ?? meta.picture ?? null,
      role,
    });
    return NextResponse.redirect(`${base}${ROLE_DASHBOARD_PATH[role]}`);
  }

  return NextResponse.redirect(`${base}${ROLE_DASHBOARD_PATH[profile.role]}`);
}
