"use client";

import { BelefulImages } from "@/constant/image";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function PromoPackComponent() {
  return (
    <div className="max-w-[90%] xl:max-w-[1200px] mx-auto mt-12 mb-24">
      <div className="grid items-stretch grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#E67E30] to-[#CB671D] rounded-3xl p-8 md:p-10 min-h-[520px]">
          <div>
            <h2 className="text-white font-bold text-[32px] leading-tight sm:text-[40px] max-w-[85%]">
              Download grid eats today and place order in seconds
            </h2>

            <div className="flex flex-col gap-4 mt-10 max-w-[320px]">
              <Link
                href="#"
                className="flex items-center gap-4 px-6 py-4 text-white transition-colors bg-black rounded-2xl hover:bg-black/80"
              >
                <FaGooglePlay className="text-xl shrink-0" />
                <span className="font-medium">Download on google play</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-6 py-4 text-white transition-colors bg-black rounded-2xl hover:bg-black/80"
              >
                <FaApple className="text-2xl shrink-0" />
                <span className="font-medium">Download on App store</span>
              </Link>
            </div>
          </div>

          {/* promo section */}
          <div className="relative z-10 mt-10">
            <Image
              src={BelefulImages.PercentImage}
              alt="25%_off_promo"
              className="w-[150px]"
            />

            <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 font-semibold text-white rounded-lg bg-[#3773D8] border-2 border-black">
              <span className="w-3 h-3 rounded-full bg-[#FCD34D] border-2 border-black" />
              GRIDW224
            </div>

            <p className="mt-3 font-medium text-white max-w-[320px]">
              Use this promo code in your first order to get up to{" "}
              <span className="text-[#B7D22E] font-semibold">
                25% discount.
              </span>
            </p>
          </div>

          <div className="absolute bottom-0 right-0 w-[45%] max-w-[280px] pointer-events-none">
            <Image
              src={BelefulImages.FoodPackImage}
              alt="Grid Eats food pack"
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
        <div className="hidden overflow-hidden md:grid rounded-3xl">
          <Image
            src={BelefulImages.SubFooterImage}
            alt="grid_eats_image"
            loading="eager"
            placeholder="blur"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
