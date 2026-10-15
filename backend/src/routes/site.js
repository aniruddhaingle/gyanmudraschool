import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { siteSectionKeys, validateSiteSection } from "../../../shared/siteContent.js";
import { requireAdmin } from "../middleware/auth.js";
import { isAllowedImage } from "../middleware/upload.js";
import SiteSection from "../models/SiteSection.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteUnusedSiteImages, parseObjectId, SITE_BUCKET, storeSiteImage, streamImage } from "../utils/media.js";
import { clearSiteSectionsCache, getSiteSections } from "../utils/siteContent.js";

// Public: saved website content (GET /api/site) and its photos (GET /api/site-media/:id).
export const publicSiteRouter = express.Router();

publicSiteRouter.get("/site", asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-cache").json({ sections: await getSiteSections() });
}));

publicSiteRouter.get("/site-media/:id", (req, res) => {
  const id = parseObjectId(req.params.id);
  if (!id || mongoose.connection.readyState !== 1) return res.status(404).json({ message: "Image not found." });
  return streamImage(SITE_BUCKET, id, res, "public, max-age=31536000, immutable");
});

// Admin: edit sections, reset them to the built-in defaults, and upload photos.
export const adminSiteRouter = express.Router();
adminSiteRouter.use(requireAdmin);

// Runs in the background after a save or restore; a failure here never affects the admin's save.
function cleanUpSiteImages() {
  getSiteSections()
    .then(deleteUnusedSiteImages)
    .catch((error) => console.error("Could not clean up unused website photos:", error));
}

const requireDatabase = (req, res, next) => (mongoose.connection.readyState === 1
  ? next()
  : res.status(503).json({ message: "Database is not configured yet. Please set MONGODB_URI." }));

const knownSection = (req, res, next) => (siteSectionKeys.includes(req.params.key)
  ? next()
  : res.status(404).json({ message: "Unknown section." }));

adminSiteRouter.put("/:key", requireDatabase, knownSection, asyncHandler(async (req, res) => {
  const result = validateSiteSection(req.params.key, req.body?.value);
  if (result.error) return res.status(422).json({ message: result.error });

  await SiteSection.findOneAndUpdate(
    { key: req.params.key },
    { value: result.value, updatedBy: req.admin.email || "" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  clearSiteSectionsCache();
  cleanUpSiteImages();
  return res.json({ value: result.value });
}));

adminSiteRouter.delete("/:key", requireDatabase, knownSection, asyncHandler(async (req, res) => {
  await SiteSection.deleteOne({ key: req.params.key });
  clearSiteSectionsCache();
  cleanUpSiteImages();
  return res.json({ message: "Section reset to the original content." });
}));

const uploadSiteImage = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, done) => (/^image\/(jpeg|png|webp)$/.test(file.mimetype)
    ? done(null, true)
    : done(Object.assign(new Error("Only JPG, PNG, or WEBP images are allowed."), { status: 400 })))
}).single("image");

adminSiteRouter.post("/images", requireDatabase, uploadSiteImage, asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Choose a photo to upload." });
  if (!isAllowedImage(req.file)) return res.status(400).json({ message: "The file is not a valid JPG, PNG, or WEBP image." });
  return res.status(201).json({ url: await storeSiteImage(req.file) });
}));
