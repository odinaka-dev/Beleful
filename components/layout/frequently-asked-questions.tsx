"use client";

import { useState } from "react";
import Heading from "../ui/Heading";
import { Box, Text } from "@chakra-ui/react";
import { FAQDATA } from "@/helpers/website.helpers";

function FrequentlyComponent() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <section className="mx-auto my-20 max-w-[90%] xl:max-w-[1200px] lg:my-36">
      {/* Heading */}
      <Heading
        className="mx-auto max-w-[90%] lg:max-w-[800px]"
        title="Frequently Asked Questions"
        description="Ask your preferred questions."
      />

      {/* FAQ Container */}
      <Box className="grid gap-6 mt-16  lg:grid-cols-2">
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
