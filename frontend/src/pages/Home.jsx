import CampusLife from "../sections/CampusLife.jsx";
import CampusShowcase from "../sections/CampusShowcase.jsx";
import ExperienceTimeline from "../sections/ExperienceTimeline.jsx";
import FinalCta from "../sections/FinalCta.jsx";
import HeroSection from "../sections/HeroSection.jsx";
import LeadershipPreview from "../sections/LeadershipPreview.jsx";
import ProgramsSection from "../sections/ProgramsSection.jsx";
import SignatureModel from "../sections/SignatureModel.jsx";
import StatsStrip from "../sections/StatsStrip.jsx";
import TestimonialsSection from "../sections/TestimonialsSection.jsx";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <SignatureModel />
      <ProgramsSection />
      <CampusShowcase />
      <CampusLife />
      <ExperienceTimeline />
      <LeadershipPreview />
      <TestimonialsSection />
      <FinalCta />
    </>
  );
}
