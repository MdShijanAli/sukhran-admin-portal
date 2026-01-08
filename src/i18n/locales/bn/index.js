import common from "./common.json";
import users from "./users/index.json";
import products from "./products/index.json";
import categories from "./categories/index.json";
import packages from "./packages/index.json";
import packageSettings from "./packageSettings/index.json";
import coverage_area from "./coverage_area/index.json";
import roles from "./roles/index.json";
import profile from "./profile/index.json";
import orders from "./orders/index.json";
import delivery from "./delivery/index.json";
import settings from "./settings/index.json";
import coupon from "./coupon/index.json";
import transactions from "./transactions/index.json";
import coinManagement from "./coinManagement/index.json";
import donations from "./donations/index.json";
import referrals from "./referrals/index.json";
import support from "./support/index.json";
import notifications from "./notifications/index.json";
import banners from "./banners/index.json";
import brands from "./brands/index.json";
import reports from "./reports/index.json";

/**
 * follow the file structure.
 * pages
 *    -/index.json
 */

const combined = {
  ...common,
  users,
  products,
  categories,
  packages,
  packageSettings,
  coverage_area,
  roles,
  profile,
  orders,
  delivery,
  settings,
  coupon,
  transactions,
  coinManagement,
  donations,
  referrals,
  support,
  notifications,
  banners,
  brands,
  reports,
};

export default combined;
