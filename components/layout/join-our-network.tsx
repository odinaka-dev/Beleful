"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import Heading from "../ui/Heading";
import { WHATWEARECARD } from "@/helpers/website.helpers";
import Image from "next/image";
import { Button } from "@chakra-ui/react";

import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import { ArrowRight } from "iconsax-reactjs";

export default function JoinOurNetwork() {
  return (
    <div className="mt-16 lg:my-36 max-w-[96%] xl:max-w-[1200px] mx-auto">
      <Heading
        className="max-w-[90%] lg:max-w-[960px] mx-auto"
        title="Join our fast growing network."
        description="GRID EATS connects students to nearby campus food vendors while enabling fellow studentsn earn money by delivering meals across campus in minutes."
      />

      <Box mt={2}>
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
                  base: "300px",
                  md: "500px",
                }}
                gap="10"
                px={{
                  base: 8,
                  lg: 10,
                }}
                py={10}
                rounded="2xl"
                bg={items.bghexCode}
                color="white"
                alignItems="center"
              >
                <Box flex={1} className="text-left">
                  <h1 className="text-3xl font-bold text-[#111111] sm:text-4xl lg:text-5xl">
                    {items.title}
                  </h1>

                  <Text
                    fontSize={{
                      base: "18px",
                      sm: "xl",
                    }}
                    color={"#111111"}
                    fontWeight={600}
                    lineHeight="1.9"
                    mt={3}
                  >
                    {items.description}
                  </Text>

                  <Box
                    color={"#111111"}
                    mt={6}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    cursor={"pointer"}
                  >
                    <Button fontWeight={700}>See more</Button>
                    <ArrowRight size="24" color="#000000" />
                  </Box>
                </Box>

                <Box flex={1}>
                  <Image
                    src={items.image}
                    alt={items.title}
                    width={700}
                    height={700}
                    priority
                    className="h-auto sm:w-full"
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
