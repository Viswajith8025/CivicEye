import logger from "./logger.js";

const MIN_KEY_LENGTH = 32;

export function validateEnv() {
  const useMemory = process.env.USE_MEMORY_DB === "true";
  const dbUrl = process.env.DB_URL?.trim();

  if (!useMemory && !dbUrl) {
    logger.error("DB_URL is required (or set USE_MEMORY_DB=true for local demo)");
    process.exit(1);
  }

  const key = process.env.KEY?.trim();
  const isProd = process.env.NODE_ENV === "production";

  if (!key || key.length < MIN_KEY_LENGTH) {
    const msg = `KEY must be at least ${MIN_KEY_LENGTH} characters`;
    if (isProd) {
      logger.error(msg);
      process.exit(1);
    }
    logger.warn(`${msg} — acceptable for local dev only`);
  }

  if (key === "change_me_in_production" || key === "your_jwt_secret_key_here") {
    const msg = "Replace KEY with a strong random secret";
    if (isProd) {
      logger.error(msg);
      process.exit(1);
    }
    logger.warn(`${msg} before production deploy`);
  }
}
