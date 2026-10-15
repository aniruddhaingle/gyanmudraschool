import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";
import { useSite } from "../context/SiteContent.jsx";
import { responsiveImage } from "../utils/images.js";

export default function LeadershipPreview() {
  const { leadership } = useSite();
  return (
    <section className="content-band">
      <SectionHeader eyebrow="The adults who get it" title="Big support. Zero boring pep talks." text="The team behind the scenes, on the sidelines, and in the classroom—making sure every learner has someone in their corner." />
      <div className="leader-row">
        {leadership.map((person, index) => (
          <Reveal as="article" className="leader-card" delay={index * 100} key={index}>
            <div className="leader-photo">
              <img {...responsiveImage(person.image)} sizes="(max-width: 700px) 90vw, 400px" alt={`${person.name}, ${person.role}`} loading="lazy" />
            </div>
            <div>
              <span>{person.role}</span>
              <h3>{person.name}</h3>
              <p>{person.summary}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
