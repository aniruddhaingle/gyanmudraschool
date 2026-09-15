import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../effects/Reveal.jsx";

export default function FinalCta() {
  return (
    <Reveal as="section" className="final-cta">
      <div>
        <span>THE NEXT MOVE IS YOURS</span>
        <h2>Bring the curiosity. We’ll bring the momentum.</h2>
      </div>
      <Link className="primary-action" to="/admissions">Let’s do this <ArrowRight size={18} /></Link>
    </Reveal>
  );
}
