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
import uploadsRouter from "./routes/uploads.js";
import { adminSiteRouter, publicSiteRouter } from "./routes/site.js";
import { getSiteSections, toInlineJson } from "./utils/siteContent.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { ensureInitialAdmin } from "./utils/seedAdmin.js";

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
      return callback(Object.assign(new Error("Origin is not allowed by CORS."), { status: 403 }));
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

// Public gallery images are mounted before the API limiter so a busy gallery page
// (or many parents behind one school network) does not exhaust the shared quota.
app.use("/api/uploads", uploadsRouter);
app.use("/api", publicSiteRouter);

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
app.use("/api/admin/site", adminSiteRouter);
app.use("/api", notFound);

// Public pages of the React app; anything else gets the app's "not found" page with a real 404 status.
const sitePages = ["/", "/about", "/admissions", "/gallery", "/leadership"];
const appRoutes = new Set([...sitePages, "/admin"]);

// Absolute site address for share previews and the sitemap. Set PUBLIC_SITE_URL in production.
function siteUrl(req) {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/+$/, "");
  const host = /^[a-z0-9.:-]+$/i.test(req.get("host") || "") ? req.get("host") : "localhost";
  return `${req.protocol}://${host}`;
}

if (isProduction) {
  let indexTemplate;
  app.use(express.static(frontendDistDir, {
    index: false,
    redirect: false,
    setHeaders(res, filePath) {
      // Vite's /assets files have content hashes in their names, so they never change.
      const cache = filePath.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=31536000, immutable" : "public, max-age=604800";
      res.set("Cache-Control", cache);
    }
  }));

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain").send(`User-agent: *\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${siteUrl(req)}/sitemap.xml\n`);
  });

  app.get("/sitemap.xml", (req, res) => {
    const urls = sitePages.map((page) => `  <url><loc>${siteUrl(req)}${page}</loc></url>`).join("\n");
    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  });

  app.get("*", async (req, res, next) => {
    try {
      indexTemplate ??= await fs.promises.readFile(path.join(frontendDistDir, "index.html"), "utf8");
      const page = req.path.replace(/\/+$/, "") || "/";
      res.status(appRoutes.has(page) ? 200 : 404)
        .set("Cache-Control", "no-cache")
        .type("html")
        .send(indexTemplate
          .replaceAll("__SITE_URL__", siteUrl(req))
          // Saved Website manager content, so pages render with it straight away.
          .replace("__SITE_CONTENT__", toInlineJson(await getSiteSections())));
    } catch (error) {
      next(error);
    }
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
