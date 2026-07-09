import { BelefulImages } from "@/constant/image";
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa6";

export const HEADERLINKS = [
  {
    menu: "Company",
    link: "/",
  },
  {
    menu: "Vendor",
    link: "/vendor",
  },
  {
    menu: "Delivery Agent",
    link: "/agents",
  },
  {
    menu: "Contact us",
    link: "/contact-us",
  },
];

// export const WHATWEARECARD = [
//   {
//     id: "1",
//     title: "E-Food Marketplace",
//     description:
//       "BELEFUL connects students to nearby  already known campus food vendors to get already known foods at affordable price from already known campus vendors.",
//     image: BelefulImages.CardImageone,
//     bghexCode: "#B04D0F",
//   },
//   {
//     id: "2",
//     title: "Food Vendors",
//     description:
//       "BELEFUL connects vendors a digital space to reach out to more places across campus grounds and more students, with minimal marketing and scaling profits.  ",
//     image: BelefulImages.CardImageTwo,
//     bghexCode: "#00452E",
//   },
//   {
//     id: "3",
//     title: "Fast Delivery",
//     description:
//       "BELEFUL creates opportunity for students to earn as one of it’s delivery agents. students signs up and can deliver on the go anywhere anytime around school campus while they earn.",
//     image: BelefulImages.CardImageThree,
//     bghexCode: "#2e2e2e",
//   },
// ];

export const WHATWEARECARD = [
  {
    id: "1",
    title: "Start selling",
    description:
      "Do you a canteen, food store or a cafe on campus. Sign up on beleful app today to reach more customers and places across campus grounds, with minimal marking and start scaling your profit and awareness across campus today.",
    image: BelefulImages.StartSelling,
    bghexCode: "#8CFFC5",
  },
  {
    id: "2",
    title: "Start delivering",
    description:
      "Grid eats creates opportunity for students to earn as one of it’s delivery agents. students signs up and can deliver on the go anywhere anytime around school campus while they earn.",
    image: BelefulImages.StartDelivering,
    bghexCode: "#9ED7FF",
  },
  {
    id: "3",
    title: "Behind the scene",
    description:
      "BELEFUL creates opportunity for students to earn as one of it’s delivery agents. students signs up and can deliver on the go anywhere anytime around school campus while they earn.",
    image: BelefulImages.OrderingImage,
    bghexCode: "#FFFF82",
  },
];

export const USER_SIGNUP_STEPS = [
  {
    step: 1,
    title: "Create Your Account",
    image: BelefulImages.PhoneImage,
    description:
      "Sign up using your email, phone number, or school credentials to get started on BELEFUL.",
  },
  {
    step: 2,
    title: "Verify Your Identity",
    image: BelefulImages.StepTwoImage,
    description:
      "Confirm your account with an OTP sent to your phone or email to ensure secure access.",
  },
  {
    step: 3,
    title: "Start Ordering Food",
    image: BelefulImages.StepThreeImage,
    description:
      "Explore nearby campus vendors, add meals to your cart, and place your first order in seconds.",
  },
];

export const TESTIMONIALDATA = [
  {
    name: "Ayo Balogun",
    role: "University Student",
    school: "University of Lagos",
    message:
      "BELEFUL has made campus life so much easier. I can order food from my hostel and get it delivered in minutes without stress.",
    rating: 5,
  },
  {
    name: "Chinedu Okafor",
    role: "Student Delivery Partner",
    school: "Obafemi Awolowo University",
    message:
      "I literally make money between lectures. I just accept nearby deliveries and earn while moving around campus.",
    rating: 5,
  },
  {
    name: "Fatima Yusuf",
    role: "Campus Vendor",
    school: "Ahmadu Bello University",
    message:
      "My sales increased massively since joining BELEFUL. Students now order directly from my shop every day.",
    rating: 5,
  },
  {
    name: "David Olatunji",
    role: "Student",
    school: "Covenant University",
    message:
      "Fast delivery and reliable student riders. It feels safer and quicker than anything else I've used on campus.",
    rating: 4,
  },
  {
    name: "Blessing Nwosu",
    role: "Student",
    school: "University of Ibadan",
    message:
      "I love that I can support fellow students while getting my food delivered quickly. The idea is brilliant.",
    rating: 5,
  },
];

export const FAQDATA = [
  {
    question: "What is BELEFUL?",
    answer:
      "BELEFUL is a campus food delivery platform that connects students to nearby food vendors while allowing fellow students earn money by delivering meals across campus.",
  },
  {
    question: "How does delivery work on BELEFUL?",
    answer:
      "Once you place an order, nearby student delivery agents can accept the request, pick up your meal from the vendor, and deliver it directly to your hostel, class area, or chosen campus location.",
  },
  {
    question: "Can I become a delivery agent as a student?",
    answer:
      "Yes. Students can sign up as delivery agents, complete verification, and start earning by accepting and delivering food orders around campus.",
  },
  {
    question: "How do vendors join BELEFUL?",
    answer:
      "Campus food vendors can register their business, upload their menu, manage incoming orders, and receive payouts directly through the platform.",
  },
  {
    question: "Is BELEFUL safe to use?",
    answer:
      "Yes. We use account verification, delivery tracking, order confirmations, and student identity checks to help ensure safe and reliable deliveries for both buyers and vendors.",
  },
];

export const FOODVENDORDATA = [
  {
    id: "1",
    title: "Gain more Visibility",
    description:
      "Gain more visibility on GRIDEATS. Reach out to more students across numerous faculty.",
    hexCode: "#FFCB53",
    textHexCode: "#111111",
    borderhexCode: "#DB9A04",
    image: BelefulImages.GainMoreVisibility,
  },
  {
    id: "2",
    title: "Connect with more Customers",
    description:
      "Create an online presence and connection with your customers.",
    hexCode: "#FF5641",
    textHexCode: "#111111",
    borderhexCode: "#B91D0A",
    image: BelefulImages.CardImageone,
  },
  {
    id: "3",
    title: "Generate more Sales",
    description:
      "In addition to your Daily Income, generate more income and sales with wider reach across campus.",
    hexCode: "#2DC83D",
    textHexCode: "#111111",
    borderhexCode: "#028810",
    image: BelefulImages.CardImageTwo,
  },
  {
    id: "4",
    title: "Easy payouts withdrawal",
    description:
      "Earn more, Track your payouts, and  process withdrawal easily, no Debt issue, no student wahala.",
    hexCode: "#FE78E8",
    textHexCode: "#111111",
    borderhexCode: "#98007F",
    image: BelefulImages.EasyPayout,
  },
];

// footer helpers
export const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Why Beleful?", href: "/" },
      { label: "Food Vendors", href: "/vendor" },
      { label: "Delivery Agents", href: "/agents" },
      { label: "How it works", href: "/" },
      { label: "Campuses", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Blog", href: "/" },
      { label: "Partners", href: "/" },
      { label: "Contact us", href: "/contact-us" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
  { label: "Twitter", href: "#", icon: FaXTwitter },
  { label: "Facebook", href: "#", icon: FaFacebookF },
  { label: "Instagram", href: "#", icon: FaInstagram },
];

export const LEGAL_LINKS = [
  { label: "Support", href: "/" },
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Use", href: "/" },
  { label: "Cookie Policy", href: "/" },
];
