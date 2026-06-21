"use client";

import { Badge, Box } from "@chakra-ui/react";
import Heading from "../ui/Heading";
import { USER_SIGNUP_STEPS } from "@/helpers/website.helpers";
import Image from "next/image";
import { BelefulImages } from "@/constant/image";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function CreateBannerComponent() {
  return (
    <div className="py-24 bg-banner-bg">
      <div className="mx-auto max-w-[90%] lg:my-0 xl:max-w-[1200px]">
        {/* Heading */}
        <Heading
          className="max-w-[90%] lg:max-w-[960px] mx-auto"
          title="Beleful has every student covered."
          description="What do you need? A quick fix after a stressful lecture? A quick dinner before study time? Download BELEFUL and let’s deliver satisfaction that assists learning."
        />

        {/* Swiper */}
        <div className="mt-12">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 4000 }}
            loop
          >
            {USER_SIGNUP_STEPS.map((items, index) => (
              <SwiperSlide key={index}>
                <div className="max-w-[800px] mx-auto flex flex-col items-center justify-between lg:flex-row">
                  <Box className="flex-1">
                    <Badge
                      bg="#00452E"
                      color="white"
                      p={8}
                      py={8}
                      rounded="full"
                      fontSize={"36px"}
                    >
                      {items.step}
                    </Badge>

                    <h1 className="mt-4 text-[36px] font-primary font-bold text-[#00452E] lg:text-3xl">
                      {items.title}
                    </h1>

                    <p className="mt-4 text-sub-text-color text-[18px] sm:text-[24px] font-medium">
                      {items.description}
                    </p>
                  </Box>

                  <Box className="">
                    <Image
                      src={items.image}
                      alt={items.title}
                      loading="eager"
                      className="object-contain w-72 rounded-2xl"
                    />
                  </Box>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div>
        {/* testimonial */}
        <div className="mx-auto max-w-[90%] py-24 xl:max-w-[1200px]">
          <Heading
            className="max-w-[90%] lg:max-w-[960px] mx-auto"
            title="See what filled Belles are saying."
            description="Read what happy students are experiencing everyday on Beleful"
          />
          <div className="relative p-12 mt-24 bg-red-variant rounded-2xl h-[400px]">
            <Image
              src={BelefulImages.TestimonialImage}
              alt="testimonial-image"
              className="absolute left-0 w-40 -bottom-10 md:w-96 md:-bottom-40 lg:w-50 lg:top-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
