import express from "express";
import mongoose from "mongoose";
import GalleryEvent from "../models/GalleryEvent.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseObjectId, PUBLIC_BUCKET, publicUploadUrl, streamImage } from "../utils/media.js";

const router = express.Router();

// Only serve files that belong to a published gallery event. This also keeps any admission
// photos stored in the public bucket by older versions of the app from being reachable here.
router.get("/:id", asyncHandler(async (req, res) => {
  const id = parseObjectId(req.params.id);
  if (!id || mongoose.connection.readyState !== 1) {
    return res.status(404).json({ message: "Image not found." });
  }

  const published = await GalleryEvent.exists({ photos: publicUploadUrl(id) });
  if (!published) {
    return res.status(404).json({ message: "Image not found." });
  }

  return streamImage(PUBLIC_BUCKET, id, res, "public, max-age=31536000, immutable");
}));

export default router;
