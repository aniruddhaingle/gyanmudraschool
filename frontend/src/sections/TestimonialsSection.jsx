import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";
import { testimonials } from "../data/school.js";

export default function TestimonialsSection() {
  return (
    <section className="testimonial-band">
      <SectionHeader eyebrow="The word on campus" title="Don’t just take our word for it." text="The real review comes from the families who see the confidence, habits, and happy stories coming home every day." />
      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <Reveal as="article" delay={index * 100} key={item.name}>
            <p>{item.quote}</p>
            <strong>{item.name}</strong>
            <span>{item.role}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
