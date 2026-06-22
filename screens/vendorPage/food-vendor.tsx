"use client";

import HeaderComponent from "@/components/layout/header";
import DoubleButton from "@/components/ui/Button";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";
import BelefulOrdersComponents from "@/screens/vendorPage/components/beleful-orders";
import FrequentlyComponent from "@/components/layout/frequently-asked-questions";
import SubFooterComponent from "@/components/layout/sub-footer";
import AvailableVendorComponent from "@/components/layout/available-vendor";

export default function FoodVendorPage() {
  return (
    <div>
      <main className="flex flex-col items-center justify-between h-screen overflow-clip bg-banner-bg">
        <div className="w-full max-w-[96%] xl:max-w-[1200px] mx-auto">
          <HeaderComponent />
        </div>
        <div className="w-full max-w-[92%] xl:max-w-[1200px] mx-auto">
          <h1 className="w-full mt-10 text-5xl font-extrabold text-center sm:text-6xl md:text-6xl xl:text-8xl">
            Become a verified <br />{" "}
            <span className="relative p-1 font-extrabold bg-sub-heading-color rounded-xl top-4">
              Food Vendor
            </span>
          </h1>
          <p className="mt-12 text-[20px] sm:text-[24px] font-semibold text-center">
            As a food vendor on beleful, pick up food requests and earn.
          </p>
          <DoubleButton
            className="mt-10 flex flex-col sm:flex-row w-full items-center justify-center gap-4 text-[18px] md:text-[24px] font-semibold max-w-[80%] xl:max-w-[1200px] mx-auto"
            buttonName="Set up your store"
            buttonNameSec="Access your store"
            padding={8}
            bgColor="#016644"
            textColor="#ffffff"
            linkOne="/vendor/register"
            linkTwo="/vendor/login"
          />
        </div>
        <div className="w-full">
          <Image
            src={BelefulImages.FoodVendor}
            alt="Homepage-banner-image"
            loading="eager"
            className="relative w-screen -bottom-12"
          />
        </div>
      </main>

      <BelefulOrdersComponents />
      {/* make available vendors a reusable components across the webpages */}
      <AvailableVendorComponent />
      <FrequentlyComponent />
      <SubFooterComponent />
    </div>
  );
}
