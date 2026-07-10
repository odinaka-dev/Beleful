import { StaticImageData } from "next/image";

// IMAGE IMPORTS
import logoImage from "@/public/asset/images/logoImage.svg";
import CardImageone from "@/public/asset/images/e-food-marketplace.png";
import CardImageTwo from "@/public/asset/images/vendors-image.png";
import CardImageThree from "@/public/asset/images/fast-delivery-image.png";
import PhoneImage from "@/public/asset/images/create-account-image.png";
import StepTwoImage from "@/public/asset/images/step-2.png";
import StepThreeImage from "@/public/asset/images/step-3.png";
import Burger from "@/public/asset/images/burger-image.png";
import TestimonialImage from "@/public/asset/images/testimonial-image.png";
import MapImage from "@/public/asset/images/map.svg";
import FoodBottle from "@/public/asset/images/food-bottle.png";
import HomeBanner from "@/public/asset/images/home-banner.png";
import schoolImage from "@/public/asset/images/school-banner.svg";
import OrderingImage from "@/public/asset/images/ordering.png";
import StartDelivering from "@/public/asset/images/start-delivering.png";
import StartSelling from "@/public/asset/images/start-selling.png";
import SubFooterImage from "@/public/asset/images/sub-footer-image.png";
import FoodPackImage from "@/public/asset/images/food-pack.png";
import PercentImage from "@/public/asset/images/percent-off.png";
import PhoneFrame from "@/public/asset/images/phone-frame.png";
import unilag from "@/public/asset/images/unilag.svg";
import lasu from "@/public/asset/images/lasu.svg";
import convenant from "@/public/asset/images/convenant.svg";
import lasustech from "@/public/asset/images/lasustech.svg";
import yabatech from "@/public/asset/images/yabatech.svg";
import caleb from "@/public/asset/images/caleb.svg";
import bannerBackground from "@/public/asset/images/banner-background.svg";
import contactBackground from "@/public/asset/images/contact-background.svg";

// IMPORTS FOR FOOD VENDORS PAGE
import FoodVendor from "@/public/asset/images/food-vendor.svg";
import GainMoreVisibility from "@/public/asset/images/card-1.svg";
import EasyPayout from "@/public/asset/images/card-4.svg";
import deliveryBackground from "@/public/asset/images/delivery-background.svg";
import deliveryAgent from "@/public/asset/images/delivery-agent.svg";
import earnDrop from "@/public/asset/images/agent-1.svg";
import stayCampus from "@/public/asset/images/agent-2.svg";
import buildReputation from "@/public/asset/images/agent-3.svg";
import flexibleHours from "@/public/asset/images/agent-4.png";

interface Image {
  Burger: StaticImageData;
  CardImageone: StaticImageData;
  CardImageTwo: StaticImageData;
  CardImageThree: StaticImageData;
  FoodBottle: StaticImageData;
  HomeBanner: StaticImageData;
  logoImage: StaticImageData;
  MapImage: StaticImageData;
  PhoneImage: StaticImageData;
  StepTwoImage: StaticImageData;
  StepThreeImage: StaticImageData;
  TestimonialImage: StaticImageData;
  OrderingImage: StaticImageData;
  StartDelivering: StaticImageData;
  StartSelling: StaticImageData;
  SubFooterImage: StaticImageData;
  FoodPackImage: StaticImageData;
  PercentImage: StaticImageData;
  PhoneFrame: StaticImageData;
  unilag: StaticImageData;
  lasu: StaticImageData;
  convenant: StaticImageData;
  lasustech: StaticImageData;
  yabatech: StaticImageData;
  caleb: StaticImageData;
  bannerBackground: StaticImageData;
  schoolImage: StaticImageData;
  contactBackground: StaticImageData;

  // FOOD VENDORS STATIC IMAGE IMPORTS
  FoodVendor: StaticImageData;
  GainMoreVisibility: StaticImageData;
  EasyPayout: StaticImageData;
  deliveryBackground: StaticImageData;
  deliveryAgent: StaticImageData;
  earnDrop: StaticImageData;
  stayCampus: StaticImageData;
  buildReputation: StaticImageData;
  flexibleHours: StaticImageData;
}

export const BelefulImages: Image = {
  logoImage,
  CardImageone,
  CardImageTwo,
  CardImageThree,
  PhoneImage,
  StepTwoImage,
  StepThreeImage,
  Burger,
  TestimonialImage,
  MapImage,
  FoodBottle,
  HomeBanner,
  OrderingImage,
  StartDelivering,
  StartSelling,
  SubFooterImage,
  FoodPackImage,
  PercentImage,
  PhoneFrame,
  unilag,
  lasu,
  convenant,
  lasustech,
  yabatech,
  caleb,
  bannerBackground,
  schoolImage,
  contactBackground,

  // FOOD VENDORS IMAGES
  FoodVendor,
  GainMoreVisibility,
  EasyPayout,
  deliveryBackground,
  deliveryAgent,
  earnDrop,
  stayCampus,
  buildReputation,
  flexibleHours,
};
