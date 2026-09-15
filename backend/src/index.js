import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import admissionsRouter from "./routes/admissions.js";
import adminRouter from "./routes/admin.js";
import galleryRouter from "./routes/gallery.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { ensureInitialAdmin } from "./utils/seedAdmin.js";
import { streamImage } from "./utils/media.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistDir = path.resolve(__dirname, "..", "..", "frontend", "dist");
const uploadDir = path.resolve(__dirname, "..", "uploads");

function getAllowedOrigins() {
  return (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function validateProductionConfig() {
  if (!isProduction) return;
  const required = ["MONGODB_URI", "JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required production configuration: ${missing.join(", ")}`);
  if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters in production.");
}

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"]
          }
        }
      : false,
    crossOriginResourcePolicy: { policy: "same-site" }
  })
);
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || getAllowedOrigins().includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: false, limit: "30kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected || !isProduction ? 200 : 503).json({ status: connected ? "ok" : "degraded", database: connected ? "connected" : "offline" });
});

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 180,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.use("/api/admissions", admissionsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/gallery", galleryRouter);
app.get("/api/uploads/:id", (req, res) => streamImage(req.params.id, res));

if (isProduction) {
  app.use(express.static(frontendDistDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistDir, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

async function start() {
  validateProductionConfig();
  await fs.promises.mkdir(uploadDir, { recursive: true });

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.warn("JWT_SECRET should be set to a long random value before production deployment.");
  }

  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
    await ensureInitialAdmin();
    console.log("MongoDB connected");
  } else {
    console.warn("MONGODB_URI is not set. API routes requiring persistence will return a setup error.");
  }

  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down.`);
    server.close(() => mongoose.connection.close(false).finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
