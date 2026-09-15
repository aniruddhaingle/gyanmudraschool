import { useEffect, useState } from "react";
import { Images, X } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import { galleryEvents } from "../data/school.js";
import { getGalleryEvents } from "../services/api.js";

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [managedEvents, setManagedEvents] = useState([]);

  useEffect(() => {
    getGalleryEvents().then(({ events }) => setManagedEvents(events)).catch(() => {});
  }, []);

  const events = [...managedEvents.map((event) => ({ ...event, cover: event.photos[0] || "/images/banner.png" })), ...galleryEvents];

  function openAlbum(event) {
    setActivePhoto(null);
    setSelected(event);
  }

  return (
    <section className="page-shell gallery-page">
      <PageHero eyebrow="The yearbook wall" title="The good stuff, stuck right here." text="A little messy, a lot memorable—snapshots from the days that made everyone smile, cheer, and say ‘remember that?’" badge="CORE MEMORIES" tone="pink" />
      <section className="scrapbook-intro page-content"><span>✦ SCHOOL YEARBOOK / ONGOING</span><h2>Every photo has<br />a little story.</h2><p>Events, achievements, experiments, team moments, and the sweet everyday chaos in between. Your photos will live here as one growing school memory wall.</p></section>
      <section className="scrapbook-wall scrapbook-wall-uniform page-content" aria-label="School scrapbook">
        {events.map((event, index) => (
          <article className={`scrap-card scrap-card-${index + 1}`} key={event.title}>
            <div className="tape" aria-hidden="true" />
            <button className="scrap-event-photo" type="button" onClick={() => openAlbum(event)} aria-label={`Open ${event.title}`}><img src={event.cover} alt={`Photos from ${event.title}`} /></button>
            <span>{event.tag}</span><h2>{event.title}</h2><p>{event.note}</p><em><Images size={14} /> {event.photos.length} photos inside ↗</em>
          </article>
        ))}
      </section>
      {selected ? <div className="festival-story krishna-festival" role="dialog" aria-modal="true" aria-label={`${selected.title} photo story`}><div className="festival-decor" aria-hidden="true"><i>✦</i><i>❋</i><i>✦</i><b>🦚</b></div><button className="festival-close" type="button" onClick={() => setSelected(null)} aria-label="Close story"><X /></button><header className="festival-story-head"><span>॥ श्री कृष्णाय नमः ॥</span><h2>{selected.title}</h2><p>{selected.note}</p><em>{selected.photos.length} cherished moments from our celebration</em></header><button className="festival-hero-photo" type="button" onClick={() => setActivePhoto(2)} aria-label="Expand featured group photo"><img src={selected.photos[2]} alt="Students celebrating Janmashtami together" /><span>OUR LITTLE KRISHNAS & RADHAS</span></button><section className="festival-story-copy"><p>With peacock feathers, flutes, flowers, and joyful hearts, our students celebrated the timeless spirit of Shri Krishna—through colour, costume, music, and togetherness.</p></section><section className="festival-photo-spread" aria-label="Janmashtami celebration photos">{selected.photos.filter((_, index) => index !== 2).map((photo, index) => <button key={photo} type="button" onClick={() => setActivePhoto(index >= 2 ? index + 1 : index)} aria-label={`Expand photo ${index + 1}`}><img src={photo} alt={`Janmashtami celebration photo ${index + 1}`} /></button>)}</section>{activePhoto !== null ? <div className="story-lightbox" role="dialog" aria-modal="true"><button type="button" onClick={() => setActivePhoto(null)} aria-label="Close image"><X /></button><img src={selected.photos[activePhoto]} alt={`Janmashtami celebration photo ${activePhoto + 1}`} /></div> : null}</div> : null}
    </section>
  );
}
