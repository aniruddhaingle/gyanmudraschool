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

// Characters that could end the <script> tag early (<, >, &) or break older JS parsers
// (U+2028/U+2029), written as JSON unicode escapes.
const unsafeInScript = new Set(["<", ">", "&", String.fromCharCode(0x2028), String.fromCharCode(0x2029)]);
const unicodeEscape = (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;

// JSON that is safe to place inside an HTML <script type="application/json"> tag.
export function toInlineJson(value) {
  return [...JSON.stringify(value)].map((char) => (unsafeInScript.has(char) ? unicodeEscape(char) : char)).join("");
}
