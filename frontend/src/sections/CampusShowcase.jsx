import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";
import { useSite } from "../context/SiteContent.jsx";
import { Atom, HeartHandshake, Megaphone, Target } from "lucide-react";

const showcaseIcons = [Atom, Megaphone, HeartHandshake, Target];
const tones = ["large", "dark", "light", "accent"];

export default function CampusShowcase() {
  const { campusShowcase } = useSite();
  return (
    <section className="campus-showcase">
      <SectionHeader
        eyebrow="The campus moodboard"
        title="Less ‘sit still.’ More ‘let’s see what happens.’"
        text="A school day should have texture: a smart idea, a messy experiment, a brave answer, a team huddle, and a reason to come back tomorrow."
      />
      <div className="bento-grid">
        {campusShowcase.map((item, index) => (
          <Reveal as="article" className={`bento-card ${tones[index % tones.length]}`} delay={index * 90} key={index}>
            {(() => { const Icon = showcaseIcons[index % showcaseIcons.length]; return <Icon className="bento-icon" aria-hidden="true" />; })()}
            <div>
              <span>THE GOOD STUFF / {String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
