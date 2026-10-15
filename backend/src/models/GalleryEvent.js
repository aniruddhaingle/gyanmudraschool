import mongoose from "mongoose";

const galleryEventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  tag: { type: String, required: true, trim: true, maxlength: 60 },
  note: { type: String, required: true, trim: true, maxlength: 600 },
  photos: [{ type: String, required: true }]
}, { timestamps: true });

galleryEventSchema.index({ photos: 1 });

export default mongoose.model("GalleryEvent", galleryEventSchema);
