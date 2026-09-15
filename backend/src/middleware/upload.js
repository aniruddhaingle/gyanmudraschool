import { Buffer } from "node:buffer";
import multer from "multer";

const types = new Set(["image/jpeg", "image/png", "image/webp"]);
const filter = (req, file, done) => types.has(file.mimetype) ? done(null, true) : done(new Error("Only JPG, PNG, or WEBP images are allowed."));
const memory = multer.memoryStorage();
export const uploadStudentPhoto = multer({ storage: memory, limits: { files: 1, fileSize: 2 * 1024 * 1024 }, fileFilter: filter }).single("photo");
export const uploadGalleryPhotos = multer({ storage: memory, limits: { files: 15, fileSize: 5 * 1024 * 1024 }, fileFilter: filter }).array("photos", 15);
export function isAllowedImage(file) { const b = file.buffer; return (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) || (b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) || (b.length >= 12 && b.subarray(0,4).toString() === "RIFF" && b.subarray(8,12).toString() === "WEBP"); }
