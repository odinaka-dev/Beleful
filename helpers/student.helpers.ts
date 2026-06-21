// Shared types + presentational helpers for the student food-ordering experience.
// Data itself comes from Supabase — see each screen's data-fetching effect.

export interface Category {
  id: string;
  name: string;
  image: string | null;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string | null;
  bannerImage: string | null;
  rating: number;
  deliveryFee: number;
  tags: string[];
  isOpen: boolean;
}

export interface Food {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  vendorId: string;
  vendorName: string;
  imageUrl: string | null;
  soldOut: boolean;
}

/** Mirrors the orders.status check constraint in Supabase. */
export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "rejected";

export interface ActiveOrder {
  id: string;
  vendorName: string;
  status: OrderStatus;
  /** Set once a delivery agent has been assigned to the order. */
  agentName: string | null;
  agentPhone: string | null;
  itemsCount: number;
  total: number;
  pin: string | null;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Order Placed",
  preparing: "Preparing Food",
  ready: "Ready for Pickup",
  completed: "Delivered",
  rejected: "Rejected",
};

export interface OrderStep {
  key: string;
  label: string;
  state: "done" | "active" | "upcoming";
}

const ORDER_STEP_DEFS = [
  { key: "placed", label: "Order Placed" },
  { key: "preparing", label: "Preparing Food" },
  { key: "ready", label: "Ready for Pickup" },
  { key: "agent", label: "Agent Assigned" },
  { key: "delivered", label: "Delivered" },
];

/**
 * Derives the tracking timeline from the DB's 5-status model plus whether a
 * delivery agent has been assigned — "Agent Assigned" has no DB status of
 * its own, it's read off `delivery_agent_id` being set once status is "ready".
 */
export function buildOrderSteps(status: OrderStatus, hasAgent: boolean): OrderStep[] {
  if (status === "rejected") {
    return [
      { key: "placed", label: "Order Placed", state: "done" },
      { key: "rejected", label: "Order Rejected", state: "active" },
    ];
  }

  let currentStage: number;
  if (status === "completed") currentStage = 4;
  else if (status === "ready") currentStage = hasAgent ? 3 : 2;
  else if (status === "preparing") currentStage = 1;
  else currentStage = 0;

  return ORDER_STEP_DEFS.map((step, i) => ({
    ...step,
    state: i < currentStage ? "done" : i === currentStage ? "active" : "upcoming",
  }));
}

/** Emoji + tint fallback for categories that don't have an `image` yet. */
const CATEGORY_STYLE: Record<string, { emoji: string; color: string }> = {
  rice: { emoji: "🍚", color: "#FCD882" },
  "fast food": { emoji: "🍔", color: "#FDE68A" },
  drinks: { emoji: "🥤", color: "#BAE6FD" },
  snacks: { emoji: "🍟", color: "#FBCFE8" },
  swallow: { emoji: "🍲", color: "#D9F99D" },
  breakfast: { emoji: "🍳", color: "#FED7AA" },
};
const DEFAULT_CATEGORY_STYLE = { emoji: "🍽️", color: "#E5E7EB" };

export function categoryStyle(name: string): { emoji: string; color: string } {
  return CATEGORY_STYLE[name.toLowerCase()] ?? DEFAULT_CATEGORY_STYLE;
}

/** Generic gradient/emoji used wherever a vendor or food item has no photo yet. */
export const PLACEHOLDER_GRADIENT: [string, string] = ["#00452E", "#016644"];

interface OpeningHourEntry {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Whether a vendor is open right now, based on their opening_hours jsonb. */
export function isVendorOpenNow(openingHours: unknown): boolean {
  if (!Array.isArray(openingHours)) return true;
  const now = new Date();
  const today = WEEKDAYS[now.getDay()];
  const entry = (openingHours as OpeningHourEntry[]).find((h) => h.day === today);
  if (!entry || entry.closed) return false;

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = entry.open.split(":").map(Number);
  const [closeH, closeM] = entry.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  return minutesNow >= openMinutes && minutesNow < closeMinutes;
}

/** Order-of-magnitude fees used across cart/checkout. */
export const SERVICE_CHARGE = 150;
export const PLATFORM_FEE = 100;

/** Format a kobo-free Naira amount, e.g. 2500 -> "₦2,500". */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

// ---------------------------------------------------------------------------
// Row mappers — shared shape between dashboard, explore, vendor-store and
// orders screens so each one doesn't redefine the same Supabase row→view
// model mapping.
// ---------------------------------------------------------------------------

export const VENDOR_COLUMNS =
  "id, business_name, logo, banner_image, rating, delivery_fee, tags, opening_hours";

export interface RawVendorRow {
  id: string;
  business_name: string | null;
  logo: string | null;
  banner_image: string | null;
  rating: number | null;
  delivery_fee: number | null;
  tags: string[] | null;
  opening_hours: unknown;
}

export function toVendor(row: RawVendorRow): Vendor {
  return {
    id: row.id,
    name: row.business_name ?? "Vendor",
    logo: row.logo,
    bannerImage: row.banner_image,
    rating: Number(row.rating ?? 0),
    deliveryFee: Number(row.delivery_fee ?? 0),
    tags: row.tags ?? [],
    isOpen: isVendorOpenNow(row.opening_hours),
  };
}

export const FOOD_COLUMNS =
  "id, name, price, description, image_url, available, vendor_id, food_categories(name), vendors(business_name)";

export interface RawFoodRow {
  id: string;
  name: string | null;
  price: number | null;
  description: string | null;
  image_url: string | null;
  available: boolean | null;
  vendor_id: string | null;
  food_categories: { name: string } | null;
  vendors: { business_name: string | null } | null;
}

export function toFood(row: RawFoodRow): Food {
  return {
    id: row.id,
    name: row.name ?? "",
    price: Number(row.price ?? 0),
    description: row.description ?? "",
    category: row.food_categories?.name ?? "Other",
    vendorId: row.vendor_id ?? "",
    vendorName: row.vendors?.business_name ?? "Vendor",
    imageUrl: row.image_url,
    soldOut: !(row.available ?? true),
  };
}

export const ACTIVE_ORDER_COLUMNS =
  "id, status, total_amount, vendors(business_name), order_items(quantity), delivery_agents(profiles(full_name, phone_number))";

export interface RawOrderRow {
  id: string;
  status: string | null;
  total_amount: number | null;
  vendors: { business_name: string | null } | null;
  order_items: { quantity: number | null }[] | null;
  delivery_agents: {
    profiles: { full_name: string | null; phone_number: string | null } | null;
  } | null;
}

export function toActiveOrder(row: RawOrderRow): ActiveOrder {
  const itemsCount = (row.order_items ?? []).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );
  return {
    id: row.id,
    vendorName: row.vendors?.business_name ?? "Vendor",
    status: (row.status ?? "pending") as OrderStatus,
    agentName: row.delivery_agents?.profiles?.full_name ?? null,
    agentPhone: row.delivery_agents?.profiles?.phone_number ?? null,
    itemsCount,
    total: Number(row.total_amount ?? 0),
    pin: null,
  };
}
