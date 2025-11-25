import common from "./common.json";
import users from "./users/index.json";

/**
 * follow the file structure.
 * pages
 *    -/index.json
 */

const combined = {
  ...common,
  users,
};

export default combined;
