import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";
import { campusShowcase } from "../data/school.js";
import { Atom, HeartHandshake, Megaphone, Target } from "lucide-react";

const showcaseIcons = [Atom, Megaphone, HeartHandshake, Target];

export default function CampusShowcase() {
  return (
    <section className="campus-showcase">
      <SectionHeader
        eyebrow="The campus moodboard"
        title="Less ‘sit still.’ More ‘let’s see what happens.’"
        text="A school day should have texture: a smart idea, a messy experiment, a brave answer, a team huddle, and a reason to come back tomorrow."
      />
      <div className="bento-grid">
        {campusShowcase.map((item, index) => (
          <Reveal as="article" className={`bento-card ${item.tone}`} delay={index * 90} key={item.title}>
            {(() => { const Icon = showcaseIcons[index]; return <Icon className="bento-icon" aria-hidden="true" />; })()}
            <div>
              <span>THE GOOD STUFF / 0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
