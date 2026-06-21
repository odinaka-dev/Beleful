import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

const PROTECTED_ROUTES: { prefix: string; loginPath: string }[] = [
  { prefix: "/user-dashboard", loginPath: "/login" },
  { prefix: "/agent-dashboard", loginPath: "/agent/login" },
  { prefix: "/vendor-dashboard", loginPath: "/vendor/login" },
];

/**
 * Refreshes the Supabase auth session cookie on every request, and bounces
 * unauthenticated visitors away from protected routes before the page even
 * renders. This is only an optimistic, session-presence check (no DB call,
 * per Next.js's own proxy guidance) — the authoritative role check lives in
 * each dashboard layout via requireRole().
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Required: this revalidates the session and refreshes the cookie if
  // expired. Do not remove — without it, sessions silently stop refreshing.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const pathname = request.nextUrl.pathname;
    const match = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));
    if (match) {
      return NextResponse.redirect(new URL(match.loginPath, request.url));
    }
  }

  return response;
}
