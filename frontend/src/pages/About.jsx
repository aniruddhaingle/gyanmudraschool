import PageHero from "../components/PageHero.jsx";
import { achievements, facilities } from "../data/school.js";

export default function About() {
  return (
    <section className="page-shell about-page">
      <PageHero eyebrow="Our little-big story" title="School, but make it a launchpad." text="We mix strong learning, wide-open curiosity, and real care—so children can grow into their loudest, kindest, most capable selves." badge="SINCE DAY ONE" image="/images/slider1.png" tone="teal" />

      <div className="story-grid page-content">
        <article className="story-card wide">
          <span className="story-kicker">01 / THE BIG IDEA</span>
          <h3>Make room for every big dream.</h3>
          <p>
            We want children to ask better questions, work with purpose, and carry their values into the world. Marks matter—so do courage, curiosity, and how we show up for one another.
          </p>
        </article>
        <article className="story-card">
          <span className="story-kicker">02 / HOW WE TEACH</span>
          <h3>Practice. Play. Progress.</h3>
          <p>Clear teaching, frequent practice, project work, thoughtful feedback, and a teacher who knows when a learner needs a little more time.</p>
        </article>
        <article className="story-card">
          <span className="story-kicker">03 / OUR PROMISE</span>
          <h3>Safe to try. Ready to shine.</h3>
          <p>Our campus is built around calm routines, warm accountability, and a culture where every student can participate with confidence.</p>
        </article>
      </div>

      <div className="two-column-list page-content">
        <div>
          <span className="list-label">THINGS WE CELEBRATE</span><h3>Wins worth cheering for</h3>
          <ul className="check-list">
            {achievements.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <span className="list-label">OUR EVERYDAY TOOLKIT</span><h3>Spaces made for doing</h3>
          <ul className="check-list">
            {facilities.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
