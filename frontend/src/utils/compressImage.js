// Shrinks a phone photo in the browser before upload (e.g. 5 MB -> ~300 KB) so it uploads fast on mobile data
// and stays under the server's size limit. Falls back to the original file if the browser can't process it.
export async function compressImage(file, { maxSize = 1600, quality = 0.82, type = "image/jpeg" } = {}) {
  if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const encode = (format) => new Promise((resolve) => canvas.toBlob(resolve, format, quality));
    // Browsers that can't make WebP (older Safari) return a PNG instead; use JPEG for those.
    let blob = await encode(type);
    if (blob && blob.type !== type) blob = await encode("image/jpeg");
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;

    const name = file.name.replace(/\.[^.]+$/, "") || "photo";
    const extension = blob.type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${name}.${extension}`, { type: blob.type, lastModified: Date.now() });
  } catch {
    return file;
  }
}
