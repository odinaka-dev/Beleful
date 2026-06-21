// Mock data for the food-vendor dashboard. Swap for Supabase later.
import { formatNaira } from "@/helpers/student.helpers";

export { formatNaira };

export interface VendorMetrics {
  revenueToday: number;
  ordersToday: number;
  pendingOrders: number;
  activeMenuItems: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export type VendorOrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "rejected";

export interface VendorOrder {
  id: string;
  customer: string;
  items: string;
  itemsCount: number;
  total: number;
  status: VendorOrderStatus;
  time: string;
}

/** Formats an ISO timestamp as a short relative time, e.g. "2 min ago". */
export function formatRelativeTime(isoDate: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export type MenuItemStatus = "available" | "sold_out";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  status: MenuItemStatus;
  emoji: string;
  gradient: [string, string];
}

export interface VendorTxn {
  id: string;
  date: string;
  reference: string;
  type: "Sale" | "Withdrawal" | "Settlement";
  amount: number;
  status: "Completed" | "Pending";
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "jollof-rice-chicken",
    name: "Jollof Rice & Chicken",
    price: 2500,
    description: "Smoky party jollof with grilled chicken and fried plantain.",
    category: "Rice",
    status: "available",
    emoji: "🍚",
    gradient: ["#00452E", "#016644"],
  },
  {
    id: "fried-rice-combo",
    name: "Fried Rice Combo",
    price: 2800,
    description: "Veggie fried rice, turkey and coleslaw.",
    category: "Rice",
    status: "available",
    emoji: "🍛",
    gradient: ["#166534", "#22C55E"],
  },
  {
    id: "pounded-yam-egusi",
    name: "Pounded Yam & Egusi",
    price: 2700,
    description: "Smooth pounded yam with rich egusi and assorted meat.",
    category: "Swallow",
    status: "available",
    emoji: "🍲",
    gradient: ["#3F6212", "#84CC16"],
  },
  {
    id: "beef-shawarma",
    name: "Beef Shawarma",
    price: 2200,
    description: "Loaded beef shawarma with sausage and extra sauce.",
    category: "Fast Food",
    status: "sold_out",
    emoji: "🌯",
    gradient: ["#B04D0F", "#F59E0B"],
  },
  {
    id: "chapman",
    name: "Chilled Chapman",
    price: 1200,
    description: "Classic Nigerian cocktail, served ice cold.",
    category: "Drinks",
    status: "available",
    emoji: "🍹",
    gradient: ["#0369A1", "#38BDF8"],
  },
];

export const VENDOR_WALLET = {
  totalRevenue: 1248000,
  availableBalance: 312500,
  pendingSettlement: 86400,
};

export const VENDOR_TXNS: VendorTxn[] = [
  { id: "1", date: "21 Jun 2026", reference: "BF-10319", type: "Sale", amount: 6800, status: "Completed" },
  { id: "2", date: "21 Jun 2026", reference: "BF-10317", type: "Sale", amount: 2300, status: "Completed" },
  { id: "3", date: "20 Jun 2026", reference: "WD-4471", type: "Withdrawal", amount: -150000, status: "Completed" },
  { id: "4", date: "20 Jun 2026", reference: "STL-2231", type: "Settlement", amount: 91000, status: "Pending" },
  { id: "5", date: "19 Jun 2026", reference: "BF-10288", type: "Sale", amount: 4500, status: "Completed" },
];

export const VENDOR_PROFILE = {
  businessName: "Mama's Kitchen",
  vendorName: "Bisi Adewale",
  email: "store@mamaskitchen.com",
  phone: "+234 803 222 1190",
  school: "University of Lagos (UNILAG)",
  address: "Shop 12, Student Union Building",
  cac: "RC 1840293",
};

export const OPENING_HOURS: OpeningHour[] = [
  { day: "Monday", open: "08:00", close: "21:00", closed: false },
  { day: "Tuesday", open: "08:00", close: "21:00", closed: false },
  { day: "Wednesday", open: "08:00", close: "21:00", closed: false },
  { day: "Thursday", open: "08:00", close: "21:00", closed: false },
  { day: "Friday", open: "08:00", close: "22:00", closed: false },
  { day: "Saturday", open: "10:00", close: "22:00", closed: false },
  { day: "Sunday", open: "12:00", close: "20:00", closed: true },
];
