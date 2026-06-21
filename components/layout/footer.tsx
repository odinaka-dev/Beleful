"use client";

import { Link } from "@chakra-ui/react";
import Image from "next/image";
import { ArrowRight } from "iconsax-reactjs";
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa6";
import { BelefulImages } from "@/constant/image";

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Why Beleful?", href: "/" },
      { label: "Food Vendors", href: "/vendor" },
      { label: "Delivery Agents", href: "/agents" },
      { label: "How it works", href: "/" },
      { label: "Campuses", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Blog", href: "/" },
      { label: "Partners", href: "/" },
      { label: "Contact us", href: "/contact-us" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
  { label: "Twitter", href: "#", icon: FaXTwitter },
  { label: "Facebook", href: "#", icon: FaFacebookF },
  { label: "Instagram", href: "#", icon: FaInstagram },
];

const LEGAL_LINKS = [
  { label: "Support", href: "/" },
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Use", href: "/" },
  { label: "Cookie Policy", href: "/" },
];

export default function FooterComponent() {
  return (
    <footer className="bg-heading-color">
      <div className="mx-auto mt-12 max-w-[96%] xl:max-w-[1200px]">
        <div className="relative overflow-hidden text-white rounded-3xl">
          {/* Top: links + CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — brand + link columns */}
            <div className="px-8 py-12 border-b border-white/10 md:px-12 lg:border-b-0 lg:border-r">
              {/* Brand */}
              <div className="flex flex-col gap-6 md:items-start md:justify-between">
                <span className="text-3xl font-bold tracking-tight text-white font-heading">
                  Beleful
                </span>
                <p className="max-w-[16rem] text-sm leading-relaxed text-white/60">
                  Because satisfaction that meets luxurious expectations should
                  never be more than a few taps away.
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
              <h2 className="mt-4 max-w-[14ch] font-heading text-5xl font-bold leading-[1.05] text-white md:text-6xl">
                Get the Beleful app
              </h2>

              {/* Email signup pill */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center justify-between max-w-md gap-2 p-2 pl-6 mt-10 bg-white rounded-full"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  className="w-full text-sm bg-transparent outline-none text-ash-variant placeholder:text-ash-variant/50"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="flex items-center justify-center w-12 h-12 text-white transition-transform rounded-full shrink-0 bg-red-variant hover:scale-105"
                >
                  <ArrowRight size={22} color="#ffffff" />
                </button>
              </form>

              {/* Food illustration */}
              <Image
                src={BelefulImages.FoodBottle}
                alt="Beleful food"
                className="absolute hidden object-contain pointer-events-none select-none -bottom-2 right-4 w-44 md:block lg:w-56"
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center gap-4 px-8 py-6 text-sm border-t border-white/10 text-white/60 md:flex-row md:justify-between md:px-12">
            <p>
              © {new Date().getFullYear()} Beleful Inc. All rights reserved.
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
        </div>
      </div>
    </footer>
  );
}
