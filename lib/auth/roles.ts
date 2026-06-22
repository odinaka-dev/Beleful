import type { Database } from "@/lib/supabase/database.types";

export type Role = Database["public"]["Enums"]["user_role"];

/** Dashboard each role lands on after login. */
export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  USER: "/user-dashboard",
  VENDOR: "/vendor-dashboard",
  DELIVERY_AGENT: "/agent-dashboard",
  ADMIN: "/admin-dashboard",
};

/** Admin has no public registration flow — accounts are provisioned
 * directly in Supabase, so this is sign-in only, never linked from the
 * public site. */
export const ROLE_LOGIN_PATH: Record<Role, string> = {
  USER: "/login",
  VENDOR: "/vendor/login",
  DELIVERY_AGENT: "/agent/login",
  ADMIN: "/admin/login",
};

export const ROLE_LABEL: Record<Role, string> = {
  USER: "student",
  VENDOR: "vendor",
  DELIVERY_AGENT: "delivery agent",
  ADMIN: "admin",
};
