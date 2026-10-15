import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";
import { useSite } from "../context/SiteContent.jsx";

export default function ExperienceTimeline() {
  const { experience } = useSite();
  return (
    <section className="experience-section">
      <Reveal className="experience-copy">
        <SectionHeader
          eyebrow="A day in the life"
          title="Powered by snacks, questions & big ideas."
          text="There’s a rhythm to the day—but never a dull one. Think focused learning, familiar faces, hands-on moments, movement, and a daily dose of ‘I did that.’"
        />
        <Link className="primary-action" to="/admissions">Start the next chapter <ArrowRight size={18} /></Link>
      </Reveal>
      <div className="timeline-panel">
        {experience.map((item, index) => (
          <Reveal as="article" delay={index * 80} key={index}>
            <strong>{item.time}</strong>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
