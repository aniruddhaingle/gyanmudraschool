import SectionHeader from "../components/SectionHeader.jsx";
import Reveal from "../effects/Reveal.jsx";
import { useSite } from "../context/SiteContent.jsx";
import { BookMarked, FlaskConical, Heart, Trophy } from "lucide-react";

export default function CampusLife() {
  const { achievements, facilities } = useSite();
  return (
    <>
      <section className="split-section">
        <Reveal>
          <SectionHeader eyebrow="The everyday playground" title="Read it. Build it. Run with it." text="The best ideas don’t always happen at a desk. They might show up in the lab, the library, on the field, or halfway through a great conversation." />
          <ul className="check-list">
            {facilities.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </Reveal>
        <Reveal className="campus-poster" delay={120}>
          <span className="poster-top">THE AFTER-CLASS<br />HIGHLIGHT REEL</span>
          <div className="poster-icons"><FlaskConical /><BookMarked /><Trophy /><Heart /></div>
          <strong>TRY.<br />CHEER.<br />REPEAT.</strong>
          <span className="poster-bottom">WHERE CURIOSITY GETS ITS STEPS IN</span>
        </Reveal>
      </section>

      <section className="content-band soft">
        <SectionHeader eyebrow="Future fuel" title="Small wins. Serious momentum." text="Every question answered, habit built, and brave attempt made today becomes part of a much bigger tomorrow." />
        <div className="achievement-list">
          {achievements.map((item, index) => <span key={index}>{item}</span>)}
        </div>
      </section>
    </>
  );
}
