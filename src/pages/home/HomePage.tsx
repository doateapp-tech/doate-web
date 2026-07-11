import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GlassNavbar from "../../components/home/GlassNavbar";
import HeroSection from "../../components/home/HeroSection";
import ImpactoSection from "../../components/home/ImpactoSection";
import ParceirosSection from "../../components/home/ParceirosSection";
import GaleriaSection from "../../components/home/GaleriaSection";
import InformacoesSection from "../../components/home/InformacoesSection";
import Footer from "../../components/home/Footer";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="home-page">
      <GlassNavbar />
      <HeroSection />
      <ImpactoSection />
      <ParceirosSection />
      <GaleriaSection />
      <InformacoesSection />
      <Footer />
    </div>
    
  );
}