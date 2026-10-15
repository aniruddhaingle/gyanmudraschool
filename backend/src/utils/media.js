import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";

// Gallery photos are public; admission photos (of minors) live in a separate, admin-only bucket.
export const PUBLIC_BUCKET = "media";
export const PRIVATE_BUCKET = "admission-photos";

const bucket = (name) => new GridFSBucket(mongoose.connection.db, { bucketName: name });

export function publicUploadUrl(id) {
  return `/api/uploads/${id}`;
}

export function parseObjectId(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id) ? new ObjectId(id) : null;
}

function storeImage(bucketName, file) {
  return new Promise((resolve, reject) => {
    const stream = bucket(bucketName).openUploadStream(file.originalname, { contentType: file.mimetype });
    stream.on("finish", () => resolve(stream.id));
    stream.on("error", reject);
    stream.end(file.buffer);
  });
}

export async function storeGalleryImage(file) {
  return publicUploadUrl(await storeImage(PUBLIC_BUCKET, file));
}

export function storeAdmissionPhoto(file) {
  return storeImage(PRIVATE_BUCKET, file);
}

export function streamImage(bucketName, id, res, cacheControl) {
  bucket(bucketName)
    .openDownloadStream(id)
    .on("file", (file) => {
      res.type(file.contentType || "application/octet-stream");
      res.set("Cache-Control", cacheControl);
    })
    .on("error", () => {
      if (res.headersSent) return res.destroy();
      return res.status(404).json({ message: "Image not found." });
    })
    .pipe(res);
}
