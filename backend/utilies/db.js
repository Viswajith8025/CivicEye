import mongoose from "mongoose";
import "dotenv/config";
import logger from "./logger.js";

const url = process.env.DB_URL;
let memoryServer;

export async function connectDB() {
  let connectUrl = url;

  if (!connectUrl && process.env.USE_MEMORY_DB !== "true") {
    logger.error("DB_URL is required (or set USE_MEMORY_DB=true for local demo)");
    process.exit(1);
  }

  if (process.env.USE_MEMORY_DB === "true" || connectUrl === "memory") {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    connectUrl = memoryServer.getUri("civiceye");
    logger.info("Using in-memory MongoDB (demo mode)");
  }

  try {
    await mongoose.connect(connectUrl);
    logger.info("connected to database");
  } catch (error) {
    const hint =
      error.message?.includes("auth")
        ? " Check DB_URL username/password (Atlas: URL-encoded password, IP allowlist)."
        : error.message?.includes("ECONNREFUSED")
          ? " Start MongoDB locally, Docker, or set USE_MEMORY_DB=true in backend/.env"
          : "";
    logger.error(`error while connecting to database:${hint}`, error.message);
    process.exit(1);
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
