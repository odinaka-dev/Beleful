// Mock data for the delivery-agent dashboard. Swap for Supabase later.
import { formatNaira } from "@/helpers/student.helpers";

export { formatNaira };

export interface AgentMetrics {
  earningsToday: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  rating: number;
}

export interface AvailableDelivery {
  id: string;
  vendor: string;
  vendorEmoji: string;
  pickup: string;
  dropoff: string;
  earnings: number;
  distanceKm: number;
  itemsCount: number;
}

export type DeliveryStage =
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered";

export interface ActiveDelivery {
  id: string;
  vendor: string;
  vendorEmoji: string;
  pickup: string;
  dropoff: string;
  customer: string;
  customerPhone: string;
  earnings: number;
  stage: DeliveryStage;
  pin: string;
  itemsCount: number;
}

export interface EarningRow {
  id: string;
  date: string;
  order: string;
  amount: number;
  status: "Paid" | "Pending";
}

export interface AgentProfile {
  name: string;
  email: string;
  phone: string;
  school: string;
  studentId: string;
  hostel: string;
  verified: boolean;
  joined: string;
  stats: {
    totalDeliveries: number;
    rating: number;
    acceptanceRate: number;
    onTimeRate: number;
  };
}

export const AGENT_METRICS: AgentMetrics = {
  earningsToday: 4800,
  completedDeliveries: 7,
  pendingDeliveries: 2,
  rating: 4.9,
};

export const AVAILABLE_DELIVERIES: AvailableDelivery[] = [
  {
    id: "BF-10310",
    vendor: "Mama's Kitchen",
    vendorEmoji: "🍛",
    pickup: "Student Union Building",
    dropoff: "Moremi Hall, Block C",
    earnings: 600,
    distanceKm: 1.2,
    itemsCount: 3,
  },
  {
    id: "BF-10311",
    vendor: "Campus Grill",
    vendorEmoji: "🍔",
    pickup: "Faculty of Science Cafeteria",
    dropoff: "Jaja Hall, Room 212",
    earnings: 750,
    distanceKm: 1.8,
    itemsCount: 2,
  },
  {
    id: "BF-10312",
    vendor: "Sip & Bite",
    vendorEmoji: "🥤",
    pickup: "Main Gate Plaza",
    dropoff: "Queen Amina Hall",
    earnings: 500,
    distanceKm: 0.9,
    itemsCount: 4,
  },
];

export const ACTIVE_DELIVERY: ActiveDelivery = {
  id: "BF-10309",
  vendor: "Mama's Kitchen",
  vendorEmoji: "🍛",
  pickup: "Student Union Building",
  dropoff: "Eni Njoku Hall, Room 118",
  customer: "Ada Okeke",
  customerPhone: "+234 802 555 0199",
  earnings: 650,
  stage: "picked_up",
  pin: "4821",
  itemsCount: 3,
};

export const DELIVERY_STAGES: { stage: DeliveryStage; label: string }[] = [
  { stage: "assigned", label: "Assigned" },
  { stage: "picked_up", label: "Picked Up" },
  { stage: "in_transit", label: "On the way" },
  { stage: "delivered", label: "Delivered" },
];

export const EARNINGS_SUMMARY = {
  total: 184500,
  walletBalance: 23400,
  pending: 4800,
};

export const EARNINGS_HISTORY: EarningRow[] = [
  { id: "1", date: "21 Jun 2026", order: "BF-10309", amount: 650, status: "Pending" },
  { id: "2", date: "21 Jun 2026", order: "BF-10302", amount: 600, status: "Paid" },
  { id: "3", date: "20 Jun 2026", order: "BF-10288", amount: 750, status: "Paid" },
  { id: "4", date: "20 Jun 2026", order: "BF-10281", amount: 500, status: "Paid" },
  { id: "5", date: "19 Jun 2026", order: "BF-10274", amount: 800, status: "Paid" },
  { id: "6", date: "19 Jun 2026", order: "BF-10269", amount: 550, status: "Paid" },
];

export const AGENT_PROFILE: AgentProfile = {
  name: "David Okon",
  email: "david.okon@student.unilag.edu",
  phone: "+234 801 234 5678",
  school: "University of Lagos (UNILAG)",
  studentId: "STU/2023/1184",
  hostel: "Jaja Hall",
  verified: true,
  joined: "March 2026",
  stats: {
    totalDeliveries: 214,
    rating: 4.9,
    acceptanceRate: 96,
    onTimeRate: 98,
  },
};
