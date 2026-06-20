import { seedCategoriesIfEmpty } from "./categorySeed.js";
import { seedDepartmentsIfEmpty } from "../services/departmentService.js";
import { seedDemoUsersIfEnabled } from "./seedDemoUsers.js";
import logger from "./logger.js";

export async function bootstrapData() {
  try {
    await seedCategoriesIfEmpty();
    await seedDepartmentsIfEmpty();
    await seedDemoUsersIfEnabled();
  } catch (error) {
    logger.error({ err: error.message }, "Bootstrap data failed");
  }
}
