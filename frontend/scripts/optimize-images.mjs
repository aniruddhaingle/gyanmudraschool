// Turns the full-size originals in image-sources/ into small WebP files for public/images/.
// Run after adding or replacing a photo:  npm --prefix frontend run images
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "image-sources");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "images");

// Portraits are shown small; everything else may fill a wide hero.
const portraits = new Set(["principal", "secretary"]);
const widths = (name) => (portraits.has(name) ? [400, 800] : [800, 1600]);

async function writeWebp(input, output, width) {
  const info = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 72, effort: 5 }).toFile(output);
  return info.size;
}

await fs.mkdir(outDir, { recursive: true });
const files = (await fs.readdir(sourceDir, { withFileTypes: true })).filter((entry) => entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name));

let before = 0;
let after = 0;
for (const { name: file } of files) {
  const input = path.join(sourceDir, file);
  const name = path.parse(file).name;
  before += (await fs.stat(input)).size;
  const [small, large] = widths(name);
  after += await writeWebp(input, path.join(outDir, `${name}-${small}.webp`), small);
  after += await writeWebp(input, path.join(outDir, `${name}.webp`), large);
}

// Browser tab icons and the link-preview image used by WhatsApp and other apps.
const logo = path.join(sourceDir, "gyan-mudra-logo.jpeg");
await sharp(logo).resize(32, 32).png().toFile(path.join(publicDir, "favicon-32.png"));
await sharp(logo).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));
await sharp(path.join(sourceDir, "banner.png")).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(publicDir, "og-image.jpg"));

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;
console.log(`${files.length} photos: ${mb(before)} of originals -> ${mb(after)} of WebP in public/images`);
