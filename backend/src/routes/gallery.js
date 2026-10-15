import express from "express";
import { body } from "express-validator";
import { requireAdmin } from "../middleware/auth.js";
import GalleryEvent from "../models/GalleryEvent.js";
import { isAllowedImage, uploadGalleryPhotos } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteGalleryImage, parseObjectId, storeGalleryImage } from "../utils/media.js";
import { handleValidation } from "../utils/validate.js";

const router = express.Router();
const MAX_PHOTOS_PER_EVENT = 60;

const eventRules = (optional) => {
  const field = (name) => (optional ? body(name).optional() : body(name));
  return [
    field("title").trim().isLength({ min: 2, max: 100 }).withMessage("Event name must be 2-100 characters."),
    field("tag").trim().isLength({ min: 2, max: 60 }).withMessage("Category must be 2-60 characters."),
    field("note").trim().isLength({ min: 8, max: 600 }).withMessage("Story must be 8-600 characters."),
    body("theme").optional().trim().matches(/^[a-z-]{0,30}$/).withMessage("Unknown theme.")
  ];
};

async function storeUploadedPhotos(files = []) {
  if (files.some((file) => !isAllowedImage(file))) {
    throw Object.assign(new Error("One or more files are not valid JPG, PNG, or WEBP images."), { status: 400 });
  }
  return Promise.all(files.map((file) => storeGalleryImage(file)));
}

async function findEvent(req, res) {
  const id = parseObjectId(req.params.id);
  const event = id ? await GalleryEvent.findById(id) : null;
  if (!event) res.status(404).json({ message: "Event not found." });
  return event;
}

router.get("/events", asyncHandler(async (req, res) => {
  res.json({ events: await GalleryEvent.find().sort({ createdAt: -1 }).limit(200).lean() });
}));

router.post("/events", requireAdmin, uploadGalleryPhotos, eventRules(false), handleValidation, asyncHandler(async (req, res) => {
  const photos = await storeUploadedPhotos(req.files);
  const { title, tag, note, theme = "" } = req.body;
  const event = await GalleryEvent.create({ title, tag, note, theme, photos });
  res.status(201).json({ event });
}));

// Edit text/theme, remove chosen photos (`removePhotos`), and append newly uploaded ones.
router.patch("/events/:id", requireAdmin, uploadGalleryPhotos, eventRules(true), handleValidation, asyncHandler(async (req, res) => {
  const event = await findEvent(req, res);
  if (!event) return;

  const removeList = [].concat(req.body.removePhotos || []).map(String);
  const removed = event.photos.filter((url) => removeList.includes(url));
  const kept = event.photos.filter((url) => !removeList.includes(url));
  if (kept.length + (req.files?.length || 0) > MAX_PHOTOS_PER_EVENT) {
    return res.status(400).json({ message: `An event can have at most ${MAX_PHOTOS_PER_EVENT} photos.` });
  }

  const added = await storeUploadedPhotos(req.files);
  for (const key of ["title", "tag", "note", "theme"]) {
    if (req.body[key] !== undefined) event[key] = req.body[key];
  }
  event.photos = [...kept, ...added];
  await event.save();

  // Remove files only after the event no longer references them.
  await Promise.all(removed.map(deleteGalleryImage));
  return res.json({ event });
}));

router.delete("/events/:id", requireAdmin, asyncHandler(async (req, res) => {
  const event = await findEvent(req, res);
  if (!event) return;

  await event.deleteOne();
  await Promise.all(event.photos.map(deleteGalleryImage));
  return res.json({ message: "Event deleted." });
}));

export default router;
