"use client";

import Heading from "@/components/ui/Heading";
import { BelefulImages } from "@/constant/image";
import Image from "next/image";

export default function DeliveryAgentSubComponent() {
  return (
    <div className="max-w-[90%] xl:max-w-[1200px] mx-auto my-32">
      <Heading
        className="max-w-[90%] lg:max-w-[760px] mx-auto"
        title="Student Struggles"
        description="We understand the struggle of every student, keeping up with cash
just enough to fund day to day campus expenses. On Beleful, 
you can earn whenever and wherever on campus."
      />
      <div className="mt-20">
        <Image
          src={BelefulImages.EarnImage}
          alt=""
          className=""
          loading="eager"
        />
      </div>
    </div>
  );
}
