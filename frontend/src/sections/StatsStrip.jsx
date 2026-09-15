import { highlights } from "../data/school.js";
import CountUp from "../effects/CountUp.jsx";

export default function StatsStrip() {
  return (
    <section className="stats-band">
      {highlights.map((item) => (
        <div key={item.label}>
          <CountUp value={item.value} />
          <span>{item.label}</span>
        </div>
      ))}
    </section>
  );
}
