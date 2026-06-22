"use client";

import { Badge, Box } from "@chakra-ui/react";
import Heading from "../ui/Heading";
import { USER_SIGNUP_STEPS, TESTIMONIALDATA } from "@/helpers/website.helpers";
import Image, { type StaticImageData } from "next/image";
import { Star1 } from "iconsax-reactjs";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/** Five stars, filled up to `rating`. */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star1
          key={i}
          size={18}
          variant="Bold"
          color={i < rating ? "#F5A623" : "#D9D9D9"}
        />
      ))}
    </div>
  );
}

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

          {/* Testimonials: 1 per view on mobile, 2 on tablet, 3 on desktop */}
          <div className="mt-16">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={24}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-14"
            >
              {TESTIMONIALDATA.map((item, index) => {
                // Data has no images today; render the name's first letter as a
                // fallback avatar, but use an image if one is ever added.
                const image = (item as { image?: StaticImageData }).image;

                return (
                  <SwiperSlide key={index} className="!h-auto">
                    <div className="flex h-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm sm:p-7">
                      <StarRating rating={item.rating} />

                      <p className="flex-1 text-[15px] leading-relaxed text-sub-text-color sm:text-base">
                        “{item.message}”
                      </p>

                      <div className="flex items-center gap-3">
                        {image ? (
                          <Image
                            src={image}
                            alt={item.name}
                            className="size-12 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#00452E] text-lg font-bold uppercase text-white">
                            {item.name.charAt(0)}
                          </span>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-[#1E1E1E]">
                            {item.name}
                          </h3>
                          <p className="truncate text-sm text-sub-text-color">
                            {item.role} · {item.school}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
