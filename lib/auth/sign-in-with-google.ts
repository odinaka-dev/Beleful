import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/lib/auth/roles";

/**
 * Starts the Google OAuth flow. On success the browser is redirected away to
 * Google and this function never really "returns" — control comes back via the
 * `/auth/callback` route handler, which exchanges the code for a session and
 * sends the user to their dashboard.
 *
 * The chosen `role` is forwarded to the callback so a brand-new Google account
 * (which carries no role in its auth metadata, unlike email sign-up) can have
 * its profile created with the right role. Only USER makes sense from the
 * student portal today — vendors/agents need extra onboarding data Google
 * can't provide — but the param keeps the helper reusable.
 */

export async function signInWithGoogle(
  role: Role = "USER",
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const params = new URLSearchParams({ role });

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?${params.toString()}`,
      // Ask Google for the account picker every time rather than silently
      // reusing the last session.
      queryParams: { prompt: "select_account" },
    },
  });

  if (error) {
    return { error: error.message || "Couldn't start Google sign-in." };
  }

  return { error: null };
}
