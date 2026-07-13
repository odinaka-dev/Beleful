"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { BelefulImages } from "@/constant/image";
import { cn } from "@/lib/utils";
// import UserLottieFile from "@/public/lottie/food.json";
import ShopLottieFile from "@/public/lottie/Food_Beverage.json";
import DeliveryLottieFile from "@/public/lottie/fooddeliveryboy.json";
// import Lottie from "lottie-react";

export type AuthRole = "student" | "vendor" | "agent";

interface RoleTab {
  role: AuthRole;
  label: string;
  loginHref: string;
}

const ROLE_TABS: RoleTab[] = [
  { role: "student", label: "Student", loginHref: "/login" },
  { role: "vendor", label: "Vendor", loginHref: "/vendor/login" },
  { role: "agent", label: "Agent", loginHref: "/agent/login" },
];

interface AuthHighlight {
  eyebrow: string;
  heading: string;
  sub: string;
  bullets: string[];
  image: StaticImageData;
  backgroundImage: StaticImageData;
  accent: string;
}

// Illustration-panel copy + art per role, reusing existing brand assets.
const ROLE_HIGHLIGHT: Record<AuthRole, AuthHighlight> = {
  student: {
    eyebrow: "For Students",
    heading: "Campus cravings, delivered in minutes.",
    sub: "Order from your favourite campus vendors and track every step to your hostel door.",
    bullets: [
      "Order from vendors you already know",
      "Live delivery tracking & PIN handoff",
      "Student-friendly delivery fees",
    ],
    image: BelefulImages.studentAuthImage,
    backgroundImage: BelefulImages.authBackground,
    accent: "#FF771F",
  },
  vendor: {
    eyebrow: "For vendors",
    heading: "Reach more students. Sell more food.",
    sub: "Put your kitchen in front of the whole campus and get settled fast.",
    bullets: [
      "Grow visibility across campus",
      "Manage menu & orders in one place",
      "Fast, reliable payouts",
    ],
    image: BelefulImages.vendorAuthImage,
    backgroundImage: BelefulImages.vendorBackground,
    accent: "#FF771F",
  },
  agent: {
    eyebrow: "For Delivery Agents",
    heading: "Deliver between classes. Earn on your terms.",
    sub: "Pick up nearby deliveries, walk or ride across campus, and cash out anytime.",
    bullets: [
      "Flexible deliveries around your schedule",
      "Transparent earnings per trip",
      "Withdraw your balance anytime",
    ],
    image: BelefulImages.deliveryAgent,
    backgroundImage: BelefulImages.authBackground,

    accent: "#FF771F",
  },
};

interface AuthShellProps {
  role: AuthRole;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideRoleTabs?: boolean;
}

export function AuthShell({
  role,
  title,
  subtitle,
  children,
  footer,
  hideRoleTabs = false,
}: AuthShellProps) {
  const highlight = ROLE_HIGHLIGHT[role];

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <aside
        className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-cover bg-center p-10 pb-0 lg:flex xl:w-[48%] xl:p-10 xl:pb-0 xl:pr-0"
        style={{ backgroundImage: `url(${highlight.backgroundImage.src})` }}
      >
        <Link href="/" className="relative z-10 w-fit">
          <Image
            src={BelefulImages.logoImage}
            alt="BELEFUL"
            className="w-32 mb-2"
          />
        </Link>

        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-[#FCD882]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#111111]">
            {highlight.eyebrow}
          </span>
          <h2 className="max-w-md mt-5 text-4xl font-bold leading-tight text-[#111111] font-heading">
            {highlight.heading}
          </h2>
          <p className="max-w-md mt-4 text-base leading-relaxed text-[#111111]/70 font-medium">
            {highlight.sub}
          </p>
        </div>

        <div className="">
          <Image
            src={highlight.image}
            alt="auth_images"
            className="object-contain w-full relative bottom-0"
          />
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col items-center flex-1 w-full px-5 py-8 overflow-y-auto sm:px-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <Link href="/" className="flex mb-8 w-fit lg:hidden">
            <Image
              src={BelefulImages.logoImage}
              alt="BELEFUL"
              className="w-28"
            />
          </Link>

          {!hideRoleTabs && (
            <div className="mb-8 grid grid-cols-3 gap-1 rounded-2xl bg-[#00452E]/[0.04] p-1">
              {ROLE_TABS.map((tab) => (
                <Link
                  key={tab.role}
                  href={tab.loginHref}
                  className={cn(
                    "rounded-full py-2.5 text-center text-sm font-semibold transition-all duration-200",
                    tab.role === role
                      ? "bg-[#FF771F] text-white shadow-sm"
                      : "text-[#666666] hover:text-[#00452E]",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          )}

          <div className="mb-7">
            <h1 className="font-heading text-2xl font-bold text-[#111111] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#666666]">{subtitle}</p>
          </div>

          {children}

          {footer && (
            <div className="mt-6 text-center text-sm text-[#666666]">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
