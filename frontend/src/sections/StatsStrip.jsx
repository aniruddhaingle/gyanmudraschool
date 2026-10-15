import { useSite } from "../context/SiteContent.jsx";
import CountUp from "../effects/CountUp.jsx";

export default function StatsStrip() {
  const { highlights } = useSite();
  return (
    <section className="stats-band">
      {highlights.map((item, index) => (
        <div key={index}>
          <CountUp value={item.value} />
          <span>{item.label}</span>
        </div>
      ))}
    </section>
  );
}
