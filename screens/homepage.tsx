"use client";

import { Box, InputGroup, Input } from "@chakra-ui/react";
import { Location } from "iconsax-reactjs";

import AvailableVendorComponent from "@/components/layout/available-vendor";
import CreateBannerComponent from "@/components/layout/create-banner";
import FrequentlyComponent from "@/components/layout/frequently-asked-questions";
import HeaderComponent from "@/components/layout/header";
import JoinOurNetwork from "@/components/layout/join-our-network";
import DoubleButton from "@/components/ui/Button";
import { BelefulImages } from "@/constant/image";
import WhatWeAreComponent from "@/components/layout/what-we-are";

export default function Homepage() {
  return (
    <div>
      <main
        className="relative flex flex-col items-center justify-between h-screen bg-center bg-no-repeat bg-cover overflow-clip"
        style={{ backgroundImage: `url(${BelefulImages.HomeBanner.src})` }}
      >
        {/* dark overlay over the background image */}
        {/* <div className="absolute inset-0 bg-black/40" aria-hidden="true" /> */}

        <div className="relative z-10 w-full max-w-[96%] xl:max-w-[1200px] mx-auto">
          <HeaderComponent />
        </div>
        <div className="relative z-10 w-full max-w-[96%] xl:max-w-[1200px] mx-auto h-screen flex items-center flex-col gap-12">
          <h1 className="w-full mt-10 text-5xl font-extrabold text-center sm:text-7xl">
            Ready To Satisfy Your Cravings
          </h1>
          {/* input group */}
          <Box
            bg="white"
            rounded="full"
            p={2}
            px={4}
            mt={2}
            className="items-center hidden gap-6 sm:flex"
          >
            <InputGroup startElement={<Location color={"#111111"} />}>
              <Input
                type="search"
                placeholder="Enter university name or location"
                width={{ base: 100, md: 280 }}
                focusRing="none"
                _focus={{
                  boxShadow: "none",
                  outline: "none",
                  borderColor: "inherit",
                }}
              />
            </InputGroup>
            <DoubleButton
              className="flex items-center justify-center gap-3 font-medium"
              padding={6}
              buttonName="Order Now"
              buttonNameSec="Download App"
              bgColor="#FF771F"
              textColor="#ffffff"
              linkOne="/login"
              linkTwo="/register"
            />
          </Box>
        </div>
      </main>

      <WhatWeAreComponent />
      <JoinOurNetwork />
      <CreateBannerComponent />
      <AvailableVendorComponent />
      <FrequentlyComponent />
    </div>
  );
}
