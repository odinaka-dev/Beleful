"use client";

import { BelefulImages } from "@/constant/image";
import { Box, Button, Input, InputGroup } from "@chakra-ui/react";
import { SearchFavorite } from "iconsax-reactjs";
import Image from "next/image";
import SplitText from "../ui/SplitText";

export default function SubFooterComponent() {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="bg-green-variant max-w-[96%] xl:max-w-[1200px] mx-auto rounded-3xl mt-12">
      <div className="flex flex-col-reverse items-center justify-between px-8 py-8 lg:py-0 md:px-12 lg:flex-row">
        <Box className="flex-1">
          <SplitText
            text="Check If Beleful is Available in your campus."
            className="text-white text-center sm:text-left font-bold text-[36px] sm:text-[48px] md:text-[60px]"
            delay={2}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
            onLetterAnimationComplete={handleAnimationComplete}
            // showCallback
          />
          <div className="flex items-center justify-between gap-4 p-2 bg-white rounded-full mt-7 search_input">
            <InputGroup startElement={<SearchFavorite />}>
              <Input
                placeholder="Search your vendor"
                border={"none"}
                _focus={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                }}
                _focusVisible={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                }}
                _active={{
                  border: "none",
                  boxShadow: "none",
                }}
              />
            </InputGroup>
            <Button
              bg={"#00452e"}
              color={"white"}
              p={2}
              px={9}
              rounded={"full"}
              fontWeight={"medium"}
              className=""
            >
              Search
            </Button>
          </div>
        </Box>
        <div className="">
          <Image src={BelefulImages.Burger} alt="" className="" />
        </div>
      </div>
    </div>
  );
}

// CALL A SUB COMPONENT THAT SHOWS ALL AVAILABLE VENDORS
