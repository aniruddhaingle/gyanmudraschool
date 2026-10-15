import { Mail } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import { leadership } from "../data/school.js";
import { responsiveImage } from "../utils/images.js";

export default function Leadership() {
  return (
    <section className="page-shell leadership-page">
      <PageHero eyebrow="Meet the guides" title="The grown-ups in your corner." text="Big standards. Warm guidance. Great listeners. This is the team helping students turn ‘maybe I can’ into ‘watch me.’" badge="THE DREAM TEAM" image="/images/bg8.webp" tone="yellow" />
      <div className="leadership-grid page-content">
        {leadership.map((person) => (
          <article className="profile-card" key={person.name}>
            <div className="leader-photo">
              <img {...responsiveImage(person.image)} sizes="(max-width: 700px) 90vw, 400px" alt={`${person.name}, ${person.role}`} loading="lazy" />
            </div>
            <div>
              <span>{person.role}</span>
              <h3>{person.name}</h3>
              <p className="profile-note">THEIR SUPERPOWER: helping students find their next brave step.</p>
              <p>{person.detail}</p>
              <p><strong>Education:</strong> {person.education}</p>
              <a href={`mailto:${person.email}`}><Mail size={17} /> {person.email}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
