"use client";

import { useState } from "react";
import { Add, Minus } from "iconsax-reactjs";
import Heading from "../ui/Heading";
import { Box, Text } from "@chakra-ui/react";
import { FAQDATA } from "@/helpers/website.helpers";

function FrequentlyComponent() {
  const [activeFaq, setActiveFaq] = useState(0);
  // Mobile/tablet accordion: -1 means every panel is collapsed.
  const [openFaq, setOpenFaq] = useState<number>(-1);

  return (
    <section className="mx-auto my-20 max-w-[90%] xl:max-w-[1200px] lg:my-36">
      {/* Heading */}
      <Heading
        className="mx-auto max-w-[90%] lg:max-w-[800px]"
        title="Frequently Asked Questions"
        description="Ask your preferred questions."
      />

      {/* Accordion — mobile & tablet only (below lg) */}
      <div className="mt-12 flex flex-col gap-4 lg:hidden">
        {FAQDATA.map((item, index) => {
          const isOpen = openFaq === index;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-3xl border transition-colors duration-300 ${
                isOpen
                  ? "border-[#1E1E1E] bg-[#1E1E1E] text-white"
                  : "border-gray-200 bg-white text-[#111111]"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
              >
                <h2 className="text-base font-medium sm:text-lg">
                  {item.question}
                </h2>
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    isOpen ? "bg-white text-[#1E1E1E]" : "bg-[#F2F2F2] text-[#1E1E1E]"
                  }`}
                >
                  {isOpen ? <Minus size={18} /> : <Add size={18} />}
                </span>
              </button>

              {/* Dropdown answer — grid-rows trick gives a smooth height transition */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-white/85 sm:px-6 sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Container — desktop (lg and up) keeps the original two-column layout */}
      <Box className="mt-16 hidden gap-6 lg:grid lg:grid-cols-2">
        {/* Left Questions */}
        <Box className="flex flex-col gap-5">
          {FAQDATA.map((item, index) => {
            const isActive = activeFaq === index;

            return (
              <button
                key={index}
                onClick={() => setActiveFaq(index)}
                className={`
                  w-full rounded-[28px] border px-6 py-6
                  text-left transition-all duration-300
                  ${
                    isActive
                      ? "border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-xl"
                      : "border-gray-200 bg-white text-[#111111] hover:border-[#00452E]/30 hover:bg-[#F8F8F8]"
                  }
                `}
              >
                <h2 className="text-lg font-medium sm:text-xl lg:text-2xl">
                  {item.question}
                </h2>
              </button>
            );
          })}
        </Box>

        {/* Right Answer Card */}
        <Box
          className="
            rounded-[32px] bg-[#161616]
            px-6 py-10 text-white
            sm:px-10 sm:py-14
            lg:min-h-[520px]
          "
        >
          <h1 className="text-3xl font-bold sm:text-4xl">Ans:</h1>

          <div className="flex items-center justify-center h-full py-16  lg:px-8">
            <Text
              className="
                max-w-[500px] text-center
                text-xl leading-[2]
                sm:text-2xl
              "
            >
              <span className="font-bold">
                {FAQDATA[activeFaq].question.replace("?", "").split(" ")[0]}
              </span>{" "}
              {FAQDATA[activeFaq].answer}
            </Text>
          </div>
        </Box>
      </Box>
    </section>
  );
}

export default FrequentlyComponent;
