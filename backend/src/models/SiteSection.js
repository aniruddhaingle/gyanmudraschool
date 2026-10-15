import mongoose from "mongoose";

// One document per edited "Website manager" section (see shared/siteContent.js).
// Sections without a document use the website's built-in defaults.
const siteSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: { type: String, default: "" }
  },
  { timestamps: true, minimize: false }
);

export default mongoose.model("SiteSection", siteSectionSchema);
