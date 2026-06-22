// Shared types + presentational helpers for the delivery-agent dashboard.
// Data itself comes from Supabase — see each screen's data-fetching effect.

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
  itemsCount: number;
}

/** Mirrors the orders.delivery_stage check constraint in Supabase. */
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
  customerPhone: string | null;
  earnings: number;
  stage: DeliveryStage;
  pin: string | null;
  itemsCount: number;
}

export interface EarningRow {
  id: string;
  date: string;
  order: string;
  amount: number;
  status: "Paid" | "Pending";
}

/** Mirrors delivery_agents.verification_status: 'pending' until a document
 * is uploaded, 'submitted' while awaiting admin review, 'verified' once
 * approved. */
export type VerificationStatus = "pending" | "submitted" | "verified";

export interface AgentProfile {
  name: string;
  email: string;
  phone: string;
  school: string;
  studentId: string;
  hostel: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  joined: string;
  stats: {
    totalDeliveries: number;
    rating: number;
  };
}

export const DELIVERY_STAGES: { stage: DeliveryStage; label: string }[] = [
  { stage: "assigned", label: "Assigned" },
  { stage: "picked_up", label: "Picked Up" },
  { stage: "in_transit", label: "On the way" },
  { stage: "delivered", label: "Delivered" },
];
