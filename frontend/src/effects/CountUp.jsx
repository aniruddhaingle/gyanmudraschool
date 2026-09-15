import { useEffect, useRef, useState } from "react";

export default function CountUp({ value }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const node = ref.current;
    const match = String(value).match(/\d+/);
    if (!node || !match) return undefined;

    const target = Number(match[0]);
    const suffix = String(value).replace(match[0], "");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = window.performance.now();
      const duration = 1250;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 4;
        setDisplay(`${Math.round(target * eased)}${suffix}`);
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.55 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <strong ref={ref}>{display}</strong>;
}
