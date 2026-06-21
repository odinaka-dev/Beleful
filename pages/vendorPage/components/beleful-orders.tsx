"use client";

import { FOODVENDORDATA } from "@/helpers/website.helpers";
import Heading from "@/components/ui/Heading";
import Image from "next/image";

export default function BelefulOrdersComponents() {
  return (
    <div className="max-w-[90%] xl:max-w-[1200px] mx-auto my-32">
      <Heading
        className="max-w-[96%] lg:max-w-[960px] xl:max-w-[1200px] mx-auto"
        title="Beleful Offers"
        description="BELEFUL offers a variety of features that support food business growth on campus, features like:"
      />

      <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2">
        {FOODVENDORDATA.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-[32px] min-h-[420px] p-8 lg:p-10"
            style={{
              backgroundColor: item.hexCode,
              color: item.textHexCode,
            }}
          >
            <div className="lg:max-w-[75%]">
              <h2 className="mb-4 text-2xl font-bold leading-tight lg:text-4xl">
                {item.title}
              </h2>

              <p className="text-lg lg:text-[20px] leading-10">
                {item.description}
              </p>
            </div>

            <div className="absolute bottom-0 right-0 w-[72%] lg:w-[40%]">
              <Image
                src={item.image}
                alt={item.title}
                width={200}
                height={100}
                className="object-contain w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
