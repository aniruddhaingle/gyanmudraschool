import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, Microscope, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { heroSlides, school } from "../data/school.js";
import { responsiveImage } from "../utils/images.js";

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  // Download a slide only once it is showing or up next, instead of every photo on first load.
  const [loaded, setLoaded] = useState(() => new Set([0, 1]));
  const slide = heroSlides[activeSlide];

  useEffect(() => {
    setLoaded((current) => new Set([...current, activeSlide, (activeSlide + 1) % heroSlides.length]));
  }, [activeSlide]);

  useEffect(() => {
    // Respect phones and computers set to reduce motion: no automatic slide changes.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-media">
        {heroSlides.map((item, index) => (
          loaded.has(index) ? (
            <img
              className={index === activeSlide ? "active" : ""}
              {...responsiveImage(item.image)}
              sizes="100vw"
              alt={index === activeSlide ? `Students at ${school.name}, ${school.location}` : ""}
              key={item.image}
            />
          ) : null
        ))}
      </div>
      <div className="mesh-field" />
      <div className="hero-overlay" />
      <div className="hero-noise" />
      <div className="hero-sweep" />
      <div className="hero-doodles" aria-hidden="true">
        <span className="doodle-star">✦</span>
        <span className="doodle-heart">♥</span>
        <span className="doodle-zap">⚡</span>
        <span className="doodle-smile">☺</span>
        <i className="doodle-loop" />
      </div>
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="hero-content">
        <span className="pill"><Sparkles size={16} /> {slide.kicker}</span>
        <span className="hero-edition">FOR THE CURIOUS, THE KIND & THE READY</span>
        <h1><span className="sr-only">{school.name}, {school.location}: </span>{slide.title}</h1>
        <p>{slide.text}</p>
        <div className="hero-actions">
          <Link className="primary-action" to="/admissions">
            Apply now <ArrowRight size={18} />
          </Link>
          <Link className="secondary-action" to="/about">Explore school</Link>
        </div>
        <div className="hero-slide-dots" aria-label="Hero slides">
          {heroSlides.map((item, index) => (
            <button
              className={index === activeSlide ? "active" : ""}
              type="button"
              key={item.title}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>
      <div className="hero-command-center" aria-label="School highlights">
        <div className="command-card main">
          <span>Live campus focus</span>
          <strong>Big ideas live here.</strong>
          <p>Strong learning, great people, fresh challenges, and just enough chaos to keep every day interesting.</p>
        </div>
        <div className="command-grid">
          <div><ShieldCheck /><strong>Seen</strong><span>Parents stay in the loop</span></div>
          <div><Trophy /><strong>Bold</strong><span>Goals worth chasing</span></div>
          <div><Microscope /><strong>Hands-on</strong><span>Try it for real</span></div>
          <div><CalendarCheck /><strong>Grounded</strong><span>Routines that stick</span></div>
        </div>
      </div>
      <div className="hero-sticker hero-sticker-one" aria-hidden="true">NO BORING<br />DAYS!</div>
      <div className="hero-sticker hero-sticker-two" aria-hidden="true">MAKE<br />WAVES <span>↗</span></div>
      <div className="hero-scroll-cue" aria-hidden="true"><span /> Scroll to discover</div>
    </section>
  );
}
