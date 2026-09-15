import { Sparkles } from "lucide-react";

export default function PageHero({ eyebrow, title, text, badge = "GOOD ENERGY ONLY", image, tone = "purple" }) {
  return (
    <section className={`page-hero page-hero-${tone}`}>
      {image ? <img src={image} alt="" /> : null}
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
