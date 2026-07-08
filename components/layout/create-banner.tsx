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
    <div className="py-24 bg-[#FFEBDE]">
      <div className="mx-auto max-w-[90%] lg:my-0 xl:max-w-[1200px]">
        {/* Heading */}
        <Heading
          className="max-w-[90%] lg:max-w-[960px] mx-auto"
          title="GRID EATS has every student covered."
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
                      bg="#FF771F"
                      color="#111111"
                      p={{ base: 6, md: 6, lg: 8 }}
                      py={{ base: 5, md: 6, lg: 8 }}
                      rounded="full"
                      fontSize={{ base: "24px", md: "36px" }}
                    >
                      {items.step}
                    </Badge>

                    <h1 className="mt-4 text-[36px] font-primary font-bold text-[#FF771F] lg:text-3xl">
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
                1024: { slidesPerView: 2 },
              }}
              className="!pb-14"
            >
              {TESTIMONIALDATA.map((item, index) => {
                // Data has no images today; render the name's first letter as a
                // fallback avatar, but use an image if one is ever added.
                const image = (item as { image?: StaticImageData }).image;

                return (
                  <SwiperSlide key={index} className="!h-auto">
                    <div className="flex flex-col h-full gap-5 p-6 bg-white shadow-sm rounded-2xl sm:p-7">
                      <StarRating rating={item.rating} />

                      <p className="flex-1 text-[15px] leading-relaxed text-sub-text-color sm:text-base">
                        “{item.message}”
                      </p>

                      <div className="flex items-center gap-3">
                        {image ? (
                          <Image
                            src={image}
                            alt={item.name}
                            className="object-cover rounded-full size-12 shrink-0"
                          />
                        ) : (
                          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF771F] text-lg font-bold uppercase text-white">
                            {item.name.charAt(0)}
                          </span>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-[#111111]">
                            {item.name}
                          </h3>
                          <p className="text-sm truncate text-sub-text-color">
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
