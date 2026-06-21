import type { Database } from "@/lib/supabase/database.types";

export type Role = Database["public"]["Enums"]["user_role"];

/** Dashboard each role lands on after login. Admins fall back to the
 * student dashboard until a dedicated admin console exists. */
export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  USER: "/user-dashboard",
  VENDOR: "/vendor-dashboard",
  DELIVERY_AGENT: "/agent-dashboard",
  ADMIN: "/user-dashboard",
};

export const ROLE_LOGIN_PATH: Record<Exclude<Role, "ADMIN">, string> = {
  USER: "/login",
  VENDOR: "/vendor/login",
  DELIVERY_AGENT: "/agent/login",
};

export const ROLE_LABEL: Record<Role, string> = {
  USER: "student",
  VENDOR: "vendor",
  DELIVERY_AGENT: "delivery agent",
  ADMIN: "admin",
};
