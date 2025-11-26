import common from "./common.json";
import users from "./users/index.json";
import products from "./products/index.json";
import categories from "./categories/index.json";
import packages from "./packages/index.json";

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
};

export default combined;
