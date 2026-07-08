import React from "react";
import Heading from "../ui/Heading";
import { BelefulImages } from "@/constant/image";
import Image, { StaticImageData } from "next/image";
import { Box } from "@chakra-ui/react";
import { Store } from "lucide-react";

type Pin = {
  src: StaticImageData;
  alt: string;
  /** position on the map, as percentages of the map container */
  top: string;
  left: string;
};

const MAP_PINS: Pin[] = [
  { src: BelefulImages.unilag, alt: "UNILAG", top: "5%", left: "13%" },
  { src: BelefulImages.lasu, alt: "LASU", top: "12%", left: "55%" },
  { src: BelefulImages.convenant, alt: "CONVENANT", top: "24%", left: "13%" },
  { src: BelefulImages.caleb, alt: "CALEB", top: "45%", left: "60%" },
  { src: BelefulImages.lasustech, alt: "LASU TECH", top: "62%", left: "5%" },
  { src: BelefulImages.yabatech, alt: "YABA TECH", top: "79%", left: "50%" },
];

const VENDORS: string[] = [
  "Iya Amala Spot – LASU",
  "Ene's Kitchen – LASU",
  "Food Villa – CALEB",
  "Grillz Spot – UNILAG",
  "ile ounje – YABA TECH",
  "Catherine Kitchen – LASU TECH",
  "Uncle B small chops – LASU",
  "Kemi's Food House – CONVENANT",
];

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
      <div className="mx-auto mt-12 max-w-[90%] sm:mt-16 xl:max-w-[1300px]">
        <Box
          overflow="hidden"
          rounded={"3xl"}
          className="grid overflow-hidden border border-[#E5E5E5] md:grid-cols-2"
        >
          {/* Left Map Section */}
          <Box className="relative min-h-[360px] sm:min-h-[480px] md:min-h-full lg:min-h-[650px]">
            <Image
              src={BelefulImages.MapImage}
              alt="campus map"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

            {/* School location pins */}
            {MAP_PINS.map((pin) => (
              <div
                key={pin.alt}
                className="absolute z-10 w-[22%] max-w-[140px] min-w-[70px]"
                style={{ top: pin.top, left: pin.left }}
              >
                <Image
                  src={pin.src}
                  alt={pin.alt}
                  className="h-auto w-full drop-shadow-md"
                />
              </div>
            ))}

            {/* Bottom hint */}
            <div className="absolute inset-x-4 bottom-4 z-20 flex items-center gap-2 rounded-full border border-[#F2711D] bg-white/95 px-4 py-2.5 shadow-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2711D] text-white">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
              </span>
              <p className="text-[11px] font-medium leading-tight text-[#1E1E1E] sm:text-xs">
                Click on any live location on the map to order from restaurants
                and food vendor around your campus.
              </p>
            </div>
          </Box>

          {/* Right Vendor List Section */}
          <Box className="flex flex-col bg-white">
            {/* List header */}
            <div className="flex items-center gap-3 bg-[#FDECDD] px-6 py-6 sm:px-8">
              <span className="h-3 w-3 shrink-0 rounded-full bg-[#F2711D]" />
              <h2 className="text-xl font-bold text-[#1E1E1E] sm:text-2xl">
                Restaurants And Food vendors
              </h2>
            </div>

            {/* Vendor rows */}
            <div className="flex flex-1 flex-col gap-3 px-6 py-6 sm:px-8">
              {VENDORS.map((vendor) => (
                <button
                  key={vendor}
                  type="button"
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#E5E5E5] px-5 py-4 text-left transition-colors hover:border-[#F2711D] hover:bg-[#FFF7F0]"
                >
                  <span className="text-base font-medium text-[#1E1E1E] sm:text-lg">
                    {vendor}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDECDD] text-[#F2711D]">
                    <Store size={18} />
                  </span>
                </button>
              ))}
            </div>
          </Box>
        </Box>
      </div>
    </section>
  );
}
