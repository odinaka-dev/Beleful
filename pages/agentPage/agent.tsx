"use client";

import HeaderComponent from "@/components/layout/header";
import DoubleButton from "@/components/ui/Button";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";
import DeliveryAgentSubComponent from "./components/delivery-agent-sub-component";
import SubFooterComponent from "@/components/layout/sub-footer";

export default function DeliveryAgentPage() {
  return (
    <div>
      <main className="flex flex-col items-center justify-between h-screen overflow-clip bg-banner-bg">
        <div className="w-full max-w-[96%] xl:max-w-[1200px] mx-auto">
          <HeaderComponent />
        </div>
        <div className=" mt-10 lg:mt-0 flex flex-col lg:flex-row items-center max-w-[96%] xl:max-w-[1200px] mx-auto">
          <div className="w-full">
            <h1 className="w-full text-5xl font-extrabold text-center lg:text-left sm:text-6xl md:text-6xl xl:text-8xl">
              Earn while you learn on <br />{" "}
              <span className="relative p-1 font-extrabold bg-sub-heading-color rounded-xl top-4">
                Beleful
              </span>
            </h1>
            <p className="mt-12 text-[20px] sm:text-[24px] font-semibold text-center lg:text-left">
              As a student, sign up as one of our agent, pick up orders and
              deliver at your convenience.
            </p>
            <DoubleButton
              className="mt-10 flex flex-col sm:flex-row w-full items-center justify-start gap-4 text-[18px] md:text-[24px] font-semibold max-w-[80%] xl:max-w-[1200px] mx-auto"
              buttonName="Register as an Agent"
              buttonNameSec="Access our Services"
              padding={8}
              bgColor="#016644"
              textColor="#ffffff"
              linkOne=""
              linkTwo=""
            />
          </div>
          <div className="w-full">
            <Image
              src={BelefulImages.DeliveryAgentImage}
              alt="delivery-banner-image"
              loading="eager"
              className="relative w-[100%]"
            />
          </div>
        </div>
      </main>

      <DeliveryAgentSubComponent />
      <SubFooterComponent />
    </div>
  );
}
