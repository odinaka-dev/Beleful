// Shared types + presentational helpers for the delivery-agent dashboard.
// Data itself comes from Supabase — see each screen's data-fetching effect.

import { formatNaira } from "@/helpers/student.helpers";
import { EmptyWallet, Clock, Routing, MedalStar } from "iconsax-reactjs";

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
  pinLocked: boolean;
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

export const BENEFITS = [
  {
    icon: EmptyWallet,
    title: "Earn on every drop",
    description:
      "Get paid for each delivery you complete, with transparent payouts straight to your wallet.",
  },
  {
    icon: Clock,
    title: "Fully flexible hours",
    description:
      "Go online between lectures, in the evening, or on weekends. You decide when you work.",
  },
  {
    icon: Routing,
    title: "Stay close to campus",
    description:
      "Only get matched with nearby orders, so you never travel far from where you already are.",
  },
  {
    icon: MedalStar,
    title: "Build your reputation",
    description:
      "Great ratings unlock priority orders and help you earn more as a trusted agent.",
  },
];

export const STEPS = [
  {
    title: "Sign up & get verified",
    description:
      "Register with your student details and complete a quick verification to join.",
  },
  {
    title: "Accept nearby orders",
    description:
      "Browse incoming requests around you and accept the ones that fit your schedule.",
  },
  {
    title: "Pick up the meal",
    description:
      "Head to the vendor, confirm the order, and grab the food ready for delivery.",
  },
  {
    title: "Deliver & get paid",
    description:
      "Drop off to the student, confirm completion, and watch your earnings grow.",
  },
];
