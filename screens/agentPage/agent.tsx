"use client";

import HeaderComponent from "@/components/layout/header";
import DoubleButton from "@/components/ui/Button";
import DeliveryAgentSubComponent from "./components/delivery-agent-sub-component";
import FrequentlyComponent from "@/components/layout/frequently-asked-questions";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";

export default function DeliveryAgentPage() {
  return (
    <div>
      {/* <main className="flex flex-col min-h-screen overflow-x-clip bg-banner-bg"> */}
      <main
        className="relative flex flex-col items-center justify-between h-screen bg-center bg-no-repeat bg-cover overflow-clip"
        style={{
          backgroundImage: `url(${BelefulImages.deliveryBackground.src})`,
        }}
      >
        <div className="mx-auto w-full max-w-[96%] xl:max-w-[1200px]">
          <HeaderComponent />
        </div>

        <div className="mx-auto grid w-full max-w-[96%] flex-1 grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[50%_50%] lg:gap-8 lg:py-0 xl:max-w-[1200px]">
          {/* Copy */}
          <div className="order-1 lg:order-1">
            <h1 className="w-full text-5xl font-extrabold text-center lg:text-left lg:text-7xl">
              Earn while you learn <br className="block lg:hidden" /> on Grid
              Eats
            </h1>

            <p className="hidden mx-auto mt-8 max-w-[90%] md:max-w-[540px] text-center text-lg font-semibold sm:text-2xl lg:mx-0 lg:text-left">
              As a student, sign up as one of our agents, pick up orders and
              deliver at your convenience.
            </p>

            <DoubleButton
              className="mt-10 flex w-full flex-col items-center justify-center gap-4 text-[18px] font-semibold sm:flex-row md:text-[22px] lg:justify-start"
              buttonName="Register as an Agent"
              buttonNameSec="Access our Services"
              padding={8}
              bgColor="#FF771F"
              textColor="#ffffff"
              linkOne="/agent/register"
              linkTwo="/agent/login"
            />
          </div>

          {/* Animation */}
          <div className="flex items-end justify-center order-2 lg:order-2 lg:justify-end">
            <Image
              src={BelefulImages.deliveryAgent}
              alt="Homepage-banner-image"
              loading="eager"
              className="relative w-full lg:top-28"
            />
          </div>
        </div>
      </main>

      <DeliveryAgentSubComponent />
      {/* CTA */}
      <FrequentlyComponent />
    </div>
  );
}
