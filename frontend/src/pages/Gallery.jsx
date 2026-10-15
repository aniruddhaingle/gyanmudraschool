import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import { galleryEvents } from "../data/school.js";
import { useSite } from "../context/SiteContent.jsx";
import ThemeCover from "../components/ThemeCover.jsx";
import { resolveTheme, themeStyle } from "../data/eventThemes.js";
import { getGalleryEvents } from "../services/api.js";

// Featured photo first, then the rest in their original order.
function orderedPhotos(event) {
  const featured = event.photos.includes(event.cover) ? event.cover : event.photos[0];
  return featured ? [featured, ...event.photos.filter((photo) => photo !== featured)] : [];
}

function EventAlbum({ event, onClose }) {
  const theme = resolveTheme(event);
  const photos = orderedPhotos(event);
  const [active, setActive] = useState(null);
  const [featured, ...rest] = photos;

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") return active !== null ? setActive(null) : onClose();
      if (active === null) return undefined;
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + photos.length) % photos.length);
      return undefined;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, photos.length, onClose]);

  const count = photos.length;
  return (
    <div className={`festival-story themed-festival theme-${theme.key}`} style={themeStyle(theme)} role="dialog" aria-modal="true" aria-label={`${event.title} photo story`}>
      <div className="festival-decor" aria-hidden="true">
        <i>{theme.decor[1]}</i><i>{theme.decor[2]}</i><i>{theme.decor[1]}</i><b>{theme.decor[3]}</b>
      </div>
      <button className="festival-close" type="button" onClick={onClose} aria-label="Close story"><X /></button>
      <header className="festival-story-head">
        <span>{theme.blessing}</span>
        <h2>{event.title}</h2>
        <p>{event.note}</p>
        <em>{count ? `${count} cherished moment${count > 1 ? "s" : ""} from our celebration` : "Photos coming soon"}</em>
      </header>
      {featured ? (
        <button className="festival-hero-photo" type="button" onClick={() => setActive(0)} aria-label="Expand featured photo">
          <img src={featured} alt={`${event.title} featured photo`} />
          <span>{theme.heroLabel}</span>
        </button>
      ) : null}
      <section className="festival-story-copy"><p>{theme.story}</p></section>
      {rest.length ? (
        <section className="festival-photo-spread" aria-label={`${event.title} photos`}>
          {rest.map((photo, index) => (
            <button key={photo} type="button" onClick={() => setActive(index + 1)} aria-label={`Expand photo ${index + 2}`}>
              <img src={photo} alt={`${event.title} photo ${index + 2}`} loading="lazy" />
            </button>
          ))}
        </section>
      ) : null}
      {active !== null ? (
        <div className="story-lightbox" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setActive(null)} aria-label="Close image"><X /></button>
          {count > 1 ? (
            <>
              <button className="lightbox-prev" type="button" onClick={() => setActive((active - 1 + count) % count)} aria-label="Previous photo"><ChevronLeft /></button>
              <button className="lightbox-next" type="button" onClick={() => setActive((active + 1) % count)} aria-label="Next photo"><ChevronRight /></button>
            </>
          ) : null}
          <img src={photos[active]} alt={`${event.title} photo ${active + 1} of ${count}`} />
        </div>
      ) : null}
    </div>
  );
}

export default function Gallery() {
  const { pages } = useSite();
  const [selected, setSelected] = useState(null);
  const [managedEvents, setManagedEvents] = useState([]);

  useEffect(() => {
    getGalleryEvents().then(({ events }) => setManagedEvents(events)).catch(() => {});
  }, []);

  const events = [...managedEvents, ...galleryEvents];

  return (
    <section className="page-shell gallery-page">
      <PageHero eyebrow="The yearbook wall" title={pages.galleryTitle} text={pages.galleryText} badge="CORE MEMORIES" tone="pink" />
      <section className="scrapbook-intro page-content"><span>✦ SCHOOL YEARBOOK / ONGOING</span><h2>Every photo has<br />a little story.</h2><p>Events, achievements, experiments, team moments, and the sweet everyday chaos in between. Your photos will live here as one growing school memory wall.</p></section>
      <section className="scrapbook-wall scrapbook-wall-uniform page-content" aria-label="School scrapbook">
        {events.map((event, index) => {
          const cover = orderedPhotos(event)[0];
          return (
            <article className={`scrap-card scrap-card-${index + 1}`} key={event._id || event.title}>
              <div className="tape" aria-hidden="true" />
              <button className="scrap-event-photo" type="button" onClick={() => setSelected(event)} aria-label={`Open ${event.title}`}>
                {cover ? <img src={cover} alt={`Photos from ${event.title}`} loading="lazy" /> : <ThemeCover theme={resolveTheme(event)} />}
              </button>
              <span>{event.tag}</span><h2>{event.title}</h2><p>{event.note}</p>
              <em><Images size={14} /> {event.photos.length ? `${event.photos.length} photo${event.photos.length > 1 ? "s" : ""} inside ↗` : "Story inside ↗"}</em>
            </article>
          );
        })}
      </section>
      {selected ? <EventAlbum event={selected} onClose={() => setSelected(null)} /> : null}
    </section>
  );
}
