"use client";

import Heading from "@/components/ui/Heading";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const WHY_DELIVER_CARDS = [
  {
    image: BelefulImages.earnDrop,
    color: "#93BFF0",
    title: "Earn on every drop",
    description:
      "Get paid for each delivery you complete, with transparent payouts straight to your wallet.",
  },
  {
    image: BelefulImages.stayCampus,
    color: "#8BDF86",
    title: "Stay close to campus",
    description:
      "Only get matched with nearby orders, so you never travel far from where you already are.",
  },
  {
    image: BelefulImages.buildReputation,
    color: "#EFBE82",
    title: "Build your reputation",
    description:
      "Great ratings unlock priority orders and help you earn more as a trusted agent.",
  },
  {
    image: BelefulImages.flexibleHours,
    color: "#E693E0",
    title: "Fully flexible hours",
    description:
      "Go online between lectures, in the evening, or on weekends. You decide when you work.",
  },
];

export default function DeliveryAgentSubComponent() {
  return (
    <div className="mx-auto my-24 max-w-[90%] lg:my-32 xl:max-w-[1400px]">
      {/* Intro */}
      <Heading
        className="hidden mx-auto max-w-[90%] lg:max-w-[760px]"
        title="Student Struggles"
        description="We understand the struggle of every student, keeping up with cash just enough to fund day to day campus expenses. On Beleful, you can earn whenever and wherever on campus."
      />

      {/* Benefits */}
      <div className="mt-24 lg:mt-32">
        <Heading
          className="mx-auto max-w-[90%] lg:max-w-[760px]"
          title="Why deliver with Grid Eats"
          description="Grid Eats offers a variety of features that supports food business growth on campus, features like"
        />

        <div className="mt-12">
          <Marquee speed={30} gradient={false} pauseOnHover>
            {WHY_DELIVER_CARDS.map((card, index) => (
              <div
                key={index}
                className="mx-3 w-[300px] shrink-0 overflow-hidden rounded-[28px] p-1.5 sm:w-[340px]"
                style={{ backgroundColor: card.color }}
              >
                {/* Phone mockup on colored surface */}
                <div className="flex justify-center px-4 pt-6">
                  <Image
                    src={card.image}
                    alt={card.title}
                    loading="eager"
                    className="h-auto w-[85%]"
                  />
                </div>

                {/* Copy */}
                <div className="rounded-[22px] bg-white p-6">
                  <h3 className="text-xl font-bold text-[#111111]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-sub-text-color">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
