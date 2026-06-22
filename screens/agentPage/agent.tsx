"use client";

import HeaderComponent from "@/components/layout/header";
import DoubleButton from "@/components/ui/Button";
// import { BelefulImages } from "@/constant/image";
// import Image from "next/image";
import DeliveryAgentSubComponent from "./components/delivery-agent-sub-component";
import SubFooterComponent from "@/components/layout/sub-footer";
import Lottie from "lottie-react";
import DeliveryRider from "@/public/lottie/food_delivery_driver.json";

export default function DeliveryAgentPage() {
  return (
    <div>
      <main className="flex flex-col min-h-screen overflow-x-clip bg-banner-bg">
        <div className="mx-auto w-full max-w-[96%] xl:max-w-[1200px]">
          <HeaderComponent />
        </div>

        <div className="mx-auto grid w-full max-w-[96%] flex-1 grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:gap-8 lg:py-0 xl:max-w-[1200px]">
          {/* Copy */}
          <div className="order-1 lg:order-1">
            <h1 className="text-4xl font-extrabold leading-tight text-center sm:text-5xl md:text-6xl lg:text-left xl:text-7xl">
              Earn while you learn <br className="block lg:hidden" /> on{" "}
              <span className="relative inline-block px-2 py-1 top-2 rounded-xl bg-sub-heading-color">
                Beleful
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-[90%] md:max-w-[540px] text-center text-lg font-semibold sm:text-2xl lg:mx-0 lg:text-left">
              As a student, sign up as one of our agents, pick up orders and
              deliver at your convenience.
            </p>

            <DoubleButton
              className="mt-10 flex w-full flex-col items-center justify-center gap-4 text-[18px] font-semibold sm:flex-row md:text-[22px] lg:justify-start"
              buttonName="Register as an Agent"
              buttonNameSec="Access our Services"
              padding={8}
              bgColor="#016644"
              textColor="#ffffff"
              linkOne="/agent/register"
              linkTwo="/agent/login"
            />
          </div>

          {/* Animation */}
          <div className="flex justify-center order-2 lg:order-2">
            <Lottie
              animationData={DeliveryRider}
              loop
              className="w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[520px]"
            />
          </div>
        </div>
      </main>

      <DeliveryAgentSubComponent />
      <SubFooterComponent />
    </div>
  );
}
