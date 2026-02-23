import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Route title mapping
const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/orders": "Orders",
  "/banners": "Banners",
  "/products": "Products",
  "/products/create": "Create Product",
  "/products/edit": "Edit Product",
  "/products/view": "Product Details",
  "/brands": "Brands",
  "/categories": "Categories",
  "/packages": "Packages",
  "/packages/create": "Create Package",
  "/packages/edit": "Edit Package",
  "/packages/view": "Package Details",
  "/package/settings": "Package Settings",
  "/coverage-areas": "Coverage Areas",
  "/content-management": "Content Management",
  "/profile": "Profile",
  "/reports": "Reports",
  "/reports/transactions": "Transaction Report",
  "/reports/donations": "Donation Report",
  "/reports/coins": "Coin Report",
  "/reports/referrals": "Referral Report",
  "/reports/package-sales": "Package Sales Report",
  "/reports/package-orders": "Package Orders Report",
  "/reports/regular-sales": "Regular Sales Report",
  "/reports/regular-orders": "Regular Orders Report",
  "/delivery": "Delivery",
  "/transactions": "Transactions",
  "/support": "Support",
  "/support/create-ticket": "Create Support Ticket",
  "/coupons": "Coupons",
  "/returns": "Returns",
  "/coin-management": "Coin Management",
  "/family": "Family",
  "/analytics": "Analytics",
  "/marketing": "Marketing",
  "/role-management": "Role Management",
  "/donations": "Donations",
  "/referrals": "Referrals",
  "/notification-settings": "Notification Settings",
  "/settings": "Settings",
  "/login": "Login",
  "/forgot-password": "Forgot Password",
};

const APP_NAME = import.meta.env.VITE_BRAND_NAME || "Sukhran Admin Portal";

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // Try to find exact match first
    let pageTitle = routeTitles[path];

    // If not found, try to match dynamic routes (e.g., /products/edit/123)
    if (!pageTitle) {
      for (const [route, title] of Object.entries(routeTitles)) {
        if (route.includes("edit") && path.includes("/edit/")) {
          pageTitle = title;
          break;
        }
        if (route.includes("view") && path.includes("/view/")) {
          pageTitle = title;
          break;
        }
      }
    }

    // Set the document title
    if (pageTitle) {
      document.title = `${pageTitle} | ${APP_NAME}`;
    } else {
      document.title = APP_NAME;
    }
  }, [location.pathname]);
};
