import { StaticImageData } from "next/image";

// IMAGE IMPORTS
import logoImage from "@/public/asset/images/logoImage.png";
import homepageBanner from "@/public/asset/images/school-image-bg 1.svg";
import CardImageone from "@/public/asset/images/e-food-marketplace.png";
import CardImageTwo from "@/public/asset/images/vendors-image.png";
import CardImageThree from "@/public/asset/images/fast-delivery-image.png";
import PhoneImage from "@/public/asset/images/create-account-image.png";
import Burger from "@/public/asset/images/burger-image.png";
import TestimonialImage from "@/public/asset/images/testimonial-image.png";
import MapImage from "@/public/asset/images/map.svg";
import FoodBottle from "@/public/asset/images/food-bottle.png";

// IMPORTS FOR FOOD VENDORS PAGE
import FoodVendor from "@/public/asset/images/food-vendor.svg";
import GainMoreVisibility from "@/public/asset/images/card-1.svg";
import EasyPayout from "@/public/asset/images/card-4.svg";

// IMPORTS FOR DELIVERY AGENTS
import DeliveryAgentImage from "@/public/asset/images/delivery-agent.svg";
import EarnImage from "@/public/asset/images/earn-agent.svg";

interface Image {
  logoImage: StaticImageData;
  homepageBanner: StaticImageData;
  CardImageone: StaticImageData;
  CardImageTwo: StaticImageData;
  CardImageThree: StaticImageData;
  PhoneImage: StaticImageData;
  Burger: StaticImageData;
  TestimonialImage: StaticImageData;
  MapImage: StaticImageData;
  FoodBottle: StaticImageData;

  // FOOD VENDORS STATIC IMAGE IMPORTS
  FoodVendor: StaticImageData;
  GainMoreVisibility: StaticImageData;
  EasyPayout: StaticImageData;

  // DELIVERY AGENT STATIC IMAGE IMPORTS
  DeliveryAgentImage: StaticImageData;
  EarnImage: StaticImageData;
}

export const BelefulImages: Image = {
  logoImage,
  homepageBanner,
  CardImageone,
  CardImageTwo,
  CardImageThree,
  PhoneImage,
  Burger,
  TestimonialImage,
  MapImage,
  FoodBottle,

  // FOOD VENDORS IMAGES
  FoodVendor,
  GainMoreVisibility,
  EasyPayout,

  // DELIVERY AGENTS IMAGE
  DeliveryAgentImage,
  EarnImage,
};
