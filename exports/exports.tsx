// all client page imports goes here
export { default as Homepage } from "@/screens/homepage";
export { default as VendorPage } from "@/screens/vendorPage/food-vendor";
export { default as DeliveryAgent } from "@/screens/agentPage/agent";
export { default as ContactUs } from "@/screens/contactPage/contact-us";

// all auth imports goes here
export { default as LoginPage } from "@/screens/auth/login-page";
export { default as StudentSignupPage } from "@/screens/auth/student-signup";
export { default as VendorLoginPage } from "@/screens/auth/vendor-login";
export { default as VendorRegisterPage } from "@/screens/auth/vendor-register";
export { default as AgentLoginPage } from "@/screens/auth/agent-login";
export { default as AgentRegisterPage } from "@/screens/auth/agent-register";
export { default as AdminLoginPage } from "@/screens/auth/admin-login";

// student app imports goes here
// NOTE: these live in screens/ (not pages/) — pages/ is the Pages Router, so
// placing provider/param-dependent screens there creates phantom routes that
// break the build during prerender.
export { default as StudentDashboard } from "@/screens/student/dashboard";
export { default as VendorStorePage } from "@/screens/student/vendor-store";
export { default as CartPage } from "@/screens/student/cart";
export { default as CheckoutPage } from "@/screens/student/checkout";
export { default as OrderTrackingPage } from "@/screens/student/order-tracking";
export { default as ExplorePage } from "@/screens/student/explore";
export { default as OrdersPage } from "@/screens/student/orders";
export { default as ProfilePage } from "@/screens/student/profile";

// agent dashboard imports goes here
export { default as AgentDashboard } from "@/screens/agent/dashboard";
export { default as AgentEarnings } from "@/screens/agent/earnings";
export { default as AgentProfile } from "@/screens/agent/profile";

// vendor dashboard imports goes here
export { default as VendorDashboard } from "@/screens/vendor/dashboard";
export { default as VendorMenu } from "@/screens/vendor/menu";
export { default as VendorWallet } from "@/screens/vendor/wallet";
export { default as VendorSettings } from "@/screens/vendor/settings";

// admin dashboard imports goes here
export { default as AdminDashboard } from "@/screens/admin/dashboard";
