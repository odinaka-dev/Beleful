"use client";

import { Link } from "@chakra-ui/react";
import Image from "next/image";
import { ArrowRight } from "iconsax-reactjs";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { BelefulImages } from "@/constant/image";
import SubFooterComponent from "./sub-footer";
import PromoPackComponent from "./promo-pack";
import {
  FOOTER_LINKS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
} from "@/helpers/website.helpers";

export default function FooterComponent() {
  return (
    <footer className="pt-16 bg-heading-color">
      <PromoPackComponent />
      <SubFooterComponent />
      <div className="mx-auto mt-12 max-w-[96%] xl:max-w-[1400px]">
        <div className="relative pb-20 overflow-hidden text-white rounded-3xl sm:pb-28 lg:pb-36">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
            <div className="px-8 py-12 border-b border-white/10 md:px-12 lg:border-b-0 lg:border-r">
              <div className="flex flex-col gap-6 md:items-start md:justify-between">
                <Image
                  src={BelefulImages.logoImage}
                  alt="grideats_logo"
                  className="w-32 h-auto"
                />
                <p className="max-w-[16rem] text-sm leading-relaxed text-white/60">
                  Because satisfaction that meets luxurious expectations should
                  never be more than a few steps away.
                </p>
              </div>

              {/* Link columns */}
              <div className="grid grid-cols-2 gap-8 mt-12 sm:grid-cols-3">
                {FOOTER_LINKS.map((column) => (
                  <div key={column.title}>
                    <h3 className="text-base font-bold text-white font-heading">
                      {column.title}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {column.links.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="text-sm transition-colors text-white/60 hover:text-sub-heading-color"
                            _hover={{ textDecoration: "none" }}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Social column */}
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Social
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {SOCIAL_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-2 text-sm transition-colors group text-white/60 hover:text-sub-heading-color"
                            _hover={{ textDecoration: "none" }}
                          >
                            <Icon className="text-sm" />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right — CTA */}
            <div className="relative px-8 py-12 md:px-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-variant">
                Get Started
              </p>
              <h2 className="mt-4 max-w-[18ch] font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
                Get the Grid Eats app now on app store or play store
              </h2>

              {/* App download buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="#"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-white transition-colors bg-red-variant rounded-xl hover:bg-red-variant/85"
                >
                  <FaGooglePlay className="text-lg shrink-0" />
                  Download on googleplay
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-white transition-colors bg-red-variant rounded-xl hover:bg-red-variant/85"
                >
                  <FaApple className="text-lg shrink-0" />
                  Download on Appstore
                </Link>
              </div>

              {/* Email signup pill */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center justify-between max-w-md gap-2 p-2 pl-6 mt-8 bg-white rounded-full"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email Address"
                  className="w-full text-sm bg-transparent outline-none text-ash-variant placeholder:text-ash-variant/50"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="flex items-center justify-center w-10 h-10 text-white transition-transform rounded-full shrink-0 bg-red-variant hover:scale-105"
                >
                  <ArrowRight size={20} color="#ffffff" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-10 flex flex-col items-center gap-4 px-8 py-6 text-sm border-t border-white/10 text-white/60 md:flex-row md:justify-between md:px-12">
            <p>
              © {new Date().getFullYear()} GridEats Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:text-sub-heading-color"
                  _hover={{ textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Oversized brand watermark */}
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 w-full text-center font-heading font-extrabold leading-none text-transparent bg-gradient-to-b from-red-variant to-red-variant/10 bg-clip-text text-[22vw] lg:text-[18vw]"
          >
            GridEats
          </span>
        </div>
      </div>
    </footer>
  );
}
