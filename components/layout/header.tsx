"use client";

import { useState } from "react";
import { BelefulImages } from "@/constant/image";
import { Stack, Link } from "@chakra-ui/react";
import Image from "next/image";
import DoubleButton from "../ui/Button";
import { HEADERLINKS } from "@/helpers/website.helpers";
import { CloseSquare, HamburgerMenu } from "iconsax-reactjs";

export default function HeaderComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* Header */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        my={6}
        className="
          rounded-3xl border border-[#00452E]/10
          bg-white/80 px-4 py-4 shadow-sm
          backdrop-blur-md lg:px-6
        "
      >
        {/* Left Section */}
        <div className="flex items-center gap-6 lg:gap-16">
          {/* Logo */}
          <Image
            src={BelefulImages.logoImage}
            loading="eager"
            alt="beleful_logo"
            className="w-28 lg:w-auto"
          />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 rounded-full bg-[#F7F7F7] p-2 lg:flex">
            {HEADERLINKS.map((items, index) => (
              <Link
                href={items.link}
                key={index}
                className="
                  group relative overflow-hidden rounded-full
                  px-6 py-3 text-sm font-semibold text-[#00452E]
                  transition-all duration-300 ease-in-out
                  hover:text-white
                "
                _hover={{
                  textDecoration: "none",
                }}
              >
                {/* Animated Background */}
                <span
                  className="
                    absolute inset-0 z-0 scale-0 rounded-full
                    bg-[#00452E]
                    transition-transform duration-300 ease-in-out
                    group-hover:scale-100
                  "
                />

                {/* Text */}
                <span className="relative z-10">{items.menu}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:block">
          <DoubleButton
            className="flex items-center justify-center gap-3 font-medium"
            padding={6}
            buttonName="Login"
            buttonNameSec="Register"
            bgColor="#016644"
            textColor="#ffffff"
            linkOne="/login"
            linkTwo="/register"
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 rounded-2xl hover:scale-105 lg:hidden"
        >
          {isOpen ? (
            <CloseSquare size="28" color="#2e2e2e" variant="TwoTone" />
          ) : (
            <HamburgerMenu size="28" color="#2e2e2e" variant="TwoTone" />
          )}
        </button>
      </Stack>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 z-50 w-full p-6 mt-4 bg-white shadow-2xl top-full rounded-2xl lg:hidden">
          {/* Mobile Links */}
          <div className="flex flex-col gap-3">
            {HEADERLINKS.map((items, index) => (
              <Link
                href={items.link}
                key={index}
                className="
                  rounded-2xl px-4 py-4 text-base
                  font-semibold text-[#00452E]
                  transition-all duration-300
                  hover:bg-[#00452E]
                  hover:text-white
                "
                _hover={{
                  textDecoration: "none",
                }}
              >
                {items.menu}
              </Link>
            ))}
          </div>

          {/* Mobile Buttons */}
          <div className="mt-6">
            <DoubleButton
              className="flex flex-col w-full gap-4 font-medium"
              padding={6}
              buttonName="Login"
              buttonNameSec="Register"
              bgColor="#016644"
              textColor="#ffffff"
              linkOne="/login"
              linkTwo="/register"
            />
          </div>
        </div>
      )}
    </div>
  );
}
