import mongoose from "mongoose";
import SiteSection from "../models/SiteSection.js";

// Saved website sections, cached in memory because every page view reads them.
let cache = null;

export async function getSiteSections() {
  if (cache) return cache;
  if (mongoose.connection.readyState !== 1) return {};
  const docs = await SiteSection.find().select("key value").lean();
  cache = Object.fromEntries(docs.map((doc) => [doc.key, doc.value]));
  return cache;
}

export function clearSiteSectionsCache() {
  cache = null;
}

// <link rel="preload"> for the first home page slide, so the browser fetches it before the app starts.
// Built-in photos have a phone-sized -800 copy; uploaded ones are a single file.
const DEFAULT_HERO_IMAGE = "/images/banner.webp";

export function heroPreloadTag(sections) {
  const image = sections.heroSlides?.[0]?.image || DEFAULT_HERO_IMAGE;
  const builtIn = /^\/images\/([\w-]+)\.webp$/.exec(image);
  if (!builtIn) return `<link rel="preload" as="image" href="${image}" />`;
  const small = `/images/${builtIn[1]}-800.webp`;
  return `<link rel="preload" as="image" href="${small}" imagesrcset="${small} 800w, ${image} 1600w" imagesizes="100vw" />`;
}

// Characters that could end the <script> tag early (<, >, &) or break older JS parsers
// (U+2028/U+2029), written as JSON unicode escapes.
const unsafeInScript = new Set(["<", ">", "&", String.fromCharCode(0x2028), String.fromCharCode(0x2029)]);
const unicodeEscape = (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;

// JSON that is safe to place inside an HTML <script type="application/json"> tag.
export function toInlineJson(value) {
  return [...JSON.stringify(value)].map((char) => (unsafeInScript.has(char) ? unicodeEscape(char) : char)).join("");
}
