"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import Heading from "@/components/ui/Heading";
import { FOODVENDORDATA } from "@/helpers/website.helpers";

export default function BelefulOrdersComponents() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setScrollRange(trackRef.current.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  return (
    <section className="pt-24">
      <Heading
        className="max-w-[96%] lg:max-w-[960px] xl:max-w-[1200px] mx-auto"
        title="Grid Eats Offers"
        description="GRIDEATS offers a variety of features that support food business growth on campus, features like:"
      />

      <div className="max-w-[96%] lg:max-w-[960px] xl:max-w-[1400px] mx-auto mt-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 px-[4vw] lg:gap-8"
          > */}
          {FOODVENDORDATA.map((item) => (
            <article
              key={item.id}
              className={`group relative border-2 flex min-h-[440px] w-full md:w-full shrink-0 flex-col overflow-hidden rounded-[32px] p-8 lg:p-12`}
              style={{
                borderColor: item.borderhexCode,
                backgroundColor: item.hexCode,
                color: item.textHexCode,
              }}
            >
              <div className="relative z-10 lg:max-w-[70%]">
                <h3 className="mb-4 text-2xl font-bold leading-tight lg:text-4xl">
                  {item.title}
                </h3>

                <p className="text-[20px] leading-relaxed opacity-90 lg:text-[20px]">
                  {item.description}
                </p>
              </div>

              <div className="pointer-events-none absolute bottom-0 right-0 w-[65%] translate-y-2 transition-transform duration-500 group-hover:translate-y-0 lg:w-[42%]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="object-contain w-full h-auto"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
