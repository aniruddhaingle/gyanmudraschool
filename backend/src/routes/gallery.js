import express from "express";
import { body } from "express-validator";
import { requireAdmin } from "../middleware/auth.js";
import GalleryEvent from "../models/GalleryEvent.js";
import { isAllowedImage, uploadGalleryPhotos } from "../middleware/upload.js";
import { storeImage } from "../utils/media.js";
import { handleValidation } from "../utils/validate.js";

const router = express.Router();

router.get("/events", async (req, res, next) => {
  try { res.json({ events: await GalleryEvent.find().sort({ createdAt: -1 }).lean() }); } catch (error) { next(error); }
});

router.post("/events", requireAdmin, uploadGalleryPhotos, [body("title").trim().isLength({ min: 2, max: 100 }), body("tag").trim().isLength({ min: 2, max: 60 }), body("note").trim().isLength({ min: 8, max: 600 })], handleValidation, async (req, res, next) => {
  try {
    const valid = (req.files || []).map(isAllowedImage);
    if (valid.includes(false)) throw new Error("One or more files are not valid images.");
    const photos = await Promise.all((req.files || []).map(storeImage));
    const event = await GalleryEvent.create({ ...req.body, photos });
    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
});

export default router;
