"use client";

import Heading from "@/components/ui/Heading";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";
import { EmptyWallet, Clock, Routing, MedalStar } from "iconsax-reactjs";
import FrequentlyComponent from "@/components/layout/frequently-asked-questions";

const BENEFITS = [
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

const STEPS = [
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

export default function DeliveryAgentSubComponent() {
  return (
    <div className="mx-auto my-24 max-w-[90%] lg:my-32 xl:max-w-[1200px]">
      {/* Intro */}
      <Heading
        className="hidden mx-auto max-w-[90%] lg:max-w-[760px]"
        title="Student Struggles"
        description="We understand the struggle of every student, keeping up with cash just enough to fund day to day campus expenses. On Beleful, you can earn whenever and wherever on campus."
      />

      <div className="justify-center hidden mt-14 lg:mt-20">
        <Image
          src={BelefulImages.EarnImage}
          alt="Student earning by delivering on Beleful"
          loading="eager"
          unoptimized
          className="h-auto w-full max-w-[563px]"
        />
      </div>

      {/* Benefits */}
      <div className="mt-24 lg:mt-32">
        <Heading
          className="mx-auto max-w-[90%] lg:max-w-[760px]"
          title="Why deliver with Beleful"
          description="A side hustle that actually fits around student life."
        />

        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-3xl border border-[#00452E]/10 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-[#016644]/10">
                  <Icon size={28} variant="Bold" color="#016644" />
                </span>
                <h3 className="text-xl font-bold text-[#111111]">
                  {benefit.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-sub-text-color">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="mt-24 lg:mt-32">
        <Heading
          className="mx-auto max-w-[90%] lg:max-w-[760px]"
          title="How it works"
          description="From sign up to your first payout in four simple steps."
        />

        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={index} className="relative rounded-3xl bg-banner-bg p-7">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#016644] text-lg font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-[#111111]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-sub-text-color">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <FrequentlyComponent />
    </div>
  );
}
