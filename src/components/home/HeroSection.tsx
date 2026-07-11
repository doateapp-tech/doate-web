import HeroContent from "./HeroContent";
import "./HeroSection.css";

export default function HeroSection() {
  return (
 <section className="hero-section">
  <div className="hero-content-wrapper">
    <HeroContent />
  </div>
</section>
  );
}