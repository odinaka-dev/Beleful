"use client";

import { Box, Stack } from "@chakra-ui/react";
import Heading from "../ui/Heading";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";

export default function WhatWeAreComponent() {
  return (
    <div className="mt-16 lg:my-36 max-w-[96%] xl:max-w-[1200px] mx-auto">
      <Heading
        className="max-w-[90%] lg:max-w-[960px] mx-auto"
        title="What We Are?"
        description="GRID EATS connects students to nearby campus food vendors while enabling fellow students earn money by delivering meals across campus in minutes."
      />

      <Box className="mt-12">
        <Stack direction={{ base: "column" }} alignItems={"center"} w="full">
          <Image
            src={BelefulImages.PhoneFrame}
            alt=""
            loading="eager"
            className=""
          />
        </Stack>
      </Box>
    </div>
  );
}
