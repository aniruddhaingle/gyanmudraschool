import { Sparkles } from "lucide-react";
import { responsiveImage } from "../utils/images.js";

export default function PageHero({ eyebrow, title, text, badge = "GOOD ENERGY ONLY", image, tone = "purple" }) {
  return (
    <section className={`page-hero page-hero-${tone}`}>
      {image ? <img {...responsiveImage(image)} sizes="100vw" alt="" decoding="async" /> : null}
      <div className="page-hero-scribble" aria-hidden="true">✦</div>
      <div className="page-hero-copy">
        <span className="page-hero-eyebrow"><Sparkles size={15} /> {eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="page-hero-badge" aria-hidden="true">{badge}</div>
    </section>
  );
}
