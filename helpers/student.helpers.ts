// Mock domain data for the student food-ordering experience.
// Swap for Supabase queries when the API layer lands.

export interface Category {
  id: string;
  name: string;
  emoji: string;
  /** Tailwind-friendly hex used for the soft tinted card background. */
  color: string;
}

export interface Vendor {
  id: string;
  name: string;
  /** Emoji used by the gradient image placeholder. */
  emoji: string;
  /** Two hex stops for the placeholder gradient. */
  gradient: [string, string];
  rating: number;
  reviews: number;
  deliveryTime: string;
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
  emoji: string;
  gradient: [string, string];
  popular?: boolean;
  soldOut?: boolean;
}

export type OrderStatus =
  | "placed"
  | "accepted"
  | "preparing"
  | "ready"
  | "assigned"
  | "picked_up"
  | "delivered";

export interface ActiveOrder {
  id: string;
  vendorName: string;
  status: OrderStatus;
  agentName: string;
  agentPhone: string;
  eta: string;
  itemsCount: number;
  total: number;
  pin: string;
}

export const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "placed", label: "Order Placed" },
  { status: "accepted", label: "Vendor Accepted" },
  { status: "preparing", label: "Preparing Food" },
  { status: "ready", label: "Ready For Pickup" },
  { status: "assigned", label: "Agent Assigned" },
  { status: "picked_up", label: "Picked Up" },
  { status: "delivered", label: "Delivered" },
];

export const CATEGORIES: Category[] = [
  { id: "rice", name: "Rice", emoji: "🍚", color: "#FCD882" },
  { id: "fast-food", name: "Fast Food", emoji: "🍔", color: "#FDE68A" },
  { id: "drinks", name: "Drinks", emoji: "🥤", color: "#BAE6FD" },
  { id: "snacks", name: "Snacks", emoji: "🍟", color: "#FBCFE8" },
  { id: "swallow", name: "Swallow", emoji: "🍲", color: "#D9F99D" },
  { id: "breakfast", name: "Breakfast", emoji: "🍳", color: "#FED7AA" },
];

export const VENDORS: Vendor[] = [
  {
    id: "mamas-kitchen",
    name: "Mama's Kitchen",
    emoji: "🍛",
    gradient: ["#00452E", "#016644"],
    rating: 4.8,
    reviews: 320,
    deliveryTime: "15-25 min",
    deliveryFee: 300,
    tags: ["Rice", "Swallow", "Local"],
    isOpen: true,
  },
  {
    id: "campus-grill",
    name: "Campus Grill",
    emoji: "🍔",
    gradient: ["#B04D0F", "#D97706"],
    rating: 4.6,
    reviews: 210,
    deliveryTime: "20-30 min",
    deliveryFee: 400,
    tags: ["Fast Food", "Grills"],
    isOpen: true,
  },
  {
    id: "sip-and-bite",
    name: "Sip & Bite",
    emoji: "🥤",
    gradient: ["#0369A1", "#0EA5E9"],
    rating: 4.7,
    reviews: 154,
    deliveryTime: "10-20 min",
    deliveryFee: 250,
    tags: ["Drinks", "Snacks"],
    isOpen: true,
  },
  {
    id: "morning-fuel",
    name: "Morning Fuel",
    emoji: "🍳",
    gradient: ["#7A5C00", "#D97706"],
    rating: 4.5,
    reviews: 98,
    deliveryTime: "15-25 min",
    deliveryFee: 300,
    tags: ["Breakfast", "Tea"],
    isOpen: false,
  },
];

export const FOODS: Food[] = [
  {
    id: "jollof-rice-chicken",
    name: "Jollof Rice & Chicken",
    price: 2500,
    description: "Smoky party jollof with grilled chicken and fried plantain.",
    category: "Rice",
    vendorId: "mamas-kitchen",
    vendorName: "Mama's Kitchen",
    emoji: "🍚",
    gradient: ["#00452E", "#016644"],
    popular: true,
  },
  {
    id: "fried-rice-combo",
    name: "Fried Rice Combo",
    price: 2800,
    description: "Veggie fried rice, turkey and coleslaw.",
    category: "Rice",
    vendorId: "mamas-kitchen",
    vendorName: "Mama's Kitchen",
    emoji: "🍛",
    gradient: ["#166534", "#22C55E"],
  },
  {
    id: "double-cheeseburger",
    name: "Double Cheeseburger",
    price: 3200,
    description: "Two beef patties, melted cheese and house sauce.",
    category: "Fast Food",
    vendorId: "campus-grill",
    vendorName: "Campus Grill",
    emoji: "🍔",
    gradient: ["#B04D0F", "#F59E0B"],
    popular: true,
  },
  {
    id: "loaded-fries",
    name: "Loaded Fries",
    price: 1800,
    description: "Crispy fries topped with cheese sauce and beef strips.",
    category: "Snacks",
    vendorId: "campus-grill",
    vendorName: "Campus Grill",
    emoji: "🍟",
    gradient: ["#9A3412", "#FB923C"],
  },
  {
    id: "chapman",
    name: "Chilled Chapman",
    price: 1200,
    description: "Classic Nigerian cocktail, served ice cold.",
    category: "Drinks",
    vendorId: "sip-and-bite",
    vendorName: "Sip & Bite",
    emoji: "🍹",
    gradient: ["#0369A1", "#38BDF8"],
    popular: true,
  },
  {
    id: "shawarma",
    name: "Beef Shawarma",
    price: 2200,
    description: "Loaded beef shawarma with sausage and extra sauce.",
    category: "Fast Food",
    vendorId: "sip-and-bite",
    vendorName: "Sip & Bite",
    emoji: "🌯",
    gradient: ["#155E75", "#22D3EE"],
  },
  {
    id: "pancakes-stack",
    name: "Pancake Stack",
    price: 1500,
    description: "Fluffy pancakes with syrup and a side of eggs.",
    category: "Breakfast",
    vendorId: "morning-fuel",
    vendorName: "Morning Fuel",
    emoji: "🥞",
    gradient: ["#7A5C00", "#F59E0B"],
  },
  {
    id: "pounded-yam-egusi",
    name: "Pounded Yam & Egusi",
    price: 2700,
    description: "Smooth pounded yam with rich egusi and assorted meat.",
    category: "Swallow",
    vendorId: "mamas-kitchen",
    vendorName: "Mama's Kitchen",
    emoji: "🍲",
    gradient: ["#3F6212", "#84CC16"],
  },
];

export const ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: "BF-10293",
    vendorName: "Mama's Kitchen",
    status: "preparing",
    agentName: "David Okon",
    agentPhone: "+234 801 234 5678",
    eta: "18 min",
    itemsCount: 3,
    total: 6100,
    pin: "4821",
  },
];

/** Order-of-magnitude fees used across cart/checkout. */
export const SERVICE_CHARGE = 150;
export const PLATFORM_FEE = 100;

/** Format a kobo-free Naira amount, e.g. 2500 -> "₦2,500". */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
