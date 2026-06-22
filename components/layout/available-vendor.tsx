import React from "react";
import Heading from "../ui/Heading";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";
import { Box } from "@chakra-ui/react";

export default function AvailableVendorComponent() {
  return (
    <section className="py-12 my-20 lg:my-36">
      {/* Heading */}
      <Heading
        className="mx-auto max-w-[90%] lg:max-w-[960px]"
        title="Available Vendors"
        description="Signup and place your order in seconds easily on BELEFUL. Make your belle full by discovering top-rated food vendors around your campus."
      />

      {/* Main Banner */}
      <div className="mx-auto mt-12 max-w-[90%] sm:mt-16 xl:max-w-[1200px]">
        <Box
          overflow="hidden"
          rounded={"3xl"}
          className="grid overflow-hidden md:grid-cols-2"
        >
          {/* Left Map Section */}
          <Box className="relative min-h-[260px] sm:min-h-[360px] md:min-h-full lg:min-h-[650px]">
            <Image
              src={BelefulImages.MapImage}
              alt="map-image"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

            {/* Optional Overlay */}
            <div className="absolute inset-0 bg-black/5" />
          </Box>

          {/* Right Content Section */}
          <Box
            className="
              relative flex flex-col justify-between gap-8
              overflow-hidden bg-[#B45309]
              px-6 py-10
              sm:px-10 sm:py-12
              md:min-h-[420px]
              lg:min-h-[650px] lg:px-8
              xl:px-12
            "
          >
            {/* Text */}
            <div>
              <h1 className="text-center text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-left lg:text-6xl xl:text-7xl">
                PLACE YOUR
                <br />
                ORDER in
                <br />
                <span
                  className="
                    relative top-3 inline-block
                    rounded-2xl bg-[#FCD882]
                    px-4 py-2
                    text-[#1E1E1E]
                  "
                >
                  SECONDS.
                </span>
              </h1>
            </div>

            {/* Bottom Product Image */}
            <div className="flex justify-center">
              <Image
                src={BelefulImages.FoodBottle}
                alt="water-bottle"
                className="relative z-20 h-auto w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px] xl:bottom-24"
              />
            </div>
          </Box>
        </Box>
      </div>
    </section>
  );
}
