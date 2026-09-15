import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";
import { programs } from "../data/school.js";
import { BookOpen, Compass, Rocket } from "lucide-react";

const programIcons = [BookOpen, Compass, Rocket];

export default function ProgramsSection() {
  return (
    <section className="content-band">
      <SectionHeader
        eyebrow="Pick your power-up"
        title="Different ages. Same big-energy learning."
        text="From first ‘I can read this!’ moments to ambitious exam goals, every stage gets its own mix of focus, fun, and forward motion."
      />
      <div className="program-grid">
        {programs.map((program, index) => (
          <Reveal as="article" className={`program-card program-card-${index + 1}`} delay={index * 100} key={program.title}>
            {(() => { const Icon = programIcons[index]; return <Icon className="program-icon" aria-hidden="true" />; })()}
            <span className="program-number">0{index + 1}</span>
            <div>
              <span>{program.range}</span>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
