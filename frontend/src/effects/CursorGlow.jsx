import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function updatePosition(event) {
      setPosition({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener("pointermove", updatePosition);
    return () => window.removeEventListener("pointermove", updatePosition);
  }, []);

  return (
    <div
      className="cursor-glow"
      style={{
        "--cursor-x": `${position.x}px`,
        "--cursor-y": `${position.y}px`
      }}
    />
  );
}
