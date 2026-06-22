"use client";

import AvailableVendorComponent from "@/components/layout/available-vendor";
import CreateBannerComponent from "@/components/layout/create-banner";
import FrequentlyComponent from "@/components/layout/frequently-asked-questions";
import HeaderComponent from "@/components/layout/header";
import SubFooterComponent from "@/components/layout/sub-footer";
import WhatWeAreComponent from "@/components/layout/what-we-are";
import DoubleButton from "@/components/ui/Button";
import { BelefulImages } from "@/constant/image";

import Image from "next/image";

export default function Homepage() {
  return (
    <div>
      <main className="flex flex-col items-center justify-between h-screen overflow-clip bg-banner-bg">
        <div className="w-full max-w-[96%] xl:max-w-[1200px] mx-auto">
          <HeaderComponent />
        </div>
        <div className="w-full max-w-[96%] xl:max-w-[1200px] mx-auto">
          <h1 className="w-full mt-10 text-5xl font-extrabold text-center sm:text-6xl md:text-6xl xl:text-8xl">
            Ready To Satisfy Your <br />{" "}
            <span className="relative p-1 font-extrabold bg-sub-heading-color rounded-xl top-4">
              Cravings
            </span>
          </h1>
          <DoubleButton
            className="mt-20 flex flex-col sm:flex-row w-full items-center justify-center gap-4 text-[18px] md:text-[24px] font-semibold max-w-[80%] xl:max-w-[1200px] mx-auto"
            buttonName="Quick Order"
            buttonNameSec="Get Started"
            padding={8}
            bgColor="#016644"
            textColor="#ffffff"
            linkOne="/login"
            linkTwo="/register"
          />
        </div>
        <div className="w-full">
          <Image
            src={BelefulImages.homepageBanner}
            alt="Homepage-banner-image"
            loading="eager"
            className="relative w-screen -bottom-12"
          />
        </div>
      </main>

      <WhatWeAreComponent />
      <CreateBannerComponent />
      <AvailableVendorComponent />
      <FrequentlyComponent />
      <SubFooterComponent />
    </div>
  );
}
