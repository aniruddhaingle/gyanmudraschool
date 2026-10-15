// Everything the admin can edit in "Website manager", shared by the website (editor forms)
// and the server (validation). Each section is saved separately; unsaved sections use the
// built-in defaults in frontend/src/data/school.js.

const text = (name, label, max, extra = {}) => ({ name, label, type: "text", max, ...extra });
const area = (name, label, max, extra = {}) => ({ name, label, type: "textarea", max, ...extra });
const image = (name, label, extra = {}) => ({ name, label, type: "image", ...extra });

export const siteSections = [
  {
    key: "school",
    title: "School details",
    description: "Name, contact details, and address shown in the header, footer, and across the site.",
    page: "/",
    type: "object",
    fields: [
      text("name", "School name", 80),
      text("location", "Town / district (short)", 60),
      text("phone", "Phone number", 20, { format: "phone" }),
      text("email", "Email address", 80, { format: "email" }),
      area("address", "Full address", 200),
      text("tagline", "Tagline", 120)
    ]
  },
  {
    key: "ticker",
    title: "Scrolling announcement bar",
    description: "Short messages that scroll across the top of every page.",
    page: "/",
    type: "strings",
    label: "Message",
    max: 60,
    minItems: 1,
    maxItems: 8
  },
  {
    key: "heroSlides",
    title: "Home page slideshow",
    description: "The big photos and headlines at the top of the home page.",
    page: "/",
    type: "list",
    itemLabel: "Slide",
    minItems: 1,
    maxItems: 5,
    fields: [
      image("image", "Photo"),
      text("kicker", "Small label", 60),
      text("title", "Headline", 80),
      area("text", "Text", 220)
    ]
  },
  {
    key: "highlights",
    title: "Numbers strip",
    description: "The coloured row of numbers under the slideshow, e.g. “20+ years”.",
    page: "/",
    type: "list",
    itemLabel: "Number",
    minItems: 1,
    maxItems: 4,
    fields: [text("value", "Number (e.g. 20+, 100%)", 10), text("label", "What it means", 60)]
  },
  {
    key: "programs",
    title: "Programs",
    description: "The coloured cards describing each stage of learning.",
    page: "/",
    type: "list",
    itemLabel: "Program",
    minItems: 1,
    maxItems: 6,
    fields: [text("range", "Classes / label", 40), text("title", "Title", 50), area("text", "Description", 260)]
  },
  {
    key: "campusShowcase",
    title: "Campus highlights",
    description: "The four tiles about life on campus on the home page.",
    page: "/",
    type: "list",
    itemLabel: "Tile",
    minItems: 1,
    maxItems: 6,
    fields: [text("title", "Title", 50), area("text", "Text", 200)]
  },
  {
    key: "facilities",
    title: "Facilities",
    description: "The facilities list on the home and About pages.",
    page: "/about",
    type: "strings",
    label: "Facility",
    max: 120,
    minItems: 1,
    maxItems: 10
  },
  {
    key: "achievements",
    title: "Achievements",
    description: "Wins worth celebrating, shown on the home and About pages.",
    page: "/about",
    type: "strings",
    label: "Achievement",
    max: 120,
    minItems: 1,
    maxItems: 10
  },
  {
    key: "experience",
    title: "A day at school",
    description: "The timeline of a school day on the home page.",
    page: "/",
    type: "list",
    itemLabel: "Time slot",
    minItems: 1,
    maxItems: 8,
    fields: [text("time", "Time (e.g. 08:30)", 10), text("title", "Title", 50), area("text", "Text", 200)]
  },
  {
    key: "leadership",
    title: "Leadership & staff",
    description: "People shown on the Leadership page and the home page.",
    page: "/leadership",
    type: "list",
    itemLabel: "Person",
    minItems: 1,
    maxItems: 12,
    fields: [
      image("image", "Photo"),
      text("name", "Name", 80),
      text("role", "Role", 60),
      area("summary", "Short introduction (home page)", 220),
      area("detail", "About them (Leadership page)", 500),
      text("education", "Education", 120, { optional: true }),
      text("email", "Email", 80, { format: "email", optional: true })
    ]
  },
  {
    key: "testimonials",
    title: "Parent testimonials",
    description: "Quotes from families on the home page. Use real quotes, with permission.",
    page: "/",
    type: "list",
    itemLabel: "Testimonial",
    minItems: 1,
    maxItems: 6,
    fields: [area("quote", "Quote", 300), text("name", "Name", 60), text("role", "Detail (e.g. Parent, Class 4)", 60)]
  },
  {
    key: "pages",
    title: "Page headings",
    description: "The big heading and introduction at the top of each page.",
    page: "/about",
    type: "object",
    fields: [
      text("aboutTitle", "About: heading", 80),
      area("aboutText", "About: introduction", 260),
      text("admissionsTitle", "Admissions: heading", 80),
      area("admissionsText", "Admissions: introduction", 260),
      text("galleryTitle", "Gallery: heading", 80),
      area("galleryText", "Gallery: introduction", 260),
      text("leadershipTitle", "Leadership: heading", 80),
      area("leadershipText", "Leadership: introduction", 260)
    ]
  }
];

export const siteSectionKeys = siteSections.map((section) => section.key);
export const getSiteSection = (key) => siteSections.find((section) => section.key === key);

const IMAGE_URL = /^(\/(images|gallery)\/[\w\-./]+\.(webp|jpe?g|png)|\/api\/site-media\/[a-f0-9]{24})$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+\-\s()]{6,20}$/;

function cleanField(field, raw, where) {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return field.optional ? { value: "" } : { error: `${where}${field.label} is required.` };
  if (field.type === "image") {
    return IMAGE_URL.test(value) ? { value } : { error: `${where}${field.label}: please upload a photo.` };
  }
  if (value.length > field.max) return { error: `${where}${field.label} must be ${field.max} characters or fewer.` };
  if (field.format === "email" && !EMAIL.test(value)) return { error: `${where}${field.label} is not a valid email address.` };
  if (field.format === "phone" && !PHONE.test(value)) return { error: `${where}${field.label} is not a valid phone number.` };
  return { value };
}

function cleanObject(fields, raw, where = "") {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { error: "Invalid content." };
  const out = {};
  for (const field of fields) {
    const result = cleanField(field, raw[field.name], where);
    if (result.error) return result;
    out[field.name] = result.value;
  }
  return { value: out };
}

// Returns { value } with only known fields, trimmed, or { error } with a message for the admin.
export function validateSiteSection(key, raw) {
  const section = getSiteSection(key);
  if (!section) return { error: "Unknown section." };

  if (section.type === "object") return cleanObject(section.fields, raw);

  if (!Array.isArray(raw)) return { error: "Invalid content." };
  if (raw.length < section.minItems) return { error: `Add at least ${section.minItems} ${(section.itemLabel || section.label).toLowerCase()}.` };
  if (raw.length > section.maxItems) return { error: `You can have at most ${section.maxItems} items here.` };

  const items = [];
  for (const [index, item] of raw.entries()) {
    const result = section.type === "strings"
      ? cleanField({ label: `${section.label} ${index + 1}`, type: "text", max: section.max }, item, "")
      : cleanObject(section.fields, item, `${section.itemLabel} ${index + 1}: `);
    if (result.error) return result;
    items.push(result.value);
  }
  return { value: items };
}
