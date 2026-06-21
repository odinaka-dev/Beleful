import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/lib/auth/roles";

/** Extra fields stashed in auth metadata; the `handle_new_user` DB trigger
 * reads these to populate `profiles` and (for VENDOR/DELIVERY_AGENT) the
 * matching `vendors`/`delivery_agents` row — no client-side insert needed,
 * which matters because there's no session yet until the email is confirmed. */
export interface SignUpMetadata {
  full_name?: string;
  phone_number?: string;
  school?: string;
  hostel?: string;
  business_name?: string;
  address?: string;
  cac_number?: string;
  matric_number?: string;
}

export async function signUpWithRole(
  email: string,
  password: string,
  role: Role,
  metadata: SignUpMetadata,
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, ...metadata } },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return { error: "An account with this email already exists." };
    }
    return {
      error: error.message || "Something went wrong creating your account.",
    };
  }

  return { error: null };
}
