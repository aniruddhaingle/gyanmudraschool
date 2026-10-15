import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";

// Gallery photos are public; admission photos (of minors) live in a separate, admin-only bucket.
export const PUBLIC_BUCKET = "media";
export const PRIVATE_BUCKET = "admission-photos";
// Photos uploaded in Website manager (slideshow, staff photos); always public.
export const SITE_BUCKET = "site-media";

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

export async function deleteGalleryImage(url) {
  const id = parseObjectId(String(url).split("/").pop());
  if (!id) return;
  try {
    await bucket(PUBLIC_BUCKET).delete(id);
  } catch (error) {
    // Already gone (or a built-in /gallery image); nothing to clean up.
    if (!/FileNotFound|File not found/i.test(error.message)) throw error;
  }
}

export async function storeSiteImage(file) {
  return `/api/site-media/${await storeImage(SITE_BUCKET, file)}`;
}

// Deletes Website manager photos that no saved section uses any more (e.g. replaced slides).
// Photos uploaded in the last 24 hours are kept, since they may be in an editor that isn't saved yet.
export async function deleteUnusedSiteImages(sections) {
  const used = new Set((JSON.stringify(sections).match(/\/api\/site-media\/[a-f0-9]{24}/gi) || []).map((url) => url.slice(-24).toLowerCase()));
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const old = await mongoose.connection.db.collection(`${SITE_BUCKET}.files`).find({ uploadDate: { $lt: cutoff } }).project({ _id: 1 }).toArray();
  const unused = old.filter(({ _id }) => !used.has(String(_id)));
  await Promise.all(unused.map(({ _id }) => bucket(SITE_BUCKET).delete(_id)));
  return unused.length;
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
