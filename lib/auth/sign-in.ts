import { createClient } from "@/lib/supabase/client";
import { ROLE_LABEL, type Role } from "@/lib/auth/roles";

/**
 * Signs in with email/password, then checks the account's profile role
 * matches the portal that initiated the request (e.g. a student account
 * used on the vendor login page is rejected, not silently let in).
 * Signs the user back out on any failure so no stray session is left behind.
 */
export async function signInWithRole(
  email: string,
  password: string,
  expectedRole: Role,
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    if (signInError.code === "email_not_confirmed") {
      return {
        error: "Please confirm your email before logging in — check your inbox for the confirmation link.",
      };
    }
    return { error: "Incorrect email or password." };
  }

  if (!signInData.user) {
    return { error: "Incorrect email or password." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", signInData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: "We couldn't find an account for these credentials." };
  }

  if (profile.role !== expectedRole) {
    await supabase.auth.signOut();
    const label = ROLE_LABEL[expectedRole];
    const article = /^[aeiou]/i.test(label) ? "an" : "a";
    return {
      error: `This account isn't registered as ${article} ${label}.`,
    };
  }

  return { error: null };
}
