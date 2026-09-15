import { BookOpenCheck, HeartHandshake, Medal } from "lucide-react";
import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";

const features = [
  {
    icon: BookOpenCheck,
    title: "Know the why",
    text: "Lessons are clear, visual, and full of chances to practise—so students understand the idea, not just the answer."
  },
  {
    icon: HeartHandshake,
    title: "Be a good human",
    text: "Respect, responsibility, empathy, and teamwork are practised in the small moments that make up every school day."
  },
  {
    icon: Medal,
    title: "Chase the next win",
    text: "From JNV and EMRS to Olympiads, science fairs, sports, and the stage—we help students show up prepared."
  }
];

export default function SignatureModel() {
  return (
    <section className="content-band">
      <SectionHeader
        eyebrow="The no-boring-days formula"
        title="Good brains need good vibes too."
        text="We keep the learning real, the goals clear, and the atmosphere kind—because students do their best work when they feel seen, safe, and properly hyped."
      />
      <div className="feature-grid feature-grid-premium">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Reveal as="article" delay={index * 90} key={feature.title}>
              <Icon />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
