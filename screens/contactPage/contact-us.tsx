"use client";

import FrequentlyComponent from "@/components/layout/frequently-asked-questions";
import HeaderComponent from "@/components/layout/header";
import { BelefulImages } from "@/constant/image";
import { Button, Input, InputGroup, Textarea } from "@chakra-ui/react";
import { Call, Sms, User } from "iconsax-reactjs";

const CONTACT_FIELDS = [
  {
    name: "fullName",
    type: "text",
    placeholder: "Your Full Name",
    icon: User,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Your Email Address",
    icon: Sms,
  },
  {
    name: "phone",
    type: "tel",
    placeholder: "Your Phone Number",
    icon: Call,
  },
];

export default function ContactUsPage() {
  return (
    <>
      <main
        className="pt-4 pb-16 mb-32 bg-top bg-no-repeat bg-cover md:bg-contain"
        style={{
          backgroundImage: `url(${BelefulImages.contactBackground.src})`,
        }}
      >
        <div className="w-full max-w-[96%] xl:max-w-[1200px] mx-auto">
          <HeaderComponent />
        </div>

        <div className="relative w-full max-w-[96%] xl:max-w-[900px] mx-auto mt-8 lg:mt-16">
          <form className="rounded-3xl border-2 border-[#111111] bg-white p-6 sm:p-10">
            <h1 className="text-4xl font-extrabold text-[#111111] sm:text-5xl">
              Email us
            </h1>
            <p className="mt-4 max-w-[720px] text-[15px] font-medium leading-relaxed text-sub-text-color sm:text-base">
              Your feedback matters to us. Whether you have a complaint,
              concern, or suggestion, you can reach us through this contact
              form, email us at{" "}
              <a
                href="mailto:hello@grideats.com"
                className="font-semibold text-[#FF771F] underline"
              >
                hello@grideats.com
              </a>
              , or speak with our support team via the in-app chat.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-3">
              {CONTACT_FIELDS.map((field) => {
                const Icon = field.icon;
                return (
                  <InputGroup
                    key={field.name}
                    startElement={<Icon size={18} color="#6B6B6B" />}
                  >
                    <Input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      bg="#F5F5F5"
                      border="none"
                      rounded="xl"
                      height="52px"
                      focusRing="none"
                      _focus={{ boxShadow: "none", outline: "none" }}
                    />
                  </InputGroup>
                );
              })}
            </div>

            {/* Message */}
            <Textarea
              name="message"
              placeholder="Type your complaints or message..."
              bg="#F5F5F5"
              border="none"
              rounded="2xl"
              mt={4}
              p={4}
              minHeight="160px"
              resize="none"
              focusRing="none"
              _focus={{ boxShadow: "none", outline: "none" }}
            />

            {/* Submit */}
            <Button
              type="submit"
              bg="#FF771F"
              color="#ffffff"
              rounded="full"
              px={6}
              py={6}
              mt={6}
              fontWeight="semibold"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                bg: "#FF771F",
                transform: "translateY(-3px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              }}
              _active={{ transform: "scale(0.98)" }}
            >
              Submit Message
            </Button>
          </form>
        </div>
      </main>

      <FrequentlyComponent />
    </>
  );
}
