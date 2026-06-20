import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { connectDB, disconnectDB, isDbConnected } from "./utilies/db.js";
import cors from "cors";
import UserRouter from "./routes/Userrouter.js";
import ComplaintRouter from "./routes/Complaintrouter.js";
import FeedbackRouter from "./routes/Feedbackrouter.js";
import NotificationRouter from "./routes/Notificationrouter.js";
import UploadRouter from "./routes/Uploadrouter.js";
import CategoryRouter from "./routes/Categoryrouter.js";
import DepartmentRouter from "./routes/Departmentrouter.js";
import logger from "./utilies/logger.js";
import { bootstrapData } from "./utilies/bootstrap.js";
import { validateEnv } from "./utilies/validateEnv.js";

validateEnv();

const app = express();

app.set("trust proxy", 1);

app.use(pinoHttp({ logger }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(express.json({ limit: "10mb" }));

function getAllowedOrigins() {
  const origins = new Set(["http://localhost:5173", "http://localhost:3000"]);
  if (process.env.FRONTEND_URL) origins.add(process.env.FRONTEND_URL.trim());
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(",").forEach((o) => {
      const trimmed = o.trim();
      if (trimmed) origins.add(trimmed);
    });
  }
  return origins;
}

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = getAllowedOrigins();
      if (allowed.has(origin)) return callback(null, true);

      const localDev =
        process.env.USE_MEMORY_DB === "true" || process.env.NODE_ENV !== "production";
      if (localDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  })
);

app.use("/uploads", UploadRouter);

app.get("/health", (_req, res) => {
  const dbOk = isDbConnected();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "ok" : "degraded",
    service: "CivicEye API",
    database: dbOk ? "connected" : "disconnected",
    apiVersion: "v1",
  });
});

function mountApiRoutes(router) {
  router.use("/user", UserRouter);
  router.use("/complaint", ComplaintRouter);
  router.use("/feedback", FeedbackRouter);
  router.use("/notifications", NotificationRouter);
  router.use("/category", CategoryRouter);
  router.use("/department", DepartmentRouter);
}

const v1Router = express.Router();
mountApiRoutes(v1Router);
app.use("/v1", v1Router);

mountApiRoutes(app);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, _req, res, _next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed" });
  }
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 5001;
let server;

function shutdown(signal) {
  logger.info({ signal }, "Shutting down");
  server?.close(async () => {
    await disconnectDB().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

connectDB().then(async () => {
  await bootstrapData();
  server = app.listen(port, () => {
    logger.info({ port }, "CivicEye API running");
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      logger.error(
        { port },
        `Port ${port} is already in use. Stop the other backend (Ctrl+C in that terminal) or change PORT in backend/.env`
      );
      process.exit(1);
    }
    logger.error({ err }, "Server failed to start");
    process.exit(1);
  });
}).catch((err) => {
  logger.error({ err: err.message }, "Failed to start server");
  process.exit(1);
});
