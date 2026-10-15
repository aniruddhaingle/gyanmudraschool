import { Mail } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import { useSite } from "../context/SiteContent.jsx";
import { responsiveImage } from "../utils/images.js";

export default function Leadership() {
  const { leadership, pages } = useSite();
  return (
    <section className="page-shell leadership-page">
      <PageHero eyebrow="Meet the guides" title={pages.leadershipTitle} text={pages.leadershipText} badge="THE DREAM TEAM" image="/images/bg8.webp" tone="yellow" />
      <div className="leadership-grid page-content">
        {leadership.map((person, index) => (
          <article className="profile-card" key={index}>
            <div className="leader-photo">
              <img {...responsiveImage(person.image)} sizes="(max-width: 700px) 90vw, 400px" alt={`${person.name}, ${person.role}`} loading="lazy" />
            </div>
            <div>
              <span>{person.role}</span>
              <h3>{person.name}</h3>
              <p className="profile-note">THEIR SUPERPOWER: helping students find their next brave step.</p>
              <p>{person.detail}</p>
              {person.education ? <p><strong>Education:</strong> {person.education}</p> : null}
              {person.email ? <a href={`mailto:${person.email}`}><Mail size={17} /> {person.email}</a> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
