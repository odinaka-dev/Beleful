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
      <div className="mx-auto mt-16 max-w-[90%] xl:max-w-[1200px]">
        <Box
          overflow="hidden"
          rounded={"3xl"}
          className="grid overflow-hidden md:grid-cols-2"
        >
          {/* Left Map Section */}
          <Box className="relative min-h-[350px] lg:min-h-[650px]">
            <Image
              src={BelefulImages.MapImage}
              alt="map-image"
              fill
              priority
              className="object-cover"
            />

            {/* Optional Overlay */}
            <div className="absolute inset-0 bg-black/5" />
          </Box>

          {/* Right Content Section */}
          <Box
            className="
              relative flex flex-col justify-between
              bg-[#B45309]
              px-6 py-10
              sm:px-10
              lg:min-h-[650px]
              lg:px-8 lg:py-12
              xl:px-12
            "
          >
            {/* Text */}
            <div>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
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

            {/* Bottom Product Images */}
            <div className="relative flex items-end justify-end mt-8 ">
              {/* Food Pack */}

              {/* Water Bottle */}
              <Image
                src={BelefulImages.FoodBottle}
                alt="water-bottle"
                className="relative z-20 w-48 sm:w-56 lg:w-60"
              />
            </div>
          </Box>
        </Box>
      </div>
    </section>
  );
}
