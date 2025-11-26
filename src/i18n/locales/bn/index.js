import common from "./common.json";
import users from "./users/index.json";
import products from "./products/index.json";

/**
 * follow the file structure.
 * pages
 *    -/index.json
 */

const combined = {
  ...common,
  users,
  products,
};

export default combined;
