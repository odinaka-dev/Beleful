"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import Heading from "../ui/Heading";
import { WHATWEARECARD } from "@/helpers/website.helpers";
import Image from "next/image";
import DoubleButton from "../ui/Button";

import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";

export default function WhatWeAreComponent() {
  return (
    <div className="my-16 lg:my-36 max-w-[90%] xl:max-w-[1200px] mx-auto">
      <Heading
        className="max-w-[90%] lg:max-w-[960px] mx-auto"
        title="What we Are?"
        description="Beleful connects students to nearby campus food vendors while enabling fellow students earn money by delivering meals across campus in minutes."
      />

      <Box mt={16}>
        <ScrollStack
          useWindowScroll
          itemDistance={80}
          itemScale={0}
          itemStackDistance={40}
          stackPosition="15%"
          scaleEndPosition="5%"
          baseScale={0.9}
        >
          {WHATWEARECARD.map((items, index) => (
            <ScrollStackItem
              key={index}
              itemClassName="!bg-transparent !shadow-none !p-0 !h-auto"
            >
              <Stack
                direction={{
                  base: "column",
                  lg: items.id === "2" ? "row-reverse" : "row",
                }}
                minH={{
                  base: "auto",
                  md: "550px",
                }}
                gap="10"
                px={{
                  base: 8,
                  lg: 20,
                }}
                py={10}
                rounded="2xl"
                bg={items.bghexCode}
                color="white"
                alignItems="center"
              >
                <Box flex={1} className="text-center lg:text-left">
                  <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
                    {items.title}
                  </h1>

                  <Text
                    fontSize={{
                      base: "18px",
                      sm: "xl",
                    }}
                    lineHeight="1.9"
                    mt={3}
                  >
                    {items.description}
                  </Text>

                  <DoubleButton
                    className="mt-8 flex flex-col sm:flex-row w-full items-center justify-center gap-4 text-[18px] md:text-[24px] font-semibold"
                    buttonName="Register online"
                    buttonNameSec="Download our App"
                    padding={8}
                    bgColor="#ffffff"
                    textColor="#016644"
                    linkOne=""
                    linkTwo=""
                  />
                </Box>

                <Box flex={1}>
                  <Image
                    src={items.image}
                    alt={items.title}
                    width={700}
                    height={700}
                    priority
                    className="w-full h-auto"
                  />
                </Box>
              </Stack>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </Box>
    </div>
  );
}
